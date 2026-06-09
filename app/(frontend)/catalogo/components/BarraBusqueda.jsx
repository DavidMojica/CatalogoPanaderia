// app/(frontend)/catalogo/components/BarraBusqueda.jsx
"use client";

const IconoLupa = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9e8675]">
    <circle cx="9" cy="9" r="6"/>
    <path d="M15 15l3 3"/>
  </svg>
);

export default function BarraBusqueda({ valor, onChange }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <IconoLupa />
      </div>
      <input
        type="text"
        value={valor}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar pan..."
        className="w-full pl-9 pr-4 py-2.5 border border-[#d1c4b8] rounded-lg text-[14px] text-[#2d1b0e] bg-white placeholder-[#b8a898] outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition-colors"
      />
    </div>
  );
}
