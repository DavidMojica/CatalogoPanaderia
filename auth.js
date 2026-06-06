import GoogleProvider from "next-auth/providers/google";
import { Usuario } from "@/shared/entities/Usuario";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const usuario = Usuario.desdeGoogle({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      });
      console.log("Usuario autenticado:", usuario.toJSON());
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
