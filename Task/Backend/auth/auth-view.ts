import { type Context, Elysia } from "elysia";
import { auth } from "./auth";

// Improved betterAuthView function
const betterAuthView = async (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    const body = context.body as BodyInit;

    // Create a new request to avoid directly mutating context.request
    const newRequest = new Request(context.request.url, {
      method: context.request.method,
      headers: context.request.headers,
      body,
    });

    return await auth.handler(newRequest);
  }
  context.error(405); // Method Not Allowed
};

// Elysia auth service
export const authService = new Elysia()
  .parser("custom", ({ request }) => {
    return request.text(); // Custom parser to read raw text body
  })
  .all("/api/auth/*", betterAuthView, {
    parse: "custom",
  });

// Singleton HeaderStore for managing headers
export class HeaderStore {
  private static instance: HeaderStore;
  private headers: Record<string, string> = {};

  private constructor() {}

  public static getInstance(): HeaderStore {
    if (!HeaderStore.instance) {
      HeaderStore.instance = new HeaderStore();
    }
    return HeaderStore.instance;
  }

  public setHeaders(headers: Record<string, string>): void {
    this.headers = { ...headers }; // Ensure immutability
  }

  public getHeaders(): Record<string, string> {
    return { ...this.headers }; // Return a copy for safety
  }
}

// Helper function to get headers from the HeaderStore
function getHeaders(): Record<string, string> {
  return HeaderStore.getInstance().getHeaders();
}

// Define interfaces to match actual structure
interface AuthSession {
  id: number;
  expiresAt: string; // Use string since dates are serialized in JSON
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: number;
  activeOrganizationId?: number;
}

interface AuthUser {
  id: number;
  name?: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  organizationId?: number;
  role?: {
    role: string;
  };
}

interface AuthData {
  user: AuthUser;
  session: AuthSession;
}

// Define the return type for getCurrentUser
interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: string;
  organization?: {
    id?: number;
    activeId?: number;
  };
  session: {
    id: number;
    expiresAt: string;
    isValid: boolean;
  };
}

// Type guard to validate AuthData structure
function isAuthData(data: unknown): data is AuthData {
  return (
    typeof data === "object" &&
    data !== null &&
    "user" in data &&
    "session" in data
  );
}

// Function to get the current authenticated user
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const authData = await auth.api.getSession({
      headers: new Headers(getHeaders()),
    });

    if (!isAuthData(authData)) {
      return null;
    }

    const { user, session } = authData;

    const currentUser: CurrentUser = {
      id: user.id,
      email: user.email,
      name: user.name || "",
      role: user.role?.role || "GUEST",
      organization: user.organizationId
        ? {
            id: user.organizationId,
            activeId: session.activeOrganizationId || user.organizationId,
          }
        : undefined,
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
        isValid: new Date(session.expiresAt) > new Date(),
      },
    };

    return currentUser;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// Function to get the current user's organization ID
export async function getCurrentUserOrganizationId(): Promise<number | null> {
  try {
    const user = await getCurrentUser();
    return user?.organization?.id || null;
  } catch (error) {
    console.error("Error fetching organization ID:", error);
    return null;
  }
}
