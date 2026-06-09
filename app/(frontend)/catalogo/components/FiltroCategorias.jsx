// app/(frontend)/catalogo/components/FiltroCategorias.jsx
"use client";

export default function FiltroCategorias({ categorias, categoriaActiva, onSeleccionar }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSeleccionar(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          !categoriaActiva
            ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
            : "bg-white text-[#6b5744] border-[#d1c4b8] hover:border-[#8B5E3C] hover:text-[#8B5E3C]"
        }`}
      >
        Todas
      </button>

      {categorias.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSeleccionar(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            categoriaActiva === cat.id
              ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
              : "bg-white text-[#6b5744] border-[#d1c4b8] hover:border-[#8B5E3C] hover:text-[#8B5E3C]"
          }`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
