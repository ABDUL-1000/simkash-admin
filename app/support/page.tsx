import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Support</h1>

        <Card>
          <CardHeader>
            <CardTitle>Get Help</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Contact our support team for assistance.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
