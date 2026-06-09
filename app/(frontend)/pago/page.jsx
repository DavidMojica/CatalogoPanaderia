// app/(frontend)/pago/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// ── Helpers ──────────────────────────────────────────────────
function formatearPesos(valor) {
  return `$ ${new Intl.NumberFormat("es-CO").format(Number(valor))} COP`;
}

function formatearTarjeta(valor) {
  const nums = valor.replace(/\D/g, "").slice(0, 16);
  return nums.match(/.{1,4}/g)?.join(" ") ?? nums;
}

function formatearExpiracion(valor) {
  const raw = valor.replace(/\D/g, "").slice(0, 4);
  return raw.length > 2 ? raw.slice(0, 2) + "/" + raw.slice(2) : raw;
}

// ── SVG icons ─────────────────────────────────────────────────
const IcoTarjeta = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="5" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="2" y="10" width="24" height="5" fill="currentColor" opacity="0.15"/>
    <rect x="5" y="18" width="7" height="2" rx="1" fill="currentColor"/>
  </svg>
);

const IcoPSE = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="7" width="22" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="14" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 10.5v7M10.5 14h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IcoEfecty = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 8v2.5M14 17.5V20M9 14h2.5M16.5 14H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11.5 10.5a3.5 3.5 0 015 4.5M16.5 17.5a3.5 3.5 0 01-5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IcoCheck = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="2"/>
    <path d="M20 32l9 9 15-18" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IcoError = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
    <path d="M22 22l20 20M42 22L22 42" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const Spinner = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" style={{ animation: "rotar 0.75s linear infinite" }}>
    <circle cx="26" cy="26" r="22" fill="none" stroke="#e8d8c6" strokeWidth="4"/>
    <path d="M48 26a22 22 0 00-22-22" stroke="#8B5E3C" strokeWidth="4" strokeLinecap="round" fill="none"/>
  </svg>
);

// ── Métodos de pago ───────────────────────────────────────────
const METODOS = [
  {
    id: "Tarjeta de crédito",
    titulo: "Tarjeta de crédito",
    descripcion: "Visa, Mastercard, American Express",
    Icono: IcoTarjeta,
  },
  {
    id: "Tarjeta débito (PSE)",
    titulo: "Tarjeta débito (PSE)",
    descripcion: "Débito desde tu cuenta bancaria",
    Icono: IcoPSE,
  },
  {
    id: "Efectivo (Efecty)",
    titulo: "Efectivo (Efecty)",
    descripcion: "Paga en el punto Efecty más cercano",
    Icono: IcoEfecty,
  },
];

