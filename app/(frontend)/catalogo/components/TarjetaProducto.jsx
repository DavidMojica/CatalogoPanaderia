// app/(frontend)/catalogo/components/TarjetaProducto.jsx
"use client";

function formatearPrecio(precio) {
  return `$ ${new Intl.NumberFormat("es-CO").format(Number(precio))} COP`;
}

export default function TarjetaProducto({ producto, onAgregar, recienAgregado }) {
  const disponible = producto.disponible && producto.stock > 0;
  const descripcionCorta = producto.descripcion?.length > 60
    ? producto.descripcion.slice(0, 60) + "..."
    : (producto.descripcion ?? "");

  return (
    <div className="bg-white rounded-xl border border-[#f0e8df] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      {/* Imagen */}
      <div className="aspect-square bg-[#faf7f4] overflow-hidden relative">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🍞</div>
        )}

        {/* Badge disponibilidad */}
        <span className={`absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          disponible
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}>
          {disponible ? "Disponible" : "Agotado"}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-semibold text-[#2d1b0e] leading-snug mb-1">{producto.nombre}</h3>
        <p className="text-[12px] text-[#9e8675] mb-3 flex-1">{descripcionCorta}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[16px] font-bold text-[#8B5E3C]">{formatearPrecio(producto.precio)}</span>
          <button
            onClick={() => disponible && onAgregar(producto)}
            disabled={!disponible}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all ${
              recienAgregado
                ? "bg-green-600 text-white"
                : disponible
                ? "bg-[#8B5E3C] text-white hover:bg-[#7a5234] active:scale-95"
                : "bg-[#f0e8df] text-[#b8a898] cursor-not-allowed"
            }`}
          >
            {recienAgregado ? "✓ Agregado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
