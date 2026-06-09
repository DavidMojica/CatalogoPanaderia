// app/(frontend)/carrito/page.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/app/context/CarritoContext";

function formatearPesos(valor) {
  return `$ ${new Intl.NumberFormat("es-CO").format(Number(valor))} COP`;
}

export default function CarritoPage() {
  const router = useRouter();
  const {
    items,
    aumentarCantidad,
    disminuirCantidad,
    quitarProducto,
    vaciarCarrito,
    totalItems,
    totalPrecio,
  } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🧺</p>
          <h2 className="text-xl font-bold text-[#2d1b0e] mb-2">Tu carrito está vacío</h2>
          <p className="text-[#9e8675] text-sm mb-6">Aún no has agregado ningún producto.</p>
          <Link
            href="/catalogo"
            className="inline-block bg-[#8B5E3C] text-white px-6 py-3 rounded-lg font-semibold no-underline hover:bg-[#7a5234] transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f5f0]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#2d1b0e] mb-6">Tu carrito</h1>

        {/* Lista de items */}
        <div className="bg-white rounded-xl border border-[#f0e8df] shadow-sm overflow-hidden mb-6">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-4 ${
                i < items.length - 1 ? "border-b border-[#f0e8df]" : ""
              }`}
            >
              {/* Imagen */}
              <div className="w-[60px] h-[60px] rounded-lg bg-[#faf7f4] overflow-hidden shrink-0">
                {item.imagen ? (
                  <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🍞</div>
                )}
              </div>

              {/* Nombre y precio unitario */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#2d1b0e] truncate">{item.nombre}</p>
                <p className="text-[12px] text-[#9e8675]">{formatearPesos(item.precio)} c/u</p>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => disminuirCantidad(item.id)}
                  className="w-7 h-7 rounded-full border border-[#d1c4b8] text-[#8B5E3C] font-bold flex items-center justify-center hover:bg-[#faf7f4] transition-colors text-base leading-none"
                >
                  −
                </button>
                <span className="w-6 text-center text-[14px] font-semibold text-[#2d1b0e]">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => aumentarCantidad(item.id)}
                  className="w-7 h-7 rounded-full border border-[#d1c4b8] text-[#8B5E3C] font-bold flex items-center justify-center hover:bg-[#faf7f4] transition-colors text-base leading-none"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="text-[14px] font-bold text-[#8B5E3C] w-28 text-right shrink-0">
                {formatearPesos(item.precio * item.cantidad)}
              </p>

              {/* Eliminar */}
              <button
                onClick={() => quitarProducto(item.id)}
                className="text-[#d1c4b8] hover:text-red-500 transition-colors text-lg leading-none ml-1 shrink-0"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-xl border border-[#f0e8df] shadow-sm p-5 mb-4">
          <div className="flex justify-between text-[13px] text-[#9e8675] mb-2">
            <span>{totalItems} {totalItems === 1 ? "producto" : "productos"}</span>
            <span>{formatearPesos(totalPrecio)}</span>
          </div>
          <div className="border-t border-[#f0e8df] mt-3 pt-3 flex justify-between items-center">
            <span className="font-bold text-[#2d1b0e] text-[15px]">Total a pagar</span>
            <span className="text-[20px] font-bold text-[#8B5E3C]">{formatearPesos(totalPrecio)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={vaciarCarrito}
            className="flex-1 py-3 border border-[#d1c4b8] text-[#8B5E3C] font-semibold rounded-lg hover:bg-[#faf7f4] transition-colors bg-white text-[14px]"
          >
            Vaciar carrito
          </button>
          <button
            onClick={() => router.push("/pedido")}
            className="flex-1 py-3 bg-[#8B5E3C] text-white font-semibold rounded-lg hover:bg-[#7a5234] transition-colors text-[14px]"
          >
            Confirmar pedido →
          </button>
        </div>
      </div>
    </div>
  );
}
