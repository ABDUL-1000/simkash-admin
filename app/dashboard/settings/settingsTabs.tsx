"use client"

import { useState } from "react"
import { ProfileTab } from "./profile-setup"
import { SecurityPrivacyTab } from "./security"
import { KYCVerificationTab } from "./kyc"
import { NotificationTab } from "./notifications"
import { SupportHelpTab } from "./support"
import { Button } from "@/components/ui/button"



const tabs = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security & Privacy" },
  { id: "kyc", label: "KYC Verification" },
  { id: "notification", label: "Notification" },
  { id: "support", label: "Support & Help" },
]

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile")

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />
      case "security":
        return <SecurityPrivacyTab />
      case "kyc":
        return <KYCVerificationTab />
      case "notification":
        return <NotificationTab />
      case "support":
        return <SupportHelpTab />
      default:
        return <ProfileTab />
    }
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-[#FFFFFF] p-2 rounded-md space-y-3">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <Button
            variant='ghost'
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-6 font-medium text-sm ${
                activeTab === tab.id
                  ? "bg-[#F4F5F8] "
                  : "border-transparent  hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  )
}
