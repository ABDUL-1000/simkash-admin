import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

        <Card>
          <CardHeader>
            <CardTitle>Sim Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is the sim page. More content will be added here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
