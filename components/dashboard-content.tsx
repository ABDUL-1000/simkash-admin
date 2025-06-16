"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import QuickActions from "./quickAction"
import TopUpModal from "./modals/topUpModal"
import SendModal from "./modals/sendMoneyModal"
import WithdrawModal from "./modals/withdrawModal"
import { Skeleton } from "./ui/skeleton"
import { AuthAPI } from "@/lib/API/api"
import { Eye, EyeOff } from "lucide-react"

interface Transaction {
  id: number
  amount: string
  transaction_type: string
  description: string
  status: "success" | "Pending" | "Failed"
  createdAt: string
}

interface DashboardData {
  wallet: {
    balance: string
  }
  transaction: Transaction[]
}

export function DashboardContent() {
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showBalance, setShowBalance] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await AuthAPI.getDashboardData()
        
        if (response.success) {
          setDashboardData(response.data)
        } else {
          setError(response.message || "Failed to load dashboard data")
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error("Dashboard data fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance)
  }

  const quickActions = [
    { icon: '/Vector1.png', label: 'Top Up', onClick: () => setOpenModal('topup') },
    { icon: '/Vector.png', label: 'Send', onClick: () => setOpenModal('send') },
    { icon: '/Vector3.png', label: 'Withdraw', onClick: () => setOpenModal('withdraw') },
    { icon: '/Vector4.png', label: 'Add SIM', onClick: () => setOpenModal('addsim') },
    { icon: '/icon5.png', label: 'More', onClick: () => setOpenModal('more') },
  ]

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true // This will show AM/PM
  });
};

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN"
    }).format(num)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Wallet Balance Skeleton */}
        <Card className="bg-white">
          <CardContent className="lg:pt-6 pt-1">
            <div className="lg:text-center text-start space-y-4">
              <Skeleton className="h-6 w-32 mx-auto" />
              <div className="flex items-center lg:justify-center space-x-2">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Skeleton */}
        <div className="bg-white p-4">
          <div className="flex justify-between">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-12 rounded-full" />
            ))}
          </div>
        </div>

        {/* Transactions Skeleton */}
        <Card className="shadow-none">
          <CardContent className="p-0 shadow-none">
            <div className="grid grid-cols-5 gap-4 p-4 bg-[#FAFAFA] rounded-full m-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#24C0FF] text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-6 text-center text-gray-500">
        No dashboard data available
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-white animate-fade-in">
        <CardContent className="lg:pt-6 pt-1">
          <div className="lg:text-center text-start">
            <h3 className="lg:text-lg text-sm font-medium text-gray-600 mb-2">Wallet Balance</h3>
            <div className="flex items-center lg:justify-center">
              <span className="lg:text-5xl text-2xl font-bold">
                <span className="text-gray-400">₦</span>
                {showBalance ? (
                  <span className="text-black">
                    {dashboardData.wallet.balance.split('.')[0]}.
                    <span className="text-gray-400">{dashboardData.wallet.balance.split('.')[1]}</span>
                  </span>
                ) : (
                  <span className="text-black">•••••.<span className="text-gray-400">••</span></span>
                )}
              </span>
              <button 
                className="ml-4 text-gray-500 hover:text-gray-700"
                onClick={toggleBalanceVisibility}
                aria-label={showBalance ? "Hide balance" : "Show balance"}
              >
                {showBalance ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="bg-white p-4 animate-fade-in">
        <QuickActions actions={quickActions} />
      </div>

      {/* Modals */}
      <TopUpModal open={openModal === 'topup'} onClose={() => setOpenModal(null)} />
      <SendModal isOpen={openModal === 'send'} onClose={() => setOpenModal(null)} />
      <WithdrawModal isOpen={openModal === 'withdraw'} onClose={() => setOpenModal(null)} />

      {/* Transactions */}
      <div className="animate-fade-in">
        <Card className="shadow-none">
          <CardContent className="p-0 shadow-none">
            <div className="grid grid-cols-5 lg:text-sm text-[0.5rem] font-medium text-gray-500 bg-[#FAFAFA] rounded-full m-2">
              <div className="p-4">Date</div>
              <div className="p-4">Type</div>
              <div className="p-4">Description</div>
              <div className="p-4">Amount</div>
              <div className="p-4">Status</div>
            </div>

            {dashboardData.transaction.length > 0 ? (
              dashboardData.transaction.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-5 text-sm border-b last:border-0">
                  <div className="p-4">{formatDate(transaction.createdAt)}</div>
                  <div className="p-4 capitalize">{transaction.transaction_type}</div>
                  <div className="p-4">{transaction.description}</div>
                  <div className="p-4">{formatAmount(transaction.amount)}</div>
                  <div className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "success"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="mb-4">
                  <Image 
                    src="/Vector6.png" 
                    alt="Empty transactions" 
                    width={100} 
                    height={100} 
                    priority
                  />
                </div>
                <h4 className="text-gray-500 font-medium mb-1">You haven't made any transactions yet.</h4>
                <p className="text-gray-400 text-sm">
                  Once you start using Simkash, your activities will show up here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}