import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My SIM</h1>

        <Card>
          <CardHeader>
            <CardTitle>SIM Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage your SIM cards and mobile services here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
