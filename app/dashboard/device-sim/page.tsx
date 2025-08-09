"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import Image from "next/image"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"



import DistributeSimModal from "@/components/modals/distributeSimModal"
import AddSimsModal from "@/components/modals/addSimModal"
import AddBatchModal from "@/components/modals/addBatchModal"
import AddedSimsTable from "@/components/addedSimsTable"
import { useDeviceSimOverview } from "@/hooks/use-deviceSim-overView"

export default function Page() {
  const [distributeSimModal, setDistributeSimModal] = useState(false)
  const [addSimsModal, setAddSimsModal] = useState(false) 
  const [addBatchModal, setAddBatchModal] = useState(false)

const {overView, isLoading, isError, error} = useDeviceSimOverview()
  
const stats = [
  {
    title: "Total SIMs Added",
    icon: <Image src="/sim-icon-dark.png" alt="SIM icon" width={20} height={30} className="h-5 w-4" />,
    value: overView?.totalSimAdded,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
  {
    title: "Current SIMs",
    icon: <Image src="/sim-icon-dark.png" alt="SIM icon" width={20} height={30} className="h-5 w-4" />,
    value: overView?.currentSims,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
  {
    title: "SIMs Distributed",
    icon: <Image src="/sim-icon-dark.png" alt="SIM icon" width={20} height={30} className="h-5 w-4" />,
    value: overView?.simsDistributed,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
]

  const handleSuccess = (data: any) => {
    console.log("Operation successful:", data)
    // No need to manually refresh tables here, react-query invalidation handles it
  }

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col p-4 font-sora">
        {/* PageHeader with the modal trigger */}
        <PageHeader title="" subtitle="" onAddClick={() => setDistributeSimModal(true)} addLabel="Distribute SIM" />
        {/* Distribute SIM Modal (existing) */}
        <DistributeSimModal
          isOpen={distributeSimModal}
          onClose={() => setDistributeSimModal(false)}
          onSuccess={handleSuccess}
        />

        {/* Add SIMs to Batch Modal (updated) */}
        <AddSimsModal isOpen={addSimsModal} onClose={() => setAddSimsModal(false)} onSuccess={handleSuccess} />

        {/* Add New Batch Modal (updated) */}
        <AddBatchModal isOpen={addBatchModal} onClose={() => setAddBatchModal(false)} onSuccess={handleSuccess} />

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
            <div className="relative mt-2 flex justify-between gap-6">
              {/* The search input and filter button are now handled within SimBatchesTable */}
              {/* Keeping them here for visual layout if desired, but they won't control the table directly */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-9 pr-4 py-2 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full"
                // The search logic is now internal to SimBatchesTable
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Image src="/filter-mail-circle.png" alt="Filter icon" width={20} height={30} className="h-4 w-4" />
                Apply Filter
              </Button>
              <Button
                variant="ghost"
                className="rounded-full border border-[#012641]"
                onClick={() => setAddBatchModal(true)}
              >
                <Plus />
                Add Batch
              </Button>
              <Button
                variant="ghost"
                className="rounded-full border border-[#012641]"
                onClick={() => setAddSimsModal(true)}
              >
                <Plus />
                Add SIMs
              </Button>
            </div>
          
            <AddedSimsTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
