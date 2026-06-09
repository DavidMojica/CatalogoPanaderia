// app/(frontend)/catalogo/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/app/context/CarritoContext";
import TarjetaProducto from "./components/TarjetaProducto";
import FiltroCategorias from "./components/FiltroCategorias";
import BarraBusqueda from "./components/BarraBusqueda";

export default function CatalogoPage() {
  const { status } = useSession();
  const router = useRouter();
  const { agregarProducto } = useCarrito();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [recienAgregado, setRecienAgregado] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/productos").then(r => r.json()),
      fetch("/api/categorias").then(r => r.json()),
    ])
      .then(([prods, cats]) => {
        if (prods.error) throw new Error(prods.error);
        if (cats.error) throw new Error(cats.error);
        setProductos(prods.data ?? []);
        setCategorias(cats.data ?? []);
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, [status]);

  function handleAgregar(producto) {
    agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      imagen: producto.imagen,
    });
    setRecienAgregado(producto.id);
    setTimeout(() => setRecienAgregado(null), 1200);
  }

  // Filtrado en el cliente
  const productosFiltrados = productos.filter(p => {
    const pasaCategoria = !categoriaActiva || p.categoriaId === categoriaActiva;
    const pasaBusqueda = !terminoBusqueda ||
      p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
    return pasaCategoria && pasaBusqueda;
  });

  if (status === "loading" || cargando) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] flex items-center justify-center">
        <p className="text-[#6b5744]">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] flex items-center justify-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f5f0]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[#2d1b0e] mb-6">Nuestro catálogo</h1>

        {/* Filtro de categorías */}
        {categorias.length > 0 && (
          <div className="mb-4">
            <FiltroCategorias
              categorias={categorias}
              categoriaActiva={categoriaActiva}
              onSeleccionar={setCategoriaActiva}
            />
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="mb-4 max-w-sm">
          <BarraBusqueda
            valor={terminoBusqueda}
            onChange={setTerminoBusqueda}
          />
        </div>

        {/* Contador */}
        <p className="text-[13px] text-[#9e8675] mb-5">
          {productosFiltrados.length}{" "}
          {productosFiltrados.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>

        {/* Grid */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#9e8675]">No encontramos productos con ese criterio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {productosFiltrados.map(producto => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                onAgregar={handleAgregar}
                recienAgregado={recienAgregado === producto.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
