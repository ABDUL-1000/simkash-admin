"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import OrderProductsTable from "@/components/partner-simTable"
import { SimTableCard } from "@/components/sim-table-mobile"
import { StatCard } from "@/components/stat-card"
import Image from "next/image"
import { PageHeader } from "@/components/page-header"
import { useState } from "react"
import PartnerSimTable from "@/components/partner-simTable"
import PartnerSimRegistrationModal from "@/components/modals/partner-sim-reg-modal"


const stats = [
  {
    title: "commissions",
    icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: 0,
    note: "",
    minWidth: "min-w-[150px]",
  },
  {
    title: "Total SIMs Added",
    icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: 0,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
  {
    title: "Total Active SIMs",
    icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: 4,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
]

const mobileTable = [
  {
    number: "07083175021",
    network: "string",
    status: "Active",
    active: "Today, 9:12 AM",
    expire: "2nd June, 2026",
    data: "Unlimited Yearly",
    minWidth: "min-w-[150px]",
  },
  {
    button: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    number: "07083175021",
    network: "string",
    status: "Active",
    statusColor: "text-green-500",
    active: "Today, 9:12 AM",
    expire: "2nd June, 2026",
    data: "Unlimited Yearly",
    minWidth: "min-w-[150px]",
  },
  {
    button: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    number: "07083175021",
    network: "string",
    status: "Active",
    active: "Today, 9:12 AM",
    expire: "2nd June, 2026",
    data: "Unlimited Yearly",
    statusColor: "text-green-500",
    minWidth: "min-w-[150px]",
  },
]

export default function SimPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSimRegistrationSuccess = (data: any) => {
    console.log("SIM registration successful:", data)
  
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col p-4 font-sora">
        {/* PageHeader with the modal trigger */}
        <PageHeader
          title="Your Partner:"
          subtitle="You don't have partner yet"
          onAddClick={() => setIsModalOpen(true)}
          addLabel="Add new Sim"
        />

        {/* SIM Registration Modal */}
        <PartnerSimRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSimRegistrationSuccess}
        />

        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="bg-[#FFFFFF]">
              <p className="px-4 py-2 text-[#303237]">Overview</p>
              <div className="grid bg-[#FFFFFF] p-4 mt-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, i) => (
                  <StatCard key={i} {...stat} />
                ))}
              </div>
            </div>
            <PartnerSimTable />
            <div className="grid bg-[#FFFFFF] p-4 mt-2 lg:hidden gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mobileTable.map((mobile, i) => (
                <SimTableCard key={i} {...mobile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
