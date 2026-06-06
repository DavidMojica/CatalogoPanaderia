"use client";

import { SessionProvider } from "next-auth/react";

export default function FrontendLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
