import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const username = process.env.AUTH_USERNAME ?? "admin";
        const password = process.env.AUTH_PASSWORD ?? "codigos2026";

        if (
          credentials?.username === username &&
          credentials?.password === password
        ) {
          return { id: "1", name: "Administrador" };
        }

        return null;
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
