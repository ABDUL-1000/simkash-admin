import ActivatedSimTable from "@/components/ActivatedSimTable"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Activated Sims</h1>

        <Card>
          <CardHeader>
            
          </CardHeader>
          <CardContent>
            
            <ActivatedSimTable/>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
