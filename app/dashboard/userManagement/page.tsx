"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import OrderProductsTable from "@/components/partner-simTable";
import { SimTableCard } from "@/components/sim-table-mobile";
import { StatCard } from "@/components/stat-card";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { useState } from "react";
import { ReusableModal } from "@/components/modals/reusableModal";
import { Button } from "@/components/ui/button";
import { CheckCircle, User } from "lucide-react";
import { DashboardStatCard } from "@/components/dashboard-stat";
import UserAssignedSimTable from "@/components/userAssignedSimTable";
import UserManagementTable from "@/components/userManagementTable";
import { useUserManagement } from "@/hooks/use-userManagement";
import { Skeleton } from "@/components/ui/skeleton";




export default function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
   const {isLoading, isError, error, userManagement} = useUserManagement()
   const stats = [
  {
    title: " Total Registered Users",
    icon: (
      <User
        className="h-5 w-4"
      />
    ),
    value: userManagement?.registeredUsers || 0,
    note: "",
    minWidth: "min-w-[150px]",
  },
  {
    title: "KYC-Verified Users",
    icon: (
      <User
        className="h-5 w-4"
      />
    ),
    value: userManagement?.kycVerifiedUsers || 0,
    note: "",
    minWidth: "min-w-[150px]",
  },
  {
    title: "SIMs Activated",
    icon: (
       <User
        className="h-5 w-4"
      />
    ),
    value: userManagement?.activeUsers || 0,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
];


  if (isLoading) {
    return (
       <DashboardLayout>  
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
        </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col p-4 font-sora items-center justify-center text-red-500">
        <p>Error loading dashboard data: {error?.message} please refresh..</p>
      </div>
    )
  }

  
  const handleSubmit = (data: Record<string, string>) => {
    console.log("SIM Data:", data);
    setIsModalOpen(false);
  };

  return (
     <DashboardLayout>  
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
          </div>
        </div>
          <UserManagementTable/>
      </div>
      </DashboardLayout>
   
  );
}