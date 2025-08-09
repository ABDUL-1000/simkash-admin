"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import OrderProductsTable from "@/components/partner-simTable";
import { SimTableCard } from "@/components/sim-table-mobile";
import { SimManagement } from "@/components/user-device-sim-header";
import { StatCard } from "@/components/stat-card";

import Image from "next/image";
import { number } from "zod";
import { useProUsers } from "@/hooks/use-simProOverView";
import SimProUsersTable from "@/components/simProUserTable";




export default function Page() {
  const {proUsers, isLoading, isError} = useProUsers();
  console.log(proUsers, 'inventory data');
  
const stats = [
  {
    title: "Total Subscribed Users",
    icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: proUsers?.totalSubscribeUser,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
  {
    title: "Total Commission Earned",
    icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: proUsers?.totalCommissionEarned,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },  
  {
    title: "Average Commission ",
    icon: <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: proUsers?.averageCommission,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
];
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col p-4 font-sora"> 
      
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
            <SimProUsersTable/>
         
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}