import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Usuario } from "@/shared/entities/Usuario";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // TODO: verificar usuario contra Supabase
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const usuario = Usuario.desdeGoogle({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        });
        console.log("Usuario autenticado via Google:", usuario.toJSON());
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.rol = "cliente";
        token.nombre = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.rol = token.rol;
      session.user.nombre = token.nombre;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
