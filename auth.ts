import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    // Magic-link email sign-in (primary method — easiest for non-technical operators)
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "noreply@ament.app",
      name: "ament",
    }),
    // Credentials login for dev/seed purposes only
    ...(process.env.NODE_ENV === "development"
      ? [
          Credentials({
            name: "Dev Login",
            credentials: {
              email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
              const parsed = z
                .object({ email: z.string().email() })
                .safeParse(credentials);
              if (!parsed.success) return null;
              // Dev convenience: auto-create the user if they don't exist yet,
              // so local testing doesn't require the seed script to have run.
              const user = await db.user.upsert({
                where: { email: parsed.data.email },
                update: {},
                create: { email: parsed.data.email, name: parsed.data.email.split("@")[0] },
              });
              return user;
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },
});
