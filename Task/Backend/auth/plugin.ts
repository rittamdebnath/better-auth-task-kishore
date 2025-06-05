import { userExistByEmail } from "@/services/User.service";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";

const loginEndpoints = [
  "/sign-in/email",
  "/forget-password",
  "/send-verification-email",
];

export const LoginPlugin = () => {
  return {
    hooks: {
      before: [
        {
          matcher: (ctx) => loginEndpoints.includes(ctx.path),
          handler: createAuthMiddleware(async (ctx) => {
            const isExist = await userExistByEmail(ctx.body.email);

            if (!isExist) {
              throw new APIError("BAD_REQUEST", {
                message: "No user found with this email",
              });
            }
          }),
        },
      ],
    },

    // Add rate limiting for login endpoints - Rule: Security
    rateLimit: [
      // {
      //   pathMatcher: (path) => path === "/sign-in/social",
      //   max: 5, // 5 attempts
      //   window: 60, // in 60 seconds
      // },
      {
        pathMatcher: (path) => path === "/forget-password",
        max: 10, // 10 attempts
        window: 60, // in 60 seconds
      },
    ],
    id: "Login-Plugin",
  } satisfies BetterAuthPlugin;
};
