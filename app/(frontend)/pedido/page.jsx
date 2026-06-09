// app/(frontend)/pedido/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/app/context/CarritoContext";

function formatearPesos(valor) {
  return `$ ${new Intl.NumberFormat("es-CO").format(Number(valor))} COP`;
}

export default function PedidoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, totalPrecio, vaciarCarrito } = useCarrito();

  const [cargando, setCargando] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && items.length === 0 && !pedidoConfirmado) {
      router.replace("/catalogo");
    }
  }, [status, items.length, pedidoConfirmado, router]);

  async function confirmarPedido() {
    setError("");
    setCargando(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          detalles: items.map(item => ({
            productoId: item.id,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo crear el pedido.");
      vaciarCarrito();
      setPedidoConfirmado(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f9f5f0] flex items-center justify-center">
        <p className="text-[#6b5744] text-sm">Cargando...</p>
      </div>
    );
  }

  // ── Pantalla de éxito ─────────────────────────────────────
  if (pedidoConfirmado) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] flex items-center justify-center px-6">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M7 16l7 7 11-14" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#2d1b0e] mb-2">¡Pedido confirmado!</h1>
          <p className="text-sm text-[#9e8675] mb-6">Tu pedido fue recibido correctamente.</p>

          <div className="bg-[#faf7f4] border border-[#e8d8c6] rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#9e8675]">Número de pedido</span>
              <span className="font-mono font-bold text-[#2d1b0e]">
                #{pedidoConfirmado.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-[#e8d8c6] pt-3">
              <span className="font-bold text-[#2d1b0e]">Total pagado</span>
              <span className="font-bold text-[#8B5E3C]">{formatearPesos(pedidoConfirmado.total)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/catalogo")}
            className="w-full py-3 bg-[#8B5E3C] text-white font-semibold rounded-lg hover:bg-[#7a5234] transition-colors"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  // ── Resumen del pedido ────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f9f5f0] flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-[#2d1b0e] text-center mb-6">Confirmar pedido</h1>

        {/* Datos del usuario */}
        {session?.user && (
          <div className="bg-[#faf7f4] border border-[#e8d8c6] rounded-lg px-4 py-3 mb-5 text-sm">
            <p className="font-semibold text-[#2d1b0e]">
              {session.user.nombre ?? session.user.name}
            </p>
            <p className="text-[#9e8675]">{session.user.email}</p>
          </div>
        )}

        {/* Lista de productos */}
        <ul className="space-y-2 mb-4">
          {items.map(item => (
            <li key={item.id} className="flex justify-between items-center py-2 border-b border-[#f0e8df] text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#8B5E3C] min-w-[20px]">{item.cantidad}×</span>
                <span className="text-[#2d1b0e]">{item.nombre}</span>
              </div>
              <span className="text-[#6b5744] font-medium whitespace-nowrap">
                {formatearPesos(item.precio * item.cantidad)}
              </span>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t-2 border-[#e8d8c6] mb-5">
          <span className="font-bold text-[#2d1b0e]">Total</span>
          <span className="text-[20px] font-bold text-[#8B5E3C]">{formatearPesos(totalPrecio)}</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <button
          onClick={confirmarPedido}
          disabled={cargando}
          className={`w-full py-3 rounded-lg text-white font-semibold text-[15px] transition-colors mb-3 ${
            cargando ? "bg-[#c4a882] cursor-not-allowed" : "bg-[#8B5E3C] hover:bg-[#7a5234] cursor-pointer"
          }`}
        >
          {cargando ? "Procesando..." : "Confirmar y pagar"}
        </button>

        <button
          onClick={() => router.back()}
          disabled={cargando}
          className="w-full py-3 rounded-lg border border-[#d1c4b8] text-[#8B5E3C] font-semibold text-[14px] bg-white hover:bg-[#faf7f4] transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
