"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Tiles } from "@/components/ui/tiles";

const INPUT = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid #d1c4b8",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#2d1b0e",
  backgroundColor: "#faf7f4",
  outline: "none",
  boxSizing: "border-box",
};

const SOCIAL_BTN = {
  width: "42px",
  height: "42px",
  border: "1px solid #d1c4b8",
  borderRadius: "4px",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "17px",
};

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/home");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f9f5f0" }}>
        <p style={{ color: "#6b5744" }}>Cargando...</p>
      </div>
    );
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) setError("Correo o contraseña incorrectos");
  }

  async function handleRegister(e) {
    e.preventDefault();
    // TODO: implementar registro con Supabase
    setError("El registro estará disponible próximamente");
  }

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  const panelX = mode === "login" ? "0%" : "100%";

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9f5f0", colorScheme: "only light" }}>

      {/* Tiles background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, "--tile": "#e8d8c6" }}>
        <Tiles rows={45} cols={16} tileSize="md" />
      </div>

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "min(880px, 95vw)",
          height: "min(540px, 88vh)",
          borderRadius: "4px",
          boxShadow: "0 24px 80px rgba(45,27,14,0.2)",
          overflow: "hidden",
        }}
      >

        {/* ── LOGIN FORM (right half, always mounted) ── */}
        <div
          style={{
            position: "absolute",
            right: 0,
            width: "50%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 36px",
            boxSizing: "border-box",
          }}
        >
          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                style={{ width: "100%" }}
              >
                <h2 style={{ textAlign: "center", fontSize: "22px", fontWeight: "700", color: "#2d1b0e", margin: "0 0 22px" }}>
                  Iniciar sesión
                </h2>

                {error && (
                  <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "8px 12px", borderRadius: "4px", fontSize: "13px", marginBottom: "12px" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  <input type="email" placeholder="Correo electrónico" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required style={INPUT} />
                  <input type="password" placeholder="Contraseña" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={INPUT} />

                  <p style={{ textAlign: "right", fontSize: "12px", color: "#8B5E3C", margin: 0, cursor: "pointer" }}>
                    ¿Olvidaste tu contraseña?
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "12px",
                      backgroundColor: loading ? "#c4a882" : "#8B5E3C",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: loading ? "not-allowed" : "pointer",
                      marginTop: "2px",
                    }}
                  >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                  </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "12px", color: "#9e8675", margin: "16px 0 10px" }}>
                  o inicia con plataformas sociales
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button onClick={() => signIn("google")} style={SOCIAL_BTN} title="Google">
                    <FcGoogle />
                  </button>
                  <button style={{ ...SOCIAL_BTN, color: "#1877F2", cursor: "default", opacity: 0.5 }} title="Facebook (próximamente)" disabled>
                    <FaFacebookF />
                  </button>
                  <button style={{ ...SOCIAL_BTN, color: "#24292e", cursor: "default", opacity: 0.5 }} title="GitHub (próximamente)" disabled>
                    <FaGithub />
                  </button>
                  <button style={{ ...SOCIAL_BTN, color: "#0A66C2", cursor: "default", opacity: 0.5 }} title="LinkedIn (próximamente)" disabled>
                    <FaLinkedinIn />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── REGISTER FORM (left half, always mounted) ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "50%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 36px",
            boxSizing: "border-box",
          }}
        >
          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.22 }}
                style={{ width: "100%" }}
              >
                <h2 style={{ textAlign: "center", fontSize: "22px", fontWeight: "700", color: "#2d1b0e", margin: "0 0 22px" }}>
                  Crear cuenta
                </h2>

                {error && (
                  <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "8px 12px", borderRadius: "4px", fontSize: "13px", marginBottom: "12px" }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                  <input type="text" placeholder="Nombre completo" value={regName} onChange={e => setRegName(e.target.value)} required style={INPUT} />
                  <input type="email" placeholder="Correo electrónico" value={regEmail} onChange={e => setRegEmail(e.target.value)} required style={INPUT} />
                  <input type="password" placeholder="Contraseña" value={regPassword} onChange={e => setRegPassword(e.target.value)} required style={INPUT} />
                  <button
                    type="submit"
                    style={{
                      padding: "12px",
                      backgroundColor: "#8B5E3C",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      marginTop: "4px",
                    }}
                  >
                    Registrarse
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ANIMATED PANEL (slides left ↔ right) ── */}
        <motion.div
          animate={{ x: panelX }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
          style={{
            position: "absolute",
            left: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(150deg, #A0714F 0%, #6b4429 100%)",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 40px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-70px", right: "-70px", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "180px", height: "180px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)" }} />

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="panel-login"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, delay: 0.18 }}
                style={{ position: "relative", zIndex: 1 }}
              >
                <h2 style={{ color: "white", fontSize: "26px", fontWeight: "700", margin: "0 0 14px", lineHeight: 1.3 }}>
                  ¡Hola, bienvenido!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "14px", lineHeight: 1.7, margin: "0 0 32px" }}>
                  ¿Aún no tienes cuenta?<br />Regístrate y haz tu pedido
                </p>
                <button
                  onClick={() => switchMode("register")}
                  style={{
                    border: "1.5px solid rgba(255,255,255,0.75)",
                    backgroundColor: "transparent",
                    color: "white",
                    padding: "10px 38px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    letterSpacing: "0.4px",
                  }}
                >
                  Registrarse
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="panel-register"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, delay: 0.18 }}
                style={{ position: "relative", zIndex: 1 }}
              >
                <h2 style={{ color: "white", fontSize: "26px", fontWeight: "700", margin: "0 0 14px", lineHeight: 1.3 }}>
                  ¡Bienvenido de vuelta!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "14px", lineHeight: 1.7, margin: "0 0 32px" }}>
                  ¿Ya tienes una cuenta?<br />Inicia sesión aquí
                </p>
                <button
                  onClick={() => switchMode("login")}
                  style={{
                    border: "1.5px solid rgba(255,255,255,0.75)",
                    backgroundColor: "transparent",
                    color: "white",
                    padding: "10px 38px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    letterSpacing: "0.4px",
                  }}
                >
                  Iniciar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
