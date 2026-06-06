"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Usuario } from "@/shared/entities/Usuario";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f9f5f0" }}>
        <p style={{ color: "#6b5744" }}>Cargando...</p>
      </div>
    );
  }

  if (!session) return null;

  const usuario = new Usuario(
    session.user.id,
    session.user.nombre ?? session.user.name,
    session.user.email,
    session.user.image,
    session.user.rol
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9f5f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {usuario.imagen && (
          <img
            src={usuario.imagen}
            alt={usuario.nombre}
            referrerPolicy="no-referrer"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "block",
              border: "3px solid #f0e4d0",
            }}
          />
        )}

        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#2d1b0e", margin: "0 0 4px" }}>
          ¡Bienvenido, {usuario.obtenerNombreCorto()}!
        </h1>
        <p style={{ fontSize: "13px", color: "#9e8675", margin: "0 0 32px" }}>
          Sesión iniciada correctamente
        </p>

        <div
          style={{
            backgroundColor: "#faf7f4",
            borderRadius: "12px",
            padding: "4px 24px",
            marginBottom: "32px",
            textAlign: "left",
          }}
        >
          <DataRow label="Nombre" value={usuario.nombre} />
          <DataRow label="Email" value={usuario.email} />
          <DataRow label="Rol" value={usuario.rol} last />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => router.push("/catalogo")}
            style={{
              padding: "13px",
              backgroundColor: "#8B5E3C",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Ver catálogo
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              padding: "13px",
              backgroundColor: "white",
              color: "#8B5E3C",
              border: "1px solid #d1c4b8",
              borderRadius: "8px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

function DataRow({ label, value, last }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: last ? "none" : "1px solid #ede8e2",
        gap: "16px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#9e8675", fontWeight: "500", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#2d1b0e", fontWeight: "500", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}
