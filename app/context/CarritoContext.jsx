// app/context/CarritoContext.jsx
"use client";

import { createContext, useContext, useState } from "react";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  function agregarProducto(producto) {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        return prev.map(i =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function quitarProducto(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function aumentarCantidad(id) {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i)
    );
  }

  function disminuirCantidad(id) {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.cantidad <= 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
    });
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrecio = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <CarritoContext.Provider value={{
      items,
      agregarProducto,
      quitarProducto,
      aumentarCantidad,
      disminuirCantidad,
      vaciarCarrito,
      totalItems,
      totalPrecio,
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
