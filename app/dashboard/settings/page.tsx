import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsTabs } from "./settingsTabs"


export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
         
          <div className="flex items-center space-x-2">
      
          
          </div>
        </div>
        <SettingsTabs />
      </div>
    </DashboardLayout>
  )
}
