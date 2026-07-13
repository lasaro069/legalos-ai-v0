import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/theme";

export const metadata: Metadata = {
  title: "LegalOS AI",
  description: "Sistema operativo juridico para abogados modernos"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es" suppressHydrationWarning><body><ThemeProvider><StoreProvider>{children}</StoreProvider></ThemeProvider></body></html>;
}
