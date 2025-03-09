import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import SupabaseProvider from "@/lib/supabase-provider"
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mandi Marketplace",
  description: "Your agricultural marketplace",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SidebarProvider defaultOpen={true}>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-h-screen">
                  {children}
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}

