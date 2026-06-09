// app/(frontend)/components/TarjetaProducto.jsx
"use client";

export default function TarjetaProducto({ producto, categoriaNombre, onAgregar, recienAgregado }) {
  const precio = new Intl.NumberFormat("es-CO").format(Number(producto.precio));
  const agotado = !producto.disponible || producto.stock === 0;

  return (
    <div className="bg-white rounded-xl border border-[#f0e8df] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Imagen */}
      <div className="aspect-square bg-[#faf7f4] overflow-hidden relative">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🍞</div>
        )}
        {agotado && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#9e8675] bg-white px-2 py-1 rounded-full border border-[#e8d8c6]">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {categoriaNombre && (
          <p className="text-[11px] text-[#9e8675] uppercase tracking-wide mb-1">{categoriaNombre}</p>
        )}
        <h3 className="text-[15px] font-semibold text-[#2d1b0e] leading-snug mb-1">{producto.nombre}</h3>
        <p className="text-[12px] text-[#9e8675] mb-3 line-clamp-2 flex-1">{producto.descripcion}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[16px] font-bold text-[#8B5E3C]">$ {precio}</span>
          <button
            onClick={() => !agotado && onAgregar(producto)}
            disabled={agotado}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all ${
              recienAgregado
                ? "bg-green-600 text-white scale-95"
                : agotado
                ? "bg-[#f0e8df] text-[#b8a898] cursor-not-allowed"
                : "bg-[#8B5E3C] text-white hover:bg-[#7a5234] active:scale-95"
            }`}
          >
            {recienAgregado ? "✓ Agregado" : agotado ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