// ── Barra de progreso ─────────────────────────────────────────
function BarraProgreso({ paso }) {
  const pasos = ["Método", "Datos", "Confirmación"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
      {pasos.map((label, i) => {
        const num = i + 1;
        const activo = num === paso;
        const completado = num < paso;
        return (
          <div key={num} style={{ display: "flex", alignItems: "center", flex: num < pasos.length ? 1 : "unset" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: "700",
                backgroundColor: completado ? "#8B5E3C" : activo ? "#2d1b0e" : "#f0e8df",
                color: completado || activo ? "white" : "#b8a898",
                transition: "all 0.2s",
              }}>
                {completado ? "✓" : num}
              </div>
              <span style={{ fontSize: "11px", color: activo ? "#2d1b0e" : "#9e8675", fontWeight: activo ? "600" : "400", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {num < pasos.length && (
              <div style={{
                flex: 1, height: "2px", margin: "0 6px", marginBottom: "16px",
                backgroundColor: completado ? "#8B5E3C" : "#e8d8c6",
                transition: "background-color 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────
export default function PagoPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pedidoId = searchParams.get("pedidoId");
  const monto = searchParams.get("monto");

  const [paso, setPaso] = useState(1);
  const [metodoPago, setMetodoPago] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [nombreTarjeta, setNombreTarjeta] = useState("");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && (!pedidoId || !monto)) router.replace("/home");
  }, [status, pedidoId, monto, router]);

  async function pagar() {
    setPaso(3);
    setProcesando(true);
    setError(null);
    try {
      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId, metodoPago }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al procesar el pago");
      setResultado(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  }

  function reintentar() {
    setPaso(1);
    setMetodoPago("");
    setNumeroCuenta("");
    setNombreTarjeta("");
    setExpiracion("");
    setCvv("");
    setResultado(null);
    setError(null);
    setProcesando(false);
  }

  const esEfecty = metodoPago === "Efectivo (Efecty)";
  const esTarjeta = metodoPago === "Tarjeta de crédito" || metodoPago === "Tarjeta débito (PSE)";

  if (status === "loading" || !pedidoId || !monto) {
    return <div style={E.centrado}><p style={E.subtexto}>Cargando...</p></div>;
  }

  return (
    <div style={E.fondo}>
      <style>{`@keyframes rotar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div style={E.tarjeta}>
        <h1 style={E.titulo}>Pago seguro</h1>
        <BarraProgreso paso={paso} />

        {/* ── PASO 1 — Selección de método ── */}
        {paso === 1 && (
          <div>
            <p style={E.subtitulo}>Selecciona cómo quieres pagar</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {METODOS.map(({ id, titulo, descripcion, Icono }) => {
                const seleccionado = metodoPago === id;
                return (
                  <button
                    key={id}
                    onClick={() => setMetodoPago(id)}
                    style={{
                      ...E.tarjetaMetodo,
                      borderColor: seleccionado ? "#2d1b0e" : "#e8d8c6",
                      backgroundColor: seleccionado ? "#faf7f4" : "white",
                      boxShadow: seleccionado ? "0 0 0 2px #2d1b0e" : "none",
                    }}
                  >
                    <span style={{ color: seleccionado ? "#2d1b0e" : "#8B5E3C" }}>
                      <Icono />
                    </span>
                    <div style={{ textAlign: "left", flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#2d1b0e" }}>{titulo}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#9e8675", marginTop: "2px" }}>{descripcion}</p>
                    </div>
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%",
                      border: `2px solid ${seleccionado ? "#2d1b0e" : "#d1c4b8"}`,
                      backgroundColor: seleccionado ? "#2d1b0e" : "white",
                      flexShrink: 0,
                    }} />
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPaso(2)}
              disabled={!metodoPago}
              style={{ ...E.btnPrimario, opacity: metodoPago ? 1 : 0.45, cursor: metodoPago ? "pointer" : "not-allowed" }}
            >
              Continuar
            </button>
          </div>
        )}

        {/* ── PASO 2 — Datos del pago ── */}
        {paso === 2 && (
          <div>
            <p style={E.subtitulo}>{metodoPago}</p>

            {esTarjeta && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                {/* Logos de tarjetas */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
                  <span style={E.logoVisa}>VISA</span>
                  <span style={E.logoMC}><span style={{ color: "#eb001b" }}>●</span><span style={{ color: "#f79e1b" }}>●</span> MC</span>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="•••• •••• •••• ••••"
                  value={numeroCuenta}
                  onChange={e => setNumeroCuenta(formatearTarjeta(e.target.value))}
                  style={E.input}
                />
                <input
                  type="text"
                  placeholder="Nombre como aparece en la tarjeta"
                  value={nombreTarjeta}
                  onChange={e => setNombreTarjeta(e.target.value.toUpperCase())}
                  style={E.input}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={expiracion}
                    onChange={e => setExpiracion(formatearExpiracion(e.target.value))}
                    style={{ ...E.input, flex: 1 }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="CVV"
                    maxLength={4}
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    style={{ ...E.input, flex: 1 }}
                  />
                </div>
              </div>
            )}

            {esEfecty && (
              <div style={E.cajaPSE}>
                <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#9e8675" }}>Código de referencia</p>
                <p style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: "800", fontFamily: "monospace", color: "#2d1b0e", letterSpacing: "3px" }}>
                  {pedidoId.slice(0, 8).toUpperCase()}
                </p>
                <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#6b5744", lineHeight: 1.6 }}>
                  Dirígete al punto Efecty más cercano y presenta este código de referencia al cajero.
                </p>
                <div style={{ ...E.filaDato, borderTop: "1px solid #e8d8c6", paddingTop: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#9e8675" }}>Monto a pagar</span>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#8B5E3C" }}>{formatearPesos(monto)}</span>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setPaso(1)} style={E.btnSecundario}>Atrás</button>
              <button onClick={pagar} style={{ ...E.btnPrimario, flex: 1 }}>
                {esEfecty ? "Ya realicé el pago" : `Pagar ${formatearPesos(monto)}`}
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3 — Procesando / Resultado ── */}
        {paso === 3 && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            {procesando && (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                  <Spinner />
                </div>
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#2d1b0e", margin: "0 0 6px" }}>
                  Procesando tu pago...
                </p>
                <p style={{ fontSize: "13px", color: "#9e8675", margin: 0 }}>
                  Por favor no cierres esta ventana
                </p>
              </>
            )}

            {!procesando && resultado && (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                  <IcoCheck />
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#16a34a", margin: "0 0 8px" }}>
                  ¡Pago aprobado!
                </h2>
                <p style={{ fontSize: "13px", color: "#6b5744", margin: "0 0 24px" }}>
                  Tu pedido ha sido confirmado exitosamente.
                </p>
                <div style={E.cajaPSE}>
                  <div style={E.filaDato}>
                    <span style={{ fontSize: "12px", color: "#9e8675" }}>Referencia</span>
                    <span style={{ fontSize: "13px", fontFamily: "monospace", fontWeight: "600", color: "#2d1b0e" }}>{resultado.referencia}</span>
                  </div>
                  <div style={{ ...E.filaDato, borderTop: "1px solid #e8d8c6", paddingTop: "10px", marginTop: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#9e8675" }}>Monto pagado</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#8B5E3C" }}>{formatearPesos(monto)}</span>
                  </div>
                </div>
                <button onClick={() => router.push("/mis-pedidos")} style={E.btnPrimario}>
                  Ver mis pedidos
                </button>
              </>
            )}

            {!procesando && error && (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                  <IcoError />
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#dc2626", margin: "0 0 8px" }}>
                  Hubo un problema con tu pago
                </h2>
                <p style={{ fontSize: "13px", color: "#6b5744", margin: "0 0 20px" }}>{error}</p>
                <button onClick={reintentar} style={E.btnPrimario}>
                  Intentar de nuevo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const E = {
  fondo: {
    minHeight: "100vh",
    backgroundColor: "#f9f5f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  centrado: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f5f0",
  },
  tarjeta: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 8px 40px rgba(45,27,14,0.12)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "480px",
  },
  titulo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#2d1b0e",
    margin: "0 0 28px",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: "13px",
    color: "#9e8675",
    margin: "0 0 14px",
    textAlign: "center",
  },
  tarjetaMetodo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    border: "1.5px solid",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    background: "none",
    textAlign: "left",
    transition: "all 0.15s",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #d1c4b8",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#2d1b0e",
    backgroundColor: "#faf7f4",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  cajaPSE: {
    backgroundColor: "#faf7f4",
    border: "1px solid #e8d8c6",
    borderRadius: "8px",
    padding: "16px 18px",
    marginBottom: "20px",
    textAlign: "center",
  },
  filaDato: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoVisa: {
    padding: "3px 8px",
    border: "1px solid #1a1f71",
    borderRadius: "3px",
    fontSize: "11px",
    fontWeight: "900",
    color: "#1a1f71",
    letterSpacing: "1px",
  },
  logoMC: {
    padding: "3px 8px",
    border: "1px solid #d1c4b8",
    borderRadius: "3px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#555",
    letterSpacing: "1px",
  },
  btnPrimario: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#8B5E3C",
    color: "white",
    border: "none",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "0",
  },
  btnSecundario: {
    padding: "13px 18px",
    backgroundColor: "transparent",
    color: "#8B5E3C",
    border: "1.5px solid #d1c4b8",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    flexShrink: 0,
  },
  subtexto: {
    fontSize: "14px",
    color: "#9e8675",
  },
};
