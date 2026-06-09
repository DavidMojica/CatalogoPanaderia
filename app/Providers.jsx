// app/Providers.jsx
// Agrupa todos los providers cliente para que app/layout.js se quede como Server Component.
"use client";

import { SessionProvider } from "next-auth/react";
import { CarritoProvider } from "./context/CarritoContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CarritoProvider>
        {children}
      </CarritoProvider>
    </SessionProvider>
  );
}
