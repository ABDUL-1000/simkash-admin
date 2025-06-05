"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Search, LogOut, LayoutDashboard, Settings, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthAPI } from "@/lib/API/api"

interface NavbarProps {
  username?: string
  email?: string
}

export function Navbar({ username = "Yusuf", email = "yusufababa50@gmail.com" }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const currentTime = new Date()
  const hours = currentTime.getHours()

  let greeting = "Good Morning"
  if (hours >= 12 && hours < 17) {
    greeting = "Good Afternoon"
  } else if (hours >= 17) {
    greeting = "Good Evening"
  }

  const handleLogout = async () => {
    await AuthAPI.logout()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Logo - Left aligned */}
        <Link href="/dashboard" className="flex items-center justify-center gap-2 font-semibold lg:hidden">
          <Image src="/simcard.png" alt="Simkash Logo" width={24} height={24} />
          <span className="text-lg font-bold text-slate-800">simkash</span>
        </Link>

        {/* Desktop Greeting */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-medium">
            {greeting}, {username}
          </h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search - Hidden on small screens */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 w-48 md:w-64 rounded-full bg-gray-100 border-none"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Dropdown - Only visible on desktop */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm font-medium text-gray-600">
                      {username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{username}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex w-full cursor-pointer items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/wallet" className="flex w-full cursor-pointer items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    My Wallet
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex w-full cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
