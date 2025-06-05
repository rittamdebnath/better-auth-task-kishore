import { sendEmail } from "@/config/email";
import {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/security/secrets/env";
import { findUserRole } from "@/services/User.service";
import EmailVerification from "@/templates/emails/email-verification";
import ResetPasswordEmail from "@/templates/emails/reset-password";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { customSession } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "../../db";
import * as schema from "../../models";
import { Users } from "../../models/User";
import { LoginPlugin } from "./plugin";

import type { User } from "better-auth"; // Import the default User type

// Extend the User type to include the 'provider' property
interface ExtendedUser extends User {
  provider?: string;
}

const getAdditionalFields = (schema: PgTable) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const fields: Record<string, any> = {};
  const defaultFields = [
    "id",
    "email",
    "image",
    "emailVerified",
    "createdAt",
    "updatedAt",
  ];

  for (const [key, value] of Object.entries(schema)) {
    if (!defaultFields.includes(key)) {
      fields[key] = {
        type: value.config?.type === "integer" ? "number" : "string",
        required: value.notNull ?? false,
      };
    }
  }

  return fields;
};

const additionalField = getAdditionalFields(Users);

export const auth = betterAuth({
  appName: "Todo",
  user: {
    modelName: "users",
    fields: {
      name: "firstName",
    },
    additionalFields: additionalField,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      await sendEmail(
        user.email,
        "Verify your email",
        EmailVerification({ emailAddress: user.email, verificationUrl: url })
      );
    },
  },
  // Add all possible origins including development, staging and production environments
  trustedOrigins: [
    "http://localhost:3000",
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (data: ExtendedUser) => {
          // Allow sign-up via Google but continue to restrict email sign-ups
          if (data.provider === "google") {
            console.log("[AUTH] Allowing Google user creation");
            return { data };
          }

          throw new APIError("BAD_REQUEST", {
            message: "Signup is disabled for email registration",
          });
        },
      },
    },
  },

  plugins: [
    LoginPlugin(),
    organization({
      allowUserToCreateOrganization: false,
    }),
    customSession(async ({ user, session }) => {
      const role = await findUserRole(Number(session.userId));
      return {
        user: {
          ...user,
          role,
        },
        session,
      };
    }),
  ],

  secret: BETTER_AUTH_SECRET,
  advanced: {
    database: {
      generateId: false,
    },
    // crossSubDomainCookies: {
    //   enabled: false,
    //   // domain: ".Todo.com",
    // },
    // useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      partitioned: true,
      maxAge: 60 * 60 * 24 * 14,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      users: schema.Users,
      account: schema.Account,
      session: schema.Session,
      verification: schema.Verification,
      organization: schema.Organization,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, _request) => {
      await sendEmail(
        user.email,
        "Reset your password",
        ResetPasswordEmail({ emailAddress: user.email, resetPasswordLink: url })
      );
    },
  },

  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      // scope: ["profile", "email"],
      // mapProfileToUser: async (profile) => {
      //   return {
      //     email: profile.email,
      //     firstName: profile.given_name,
      //     lastName: profile.family_name,
      //     image: profile.picture,
      //     provider: "google",
      //   };
      // },
      // Allow sign up via Google
      disableSignUp: false,
      redirectURI: `${BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },
  // account: {
  //   accountLinking: {
  //     enabled: true,
  //     trustedProviders: ["google"],
  //   },
  // },
  // Only disable email sign-up but allow Google sign-up
  disabledPaths: ["/sign-up/email"],
} satisfies BetterAuthOptions);
