// app/(frontend)/mis-pedidos/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function formatearPesos(valor) {
  return `$ ${new Intl.NumberFormat("es-CO").format(Number(valor))} COP`;
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  });
}

const BADGE = {
  pagado:    { bg: "#dcfce7", color: "#15803d", texto: "Pagado" },
  pendiente: { bg: "#fef9c3", color: "#854d0e", texto: "Pendiente" },
  cancelado: { bg: "#fee2e2", color: "#b91c1c", texto: "Cancelado" },
};

function BadgeEstado({ estado }) {
  const cfg = BADGE[estado] ?? { bg: "#f0e8df", color: "#6b5744", texto: estado };
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: cfg.bg,
      color: cfg.color,
    }}>
      {cfg.texto}
    </span>
  );
}

export default function MisPedidosPage() {
  const { status } = useSession();
  const router = useRouter();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/mis-pedidos")
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setPedidos(json.data ?? []);
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, [status]);

  if (status === "loading" || cargando) {
    return (
      <div style={E.centrado}>
        <p style={E.subtexto}>Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div style={E.fondo}>
      <div style={E.contenedor}>

        <div style={E.encabezado}>
          <h1 style={E.titulo}>Mis pedidos</h1>
          <button onClick={() => router.push("/catalogo")} style={E.btnSecundario}>
            Seguir comprando
          </button>
        </div>

        {error && (
          <div style={E.errorBox}>{error}</div>
        )}

        {!error && pedidos.length === 0 && (
          <div style={E.vacioCaja}>
            <p style={{ fontSize: "40px", margin: "0 0 12px" }}>🧺</p>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#2d1b0e", margin: "0 0 8px" }}>
              Aún no tienes pedidos
            </p>
            <p style={{ fontSize: "13px", color: "#9e8675", margin: "0 0 24px" }}>
              Explora nuestro catálogo y haz tu primer pedido
            </p>
            <button onClick={() => router.push("/catalogo")} style={E.btnPrimario}>
              Ver catálogo
            </button>
          </div>
        )}

        {pedidos.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {pedidos.map(pedido => {
              const pago = Array.isArray(pedido.pagos) ? pedido.pagos[0] : pedido.pagos;
              return (
                <div key={pedido.id} style={E.tarjeta}>

                  {/* Cabecera de la tarjeta */}
                  <div style={E.cabecera}>
                    <div>
                      <p style={E.idPedido}>#{pedido.id.slice(0, 8).toUpperCase()}</p>
                      <p style={E.fecha}>{formatearFecha(pedido.creado_en)}</p>
                    </div>
                    <BadgeEstado estado={pedido.estado} />
                  </div>

                  {/* Separador */}
                  <div style={{ borderTop: "1px solid #f0e8df", margin: "12px 0" }} />

                  {/* Detalle */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <p style={E.etiqueta}>Total del pedido</p>
                      <p style={E.total}>{formatearPesos(pedido.total)}</p>
                    </div>
                    {pago?.proveedor && (
                      <div style={{ textAlign: "right" }}>
                        <p style={E.etiqueta}>Método de pago</p>
                        <p style={E.metodoPago}>{pago.proveedor}</p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

const E = {
  fondo: {
    minHeight: "100vh",
    backgroundColor: "#f9f5f0",
    padding: "32px 24px",
  },
  centrado: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f5f0",
  },
  contenedor: {
    maxWidth: "680px",
    margin: "0 auto",
  },
  encabezado: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  titulo: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2d1b0e",
    margin: 0,
  },
  tarjeta: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px 22px",
    boxShadow: "0 2px 12px rgba(45,27,14,0.07)",
    border: "1px solid #f0e8df",
  },
  cabecera: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  idPedido: {
    margin: "0 0 2px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#2d1b0e",
    fontFamily: "monospace",
  },
  fecha: {
    margin: 0,
    fontSize: "12px",
    color: "#9e8675",
  },
  etiqueta: {
    margin: "0 0 2px",
    fontSize: "11px",
    color: "#9e8675",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  total: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#8B5E3C",
  },
  metodoPago: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "500",
    color: "#6b5744",
  },
  vacioCaja: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(45,27,14,0.07)",
    border: "1px solid #f0e8df",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  subtexto: {
    fontSize: "14px",
    color: "#9e8675",
  },
  btnPrimario: {
    padding: "11px 24px",
    backgroundColor: "#8B5E3C",
    color: "white",
    border: "none",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnSecundario: {
    padding: "9px 18px",
    backgroundColor: "transparent",
    color: "#8B5E3C",
    border: "1.5px solid #d1c4b8",
    borderRadius: "7px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
