"use client";


import { DashboardLayout } from "@/components/dashboard-layout";
import OrderProductsTable from "@/components/sim-cards";
import { SimManagement } from "@/components/simRequest-management";
import { StatCard } from "@/components/stat-card";
import { TrendingDown, TrendingUp, ShoppingCart } from "lucide-react";
import Image from "next/image";



const stats = [
  {
    title: "Total SIMs Added",
    icon: <Image src="/simicon.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: 4,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
   {
    title: "Active SIMs",
    icon: <Image src="/simicon.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: 2,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },  {
    title: "Pending Activation",
    icon: <Image src="/simicon.png" alt="logo" width={20} height={30} className="h-5 w-4" />,
    value: 4,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },

];

export default function Page() {
  return (
      <DashboardLayout>
    <div className="flex flex-1 flex-col p-4">
      <SimManagement />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="bg-[#FFFFFF] ">
             <p className="px-4 py-2 text-[#303237]">Overview</p>
            <div className="grid bg-[#FFFFFF] p-4 mt-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat} />
              ))}
            </div>
          </div>
         
          <OrderProductsTable />
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
