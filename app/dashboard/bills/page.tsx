"use client"

import DataTable from "@/components/bills-table"
import { DashboardLayout } from "@/components/dashboard-layout"
import AirtimeModal from "@/components/modals/airtimePurchaseModal"
import AirtimeToCashModal from "@/components/modals/airtimeToCash"
import CablePaymentModal from "@/components/modals/cable-payment-modal"
import DataModal from "@/components/modals/dataModal"
import DataToCashModal from "@/components/modals/dataToCash"
import ElectricPaymentModal from "@/components/modals/electric-payment-modal"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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

        {bills.length > 0 && (
          <>
            <Separator />
            <DataTable   />
          </>
        )  }
      

         
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
