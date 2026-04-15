import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VentaSimple · Panel Administrativo",
  description: "Gestioná tu negocio con VentaSimple. Panel web para sincronizar, analizar y operar tu punto de venta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
