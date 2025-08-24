"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Wallet,
  CreditCard,
  ReceiptText,
  LifeBuoy,
  Settings,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { AuthAPI } from "@/lib/API/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/app/store/zustandstore/useAuthStore"
import { useDashboardStore } from "@/app/store/zustandstore/useStore"

interface SidebarProps {
  username?: string
  email?: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Individual state for each dropdown
  const [dropdownStates, setDropdownStates] = useState({
    cordinator: false,
    partner: false,
    deviceSim: false,
    
  })

  const toggleDropdown = (dropdownName: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }))
  }

  const isAgent = useAuthStore((state) => state.user?.isAgent)
  const isCoordinator = useAuthStore((state) => state.user?.isStateCordinator)
  const user = useDashboardStore((state) => state.userDetails)
  const clearAuthData = useAuthStore((state) => state.clearAuthData)

  const baseRoutes = useMemo(
    () => [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: (
          <Image
            src="/homeIcon.png"  
            alt="Dashboard Icon"
            width={30}
            height={30}
            className="h-5 w-5"
          />
        ),
        showForAgent: true,
        showForUser: true,
      },
      {
        name: "User Management",
        path: "/dashboard/userManagement",
        icon: (
          <Image
            src="/management.png"  
            alt="management Icon"
            width={30}
            height={30}
            className="h-5 w-5"
          />
        ),
        showForAgent: true,
        showForUser: true,
      },
      {
        name: "Cordinators",
        path: "/dashboard/cordinator",
        icon: <CreditCard className="h-5 w-5" />,
        subItems: [
          { name: "Cordinator List", path: "/dashboard/cordinator/cordinator-list" },
          { name: "Applications", path: "/dashboard/cordinator/cordinator-applications" },
          { name: "Analytics", path: "/dashboard/cordinator/cordinator-analytics" },
        ],
        showForAgent: true,
        showForUser: true,
        dropdownKey: "cordinator"
      },
      {
        name: "Partners",
        path: "/dashboard/partner",
        icon: <CreditCard className="h-5 w-5" />,
        subItems: [
          { name: "Partner List", path: "/dashboard/partner/partner-list" },
          { name: "Applications", path: "/dashboard/partner/partner-applications" },
          { name: "Analytics", path: "/dashboard/partner/partner-analytics" },
        ],
        showForAgent: true,
        showForUser: true,
        dropdownKey: "partner"
      },
  
  
   
      {
        name: "Simkash Pro",
        path: "/dashboard/sim-pro-management",
        icon: <CreditCard className="h-5 w-5" />,
        subItems: [
          { name: "Overview", path: "/dashboard/sim-pro-management/overview" },
          { name: "Customization", path: "/dashboard/simProManagement/customization" },
        ],
        showForAgent: true,
        showForUser: true,
        dropdownKey: "sim-pro-management"
      },
      {
        name: "Inventory & Sales",
        path: "/dashboard/inventory&customization",
        icon: <CreditCard className="h-5 w-5" />,
        subItems: [
          { name: "Overview", path: "/dashboard/sim-pro-management/overview" },
          { name: "Customize Inventory", path: "/dashboard/inventory&customization/customize-inventory" },
          { name: "Expenses", path: "/dashboard/inventory&customization/expenses" },
        ],
        showForAgent: true,
        showForUser: true,
        dropdownKey: "inventory&customization"
      },
  
      {
        name: "Transactions",
        path: "/dashboard/transactions",
        icon: <ReceiptText className="h-5 w-5" />,
        showForAgent: true,
        showForUser: true,
      },
      {
        name: "device sim",
        path: "/dashboard/device-sim",
        icon: <ReceiptText className="h-5 w-5" />,
        showForAgent: true,
        showForUser: true,
      },
    ],
    [],
  )

  const mainRoutesFiltered = useMemo(() => {
    if (isAgent === true) {
      return baseRoutes.filter((route) => route.showForAgent)
    } else if (isAgent === false) {
      return baseRoutes.filter((route) => route.showForUser)
    }
    return baseRoutes.filter((route) => route.showForUser)
  }, [isAgent, baseRoutes])

  const bottomRoutes = [
    {
      name: "Support",
      path: "/dashboard/support",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const handleLogout = async () => {
    await AuthAPI.logout()
    clearAuthData()
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 top-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-background transition-transform duration-200 ease-in-out border-r",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Image
              src="/simcard.png" 
              alt="Simkash Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-slate-800">simkash</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-auto py-4">
          <ul className="space-y-1 px-2">
            {mainRoutesFiltered.map((route) => {
              if (route.subItems) {
                const isActive = pathname.startsWith(route.path)
                const isOpen = dropdownStates[route.dropdownKey as keyof typeof dropdownStates]
                
                return (
                  <li key={route.name}>
                    <Button
                      variant='ghost'
                      onClick={() => toggleDropdown(route.dropdownKey as keyof typeof dropdownStates)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium",
                        isActive ? "bg-[#EEF9FF] text-black" : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {route.icon}
                        {route.name}
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    
                    {isOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {route.subItems.map((subItem) => (
                          <li key={subItem.path}>
                            <Link
                              href={subItem.path}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                pathname === subItem.path ? "bg-[#EEF9FF] text-black" : "hover:bg-muted",
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              }
              
              return (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === route.path ? "bg-[#EFF9FC] text-[#132939]" : "hover:bg-muted",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {route.icon}
                    {route.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        <div className="mt-auto pt-4 pb-6">
          <ul className="space-y-1 px-2">
            {bottomRoutes.map((route) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === route.path ? "bg-[#EEF9FF] text-black" : "hover:bg-muted",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {route.icon}
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 px-3">
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <div className="lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-medium text-gray-600">
                            {user?.username
                              ? user.username
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : (user?.email || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="bg-white w-full p-6 border border-gray-300 rounded-2xl space-y-2"
                    >
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.username || "User"}</p>
                          <p className="text-xs text-muted-foreground">{user?.email || "email@example.com"}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex w-full cursor-pointer items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <h1 className="text-sm">Dashboard</h1>
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
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer flex items-center justify-start"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-200"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}