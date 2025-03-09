import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import SupabaseProvider from "@/lib/supabase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mandi - B2B Agricultural Marketplace",
  description: "Connect, trade, and grow with the leading B2B platform for agricultural products",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SidebarProvider defaultOpen={true}>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset className="flex-1 w-full">
                  <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                    <SidebarTrigger />
                    <div className="flex-1">
                      <h1 className="text-lg font-semibold md:text-xl">Mandi Marketplace</h1>
                    </div>
                  </header>
                  <main className="flex-1 w-full">{children}</main>
                </SidebarInset>
              </div>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}

