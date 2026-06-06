"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Usuario } from "@/shared/entities/Usuario";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/catalogo");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  const usuario = session
    ? new Usuario(
        session.user.id,
        session.user.nombre ?? session.user.name,
        session.user.email,
        session.user.image,
        session.user.rol
      )
    : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f5f0",
      }}
    >
      <div
        style={{
          padding: "48px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#2d1b0e",
            marginBottom: "8px",
            margin: "0 0 8px 0",
          }}
        >
          Panadería Artesanal
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6b5744",
            marginBottom: "32px",
            margin: "0 0 32px 0",
          }}
        >
          Inicia sesión para hacer tu pedido
        </p>
        <button
          onClick={() => signIn("google")}
          style={{
            border: "1px solid #d1c4b8",
            backgroundColor: "white",
            color: "#2d1b0e",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
