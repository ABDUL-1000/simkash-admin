"use client"

import { ArrowUpFromLine, ArrowRightFromLine, Wallet, CreditCard, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import QuickActions from "./quickAction"
import { useState } from "react"
import TopUpModal from "./modals/topUpModal"
import SendModal from "./modals/sendMoneyModal"
import WithdrawModal from "./modals/withdrawModal"

interface DashboardContentProps {
  balance?: string
  transactions?: any[]
}

export function DashboardContent({ balance = "₦50,000.00", transactions = [] }: DashboardContentProps) {
   const [openModal, setOpenModal] = useState<string | null>(null);

  const quickActions = [
    { icon: '/Vector1.png', label: 'Top Up', onClick: () => setOpenModal('topup') },
    { icon: '/Vector.png', label: 'Send', onClick: () => setOpenModal('send') },
    { icon: '/Vector3.png', label: 'Withdraw', onClick: () => setOpenModal('withdraw') },
    { icon: '/Vector4.png', label: 'Add SIM', onClick: () => setOpenModal('addsim') },
    { icon: '/icon5.png', label: 'More', onClick: () => setOpenModal('more') },
  ];
  return (

    <div className="p-6 space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-white">
        <CardContent className="lg:pt-6 pt-1">
          <div className="lg:text-center text-start">
            <h3 className="lg:text-lg text-sm font-medium text-gray-600 mb-2">Wallet Balance</h3>
            <div className="flex items-center lg:justify-center">
              <span className="lg:text-5xl text-2xl font-bold">
                <span className="text-gray-400">₦</span>
                <span className="text-black">50,000.</span>
                <span className="text-gray-400">00</span>
              </span>
              <button className="ml-4 text-gray-500 hover:text-gray-700">
             <Image src="/eye.png" alt="icon" width={20} height={20}></Image>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="bg-white p-4">
         <QuickActions actions={quickActions} />
      </div>
       {/* Modals */}
      <TopUpModal open={openModal === 'topup'} onClose={() => setOpenModal(null)} />
      <SendModal isOpen={openModal === 'send'} onClose={() => setOpenModal(null)}/>
        <WithdrawModal isOpen={openModal === 'withdraw'} onClose={() => setOpenModal(null)}/>
     
      {/* Add other modals similarly */}
      {/* Transactions */}
      <div>
       
        <Card className="shadow-none">
          <CardContent className="p-0 shadow-none">
            <div className="grid grid-cols-5 lg:text-sm text-[0.5rem] font-medium text-gray-500 bg-[#FAFAFA] rounded-full m-2">
              <div className="p-4">Date</div>
              <div className="p-4">Type</div>
              <div className="p-4">Description</div>
              <div className="p-4">Amount</div>
              <div className="p-4">Status</div>
            </div>

            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div key={index} className="grid grid-cols-5 text-sm border-b last:border-0">
                  <div className="p-4">{transaction.date}</div>
                  <div className="p-4">{transaction.type}</div>
                  <div className="p-4">{transaction.description}</div>
                  <div className="p-4">{transaction.amount}</div>
                  <div className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Completed"
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
                 
                  <Image src="/Vector6.png" alt="Empty" width={100} height={100} />
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
