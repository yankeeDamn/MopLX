import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * ⚠️ WARNING: IN-MEMORY USER STORAGE
 * 
 * This implementation uses in-memory storage for demonstration purposes only.
 * In production, you MUST connect to a real database (e.g., PostgreSQL, MongoDB).
 * 
 * Current limitations:
 * - All user data is lost on server restart
 * - Won't work properly in serverless/distributed environments (each instance has its own memory)
 * - Not suitable for production use
 * 
 * To use with a database, install Prisma and update the functions below:
 * - npm install prisma @prisma/client
 * - Update findUserByEmail, findUserById, createUser, etc. to use Prisma
 * 
 * See README.md for detailed database setup instructions.
 */

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  emailVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
}

// In-memory storage - REPLACE WITH DATABASE IN PRODUCTION
export const users: User[] = [];

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function findUserByVerificationToken(token: string): User | undefined {
  return users.find((u) => u.verificationToken === token);
}

export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomUUID();
  
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    emailVerified: false,
    verificationToken,
    createdAt: new Date(),
  };
  
  users.push(user);
  return user;
}

export function verifyUserEmail(userId: string): boolean {
  const user = findUserById(userId);
  if (user) {
    user.emailVerified = true;
    user.verificationToken = undefined;
    return true;
  }
  return false;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = findUserByEmail(email);
        
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
