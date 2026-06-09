import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Usuario } from "@/shared/entities/Usuario";
import supabase from "@/services/database";
import { verifyPassword } from "@/services/authService";

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

        const { data: usuario } = await supabase
          .from('usuarios')
          .select('id, nombre, email, imagen, rol')
          .eq('email', credentials.email)
          .maybeSingle();

        if (!usuario) return null;

        const { data: cuenta } = await supabase
          .from('cuentas_auth')
          .select('password_hash')
          .eq('usuario_id', usuario.id)
          .eq('proveedor', 'credentials')
          .maybeSingle();

        if (!cuenta) return null;

        const valida = await verifyPassword(credentials.password, cuenta.password_hash);
        if (!valida) return null;

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          image: usuario.imagen,
        };
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
        // Guardar el usuario en la DB si no existe todavía
        const { data: existente } = await supabase
          .from("usuarios")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        if (!existente) {
          const { data: nuevo } = await supabase
            .from("usuarios")
            .insert({
              nombre: user.name,
              email: user.email,
              imagen: user.image,
              rol: "cliente",
            })
            .select("id")
            .single();

          if (nuevo) {
            await supabase.from("cuentas_auth").insert({
              usuario_id: nuevo.id,
              proveedor: "google",
              proveedor_id: user.id, // ID de Google OAuth
            });
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.nombre = user.name;
        if (account?.provider === "google") {
          // signIn ya guardó el usuario; buscamos su UUID en la DB
          const { data: dbUser } = await supabase
            .from("usuarios")
            .select("id, rol")
            .eq("email", user.email)
            .maybeSingle();
          token.dbId = dbUser?.id;
          token.rol = dbUser?.rol ?? "cliente";
        } else {
          // credentials: authorize() ya retorna el UUID de la DB como user.id
          token.dbId = user.id;
          token.rol = "cliente";
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.dbId;
      session.user.rol = token.rol;
      session.user.nombre = token.nombre;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
