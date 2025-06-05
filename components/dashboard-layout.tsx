"use client"

import { UserService } from "@/lib/API/user-service"
import type React from "react"
import { useState, useEffect } from "react"
import Sidebar from "./layout/sidebar"
import { Navbar } from "./layout/navbar"
import { OnboardingOverlay } from "./onboarding-overlay"



interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [user, setUser] = useState({ name: "User", email: "user@example.com" })

useEffect(() => {
  const fetchUserInfo = async () => {
    // Check if user is first time user
    const isFirstTime = UserService.isFirstTimeUser()
    setShowOnboarding(isFirstTime)

    // Get user info
    const userInfo = await UserService.getUserInfo()  // <--- await here
    setUser(userInfo)
  }

  fetchUserInfo()
}, [])


  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Navbar username={user.name} email={user.email} />

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {showOnboarding && <OnboardingOverlay onComplete={handleOnboardingComplete} />}
    </div>
  )
}
