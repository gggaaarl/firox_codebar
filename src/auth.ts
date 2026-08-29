import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyAppUser } from "@/lib/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (
            typeof credentials?.username !== "string" ||
            typeof credentials?.password !== "string"
          ) {
            return null;
          }

          const user = await verifyAppUser(
            credentials.username,
            credentials.password
          );
          if (!user) return null;

          return {
            id: user.id,
            name: user.displayName,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
