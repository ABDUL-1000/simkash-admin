"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import AirtimeModal from "@/components/modals/airtimePurchaseModal"
import AirtimeToCashModal from "@/components/modals/airtimeToCash"
import CablePaymentModal from "@/components/modals/cable-payment-modal"
import DataModal from "@/components/modals/dataModal"
import DataToCashModal from "@/components/modals/dataToCash"
import ElectricPaymentModal from "@/components/modals/electric-payment-modal"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"

export default function BillsPage() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const bills = [
    {
      name: "Buy Airtime",
      icon: "/pinkCall.png",
      modalType: "airtime",
      onClick: () => setOpenModal("airtime"),
      dis: "Never run out of airtime again. Recharge instantly.",
    },
    {
      name: "Buy Data",
      icon: "/data.png",
      modalType: "data",
      onClick: () => setOpenModal("data"),
      dis: "Fast, seamless data top-up – always connected!",
    },
    {
      name: "Airtime to Cash",
      icon: "/phonegreen.png",
      modalType: "airtimetocash",
      onClick: () => setOpenModal("airtimetocash"),
      dis: "Convert your airtime to cash instantly.",
    },
    {
      name: "Data to Cash",
      icon: "/datatocash.png",
      modalType: "datatocash",
      onClick: () => setOpenModal("datatocash"),
      dis: "Convert your unused data to cash easily.",
    },
    {
      name: "Electricity Payment",
      icon: "/electric-icon.png",
      modalType: "electric-bills",
      onClick: () => setOpenModal("electric-bills"),
      dis: "Keep your lights on — pay your electricity bills instantly and securely with Simkash.",
    },
    {
      name: "Cable TV Payment",
      icon: "/tv-icon.png",
      modalType: "cable-bills",
      onClick: () => setOpenModal("cable-bills"),
      dis: "Stay connected to your favorite shows — pay for DSTV, GOTV, and more in seconds.",
    },
  ]

  const handleModalSuccess = (data: any) => {
    console.log("Transaction successful:", data)
    // Handle successful transaction (e.g., refresh balance, show notification)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Bill Payments & Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {bills.map((bill) => (
                <button
                  key={bill.name}
                  onClick={bill.onClick}
                  className="flex flex-col text-start bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex gap-3 items-start">
                    <div className="flex items-center justify-center rounded-full h-12 w-12 bg-[#FAFAFA] border border-gray-200">
                      <Image
                        src={bill.icon || "/placeholder.svg?height=20&width=20"}
                        alt={bill.name}
                        width={20}
                        height={20}
                        className="text-gray-600"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 font-medium mb-1 text-left">{bill.name}</h4>
                      <p className="text-gray-500 text-sm text-left">{bill.dis}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Empty State */}
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt="Empty transactions"
                  width={80}
                  height={80}
                  className="opacity-50"
                />
              </div>
              <h4 className="text-gray-500 font-medium mb-1">You haven't made any transactions yet.</h4>
              <p className="text-gray-400 text-sm">Once you start using Simkash, your activities will show up here.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {/* <SendMoneyModal isOpen={openModal === "send"} onClose={() => setOpenModal(null)} onSuccess={handleModalSuccess} /> */}

      <AirtimeModal
        isOpen={openModal === "airtime"}
        onClose={() => setOpenModal(null)}
        onSuccess={handleModalSuccess}
      />
      <AirtimeToCashModal isOpen={openModal === "airtimetocash"} onClose={() => setOpenModal(null)} onSuccess={handleModalSuccess} />
      <DataModal isOpen={openModal === "data"} onClose={() => setOpenModal(null)} onSuccess={handleModalSuccess} />
      <ElectricPaymentModal isOpen={openModal === "electric-bills"} onClose={() => setOpenModal(null)} onSuccess={handleModalSuccess} />
      <DataToCashModal isOpen={openModal === ""} onClose={() => setOpenModal(null)} onSuccess={handleModalSuccess} />
      <CablePaymentModal isOpen={openModal === "cable-bills"} onClose={() => setOpenModal(null)} onSuccess={handleModalSuccess} />



      {/* <BillsModal isOpen={openModal === "bills"} onClose={() => setOpenModal(null)} onSuccess={handleModalSuccess} /> */}
    </DashboardLayout>
  )
}
