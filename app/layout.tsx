import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { PortalProvider } from "@/components/portal-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vállalkozói Portál – Digitális vállalkozói szolgáltatások",
  description:
    "Kormányzati szintű digitális központ a magyar vállalkozások indításához és fejlődéséhez: edukáció, online megjelenés és vállalkozói fejlődési index egy helyen.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#3743d8",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" data-scroll-behavior="smooth" className={`${inter.variable} ${jakarta.variable} bg-background`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <PortalProvider>{children}</PortalProvider>
      </body>
    </html>
  )
}
