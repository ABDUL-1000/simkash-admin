"use client"
import Image from "next/image"
import { useState } from "react"
import { DashboardStatCard } from "./dashboard-stat"
import { RevenueTrendsChart } from "./RevenueTrendCharts"
import { BackerChart } from "./BackarCharts"

import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardData } from "@/hooks/use-dashboard-overview"
import { AuthAPI } from "@/lib/API/api"

export default function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const { dashboardData, isLoading, isError, error } = useDashboardData()

  const handleSubmit = (data: Record<string, string>) => {
    console.log("SIM Data:", data)
    setIsModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col p-4 font-sora">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="bg-[#FFFFFF]">
              <p className="px-4 py-2 text-[#303237]">Overview</p>
              <div className="grid bg-[#FFFFFF] p-4 mt-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-2 min-w-[150px]"
                  >
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-[70%]">
                <Skeleton className="h-[300px] w-full rounded-lg" />
              </div>
              <div className="w-[30%]">
                <Skeleton className="h-[300px] w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    AuthAPI.logout();

    return;
      
    
  }


  const stats = [
    {
      title: "Total Revenue",
      icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
      value: `₦${dashboardData?.revenue?.toLocaleString() || "0"}`,
      note: "",
      minWidth: "min-w-[150px]",
    },
    {
      title: "Total Active Users",
      icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
      value: dashboardData?.users || 0,
      note: "",
      minWidth: "min-w-[150px]",
    },
    {
      title: "SIMs Activated",
      icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
      value: dashboardData?.activatedSims || 0,
      note: "Updated 10m",
      minWidth: "min-w-[150px]",
    },
  ]

  return (
    <div className="flex flex-1 flex-col p-4 font-sora">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="bg-[#FFFFFF]">
            <p className="px-4 py-2 text-[#303237]">Overview</p>
            <div className="grid bg-[#FFFFFF] p-4 mt-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat, i) => (
                <DashboardStatCard key={i} {...stat} />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-[70%]">
              <RevenueTrendsChart />
            </div>
            <div className="w-[30%]">
              <BackerChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
