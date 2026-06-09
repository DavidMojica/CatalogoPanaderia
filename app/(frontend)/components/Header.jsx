// app/(frontend)/components/Header.jsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCarrito } from "@/app/context/CarritoContext";

const IconoCarrito = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const OCULTAR_EN = ["/login"];

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { totalItems } = useCarrito();

  if (OCULTAR_EN.includes(pathname)) return null;
  if (status === "loading") return <div className="h-[60px]" />;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8d8c6] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center gap-6">

        {/* Logo */}
        <Link href="/catalogo" className="text-[17px] font-extrabold text-[#2d1b0e] tracking-tight shrink-0 no-underline">
          Panadería Artesanal
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-1">
          {session && (
            <>
              <Link href="/catalogo" className="text-[14px] text-[#6b5744] font-medium px-3 py-1.5 rounded-md hover:bg-[#faf7f4] no-underline transition-colors">
                Catálogo
              </Link>
              <Link href="/mis-pedidos" className="text-[14px] text-[#6b5744] font-medium px-3 py-1.5 rounded-md hover:bg-[#faf7f4] no-underline transition-colors">
                Mis pedidos
              </Link>
            </>
          )}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2 shrink-0">
          {session ? (
            <>
              {/* Carrito con badge */}
              <Link href="/carrito" className="relative p-2 text-[#6b5744] rounded-md hover:bg-[#faf7f4] no-underline flex items-center transition-colors">
                <IconoCarrito />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#8B5E3C] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-[13px] text-[#8B5E3C] border border-[#d1c4b8] px-3.5 py-1.5 rounded-md font-medium hover:bg-[#faf7f4] cursor-pointer bg-transparent transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className="text-[13px] text-white bg-[#8B5E3C] px-4 py-1.5 rounded-md font-semibold no-underline hover:bg-[#7a5234] transition-colors">
              Iniciar sesión
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
