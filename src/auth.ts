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
        const username = credentials?.username;
        const password = credentials?.password;
        if (!username || !password) return null;

        const user = await verifyAppUser(username, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.displayName,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
