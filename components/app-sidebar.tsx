"use client"

import { BarChart3, Box, Gavel, Home, LogOut, Package, ShoppingCart, Store, Sun, Moon, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await supabase.auth.signOut()
      router.push('/signin')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const routes = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "My Products",
      icon: Package,
      href: "/products",
    },
    {
      title: "Create Auction",
      icon: Gavel,
      href: "/auctions/create",
    },
    {
      title: "Browse Auctions",
      icon: Store,
      href: "/auctions",
    },
    {
      title: "My Purchases",
      icon: ShoppingCart,
      href: "/purchases",
    },
    {
      title: "Inventory",
      icon: Box,
      href: "/inventory",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
  ]

  // If user is not logged in and not on auth pages, show auth options
  if (!user && !isLoading && !pathname.includes('/signin') && !pathname.includes('/signup')) {
    return (
      <Sidebar>
        <SidebarHeader className="flex items-center px-4 py-2">
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Mandi</span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent className="flex flex-col justify-between h-full">
          <div>
            <p className="px-4 py-2 text-sm text-gray-500">Please sign in to access the marketplace</p>
          </div>
          <div className="px-4 py-2 space-y-2 mt-auto">
            <Link 
              href="/signin"
              className="flex w-full items-center justify-center rounded-md bg-white border border-green-500 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/signup"
              className="flex w-full items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Mandi</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="flex items-center justify-between p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user?.email ? (
                    <AvatarFallback className="bg-green-600 text-white">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.email ? user.email : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

