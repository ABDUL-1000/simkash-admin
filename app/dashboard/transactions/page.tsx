import { DashboardLayout } from "@/components/dashboard-layout"
import TransactionTable from "@/components/transactionsTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Transactions</h1>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View all your transaction history here.</p>
            <TransactionTable/>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
