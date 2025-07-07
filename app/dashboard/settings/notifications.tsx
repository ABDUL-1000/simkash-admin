import { Checkbox } from "@/components/ui/checkbox"
import { Send, PieChart, Shield, Smile, Monitor } from "lucide-react"

export function NotificationTab() {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Choose which notifications to receive across your devices</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-all" defaultChecked />
            <label htmlFor="email-all" className="text-sm font-medium">
              Email
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="inapp-all" defaultChecked />
            <label htmlFor="inapp-all" className="text-sm font-medium">
              In-App
            </label>
          </div>
        </div>
      </div>

      {/* Notification categories */}
      <div className="space-y-4">
        {/* Transaction Alerts */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900">Transaction Alerts</h4>
              <p className="text-sm text-gray-500">
                Get notified for every deposit, withdrawal, or airtime/data purchase.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="transaction-email" defaultChecked />
              <label htmlFor="transaction-email" className="text-sm font-medium">
                Email
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="transaction-inapp" defaultChecked />
              <label htmlFor="transaction-inapp" className="text-sm font-medium">
                In-App
              </label>
            </div>
          </div>
        </div>

        {/* Investment Updates */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900">Investment Updates</h4>
              <p className="text-sm text-gray-500">
                Stay informed about profit drops, maturity reminders, and new plans.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="investment-email" defaultChecked />
              <label htmlFor="investment-email" className="text-sm font-medium">
                Email
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="investment-inapp" defaultChecked />
              <label htmlFor="investment-inapp" className="text-sm font-medium">
                In-App
              </label>
            </div>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900">Security Alerts</h4>
              <p className="text-sm text-gray-500">Login attempts, password changes, device access, and 2FA changes.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="security-email" defaultChecked />
              <label htmlFor="security-email" className="text-sm font-medium">
                Email
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="security-inapp" defaultChecked />
              <label htmlFor="security-inapp" className="text-sm font-medium">
                In-App
              </label>
            </div>
          </div>
        </div>

        {/* Promotions & Offers */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Smile className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900">Promotions & Offers</h4>
              <p className="text-sm text-gray-500">
                Get updates on new features, investment bonuses, or limited-time offers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="promotions-email" defaultChecked />
              <label htmlFor="promotions-email" className="text-sm font-medium">
                Email
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="promotions-inapp" defaultChecked />
              <label htmlFor="promotions-inapp" className="text-sm font-medium">
                In-App
              </label>
            </div>
          </div>
        </div>

        {/* System Messages */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Monitor className="w-5 h-5 text-gray-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900">System Messages</h4>
              <p className="text-sm text-gray-500">Platform updates, scheduled maintenance, or policy changes.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="system-email" defaultChecked />
              <label htmlFor="system-email" className="text-sm font-medium">
                Email
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="system-inapp" defaultChecked />
              <label htmlFor="system-inapp" className="text-sm font-medium">
                In-App
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
