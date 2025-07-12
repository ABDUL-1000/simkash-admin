"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import OrderProductsTable from "@/components/sim-cards";
import { SimTableCard } from "@/components/sim-table-mobile";
import { StatCard } from "@/components/stat-card";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { useState } from "react";
import { ReusableModal } from "@/components/modals/reusableModal";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const stats = [
  {
    title: "commissions",
    icon: (
      <Image
        src="/sim-icon-dark.png"
        alt="logo"
        width={20}
        height={30}
        className="h-5 w-4"
      />
    ),
    value: 0,
    note: "",
    minWidth: "min-w-[150px]",
  },
  {
    title: "Total SIMs Added",
    icon: (
      <Image
        src="/sim-icon-dark.png"
        alt="logo"
        width={20}
        height={30}
        className="h-5 w-4"
      />
    ),
    value: 0,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
  {
    title: "Total Active SIMs",
    icon: (
      <Image
        src="/sim-icon-dark.png"
        alt="logo"
        width={20}
        height={30}
        className="h-5 w-4"
      />
    ),
    value: 4,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
];

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
    button: (
      <Image
        src="/sim-icon-dark.png"
        alt="logo"
        width={20}
        height={30}
        className="h-5 w-4"
      />
    ),
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
    button: (
      <Image
        src="/sim-icon-dark.png"
        alt="logo"
        width={20}
        height={30}
        className="h-5 w-4"
      />
    ),
    number: "07083175021",
    network: "string",
    status: "Active",
    active: "Today, 9:12 AM",
    expire: "2nd June, 2026",
    data: "Unlimited Yearly",
    statusColor: "text-green-500",
    minWidth: "min-w-[150px]",
  },
];

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);


  const simFields = [

     {
    type: "input" as const,
    label: "SIM Number",
    placeholder: "Enter SIM number here ",
    className: "w-full" 
  },
     {
    type: "input" as const,
    label: "Phone Number",
    placeholder: "Enter Phone number here",
    className: "w-full" 
  },
     {
    type: "input" as const,
    label: "Sim Batchr",
    placeholder: "Select SIM Batch",
    className: "w-full" 
  },
  {
    type: "group" as const,
    layout: "horizontal" as const,
    fields: [
      {
        type: "select" as const,
        label: "Sim Duration",
        placeholder: "Select SIM duration",
        options: [
          { value: "1m", label: "1 Month" },
          { value: "3m", label: "3 Months" }
        ],
        className: "flex-1"
      },
      {
        type: "select" as const,
        label: "Number of Sims",
        placeholder: "Enter the number of sim",
        options: [
          { value: "1m", label: "1 Month" },
          { value: "3m", label: "3 Months" }
        ],
        className: "flex-1"
      },
    
    ]
  },
      {
    type: "input" as const,
    label: "SIM Number",
    placeholder: "Enter SIM number here ",
    className: "w-full" 
  },
    
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log("SIM Data:", data);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col p-4 font-sora">
        <PageHeader
          title="Your cordinator:"
          subtitle="Buhari Abdulrahman | 07083175021"
          onAddClick={() => setIsModalOpen(true)}
          addLabel="Request SIM"
        />
        <ReusableModal
          isOpen={isModalOpen}
          subTitle=""
          onClose={() => setIsModalOpen(false)}
          title="Add New SIM"
          fields={simFields}
          onSubmit={handleSubmit}
          submitButton={
            <Button 
            type="submit"
            className="bg-[#D7EFF6]  text-[#60B3D1] w-full">

              Add & Activate
              </Button>
          }
         
        />

             {/* Success Modal */}
        <ReusableModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="SIM Successfully Activated!"
          subTitle=""
          successMode={true}
          successIcon={<CheckCircle className="w-12 h-12 text-green-500" />}
          successMessage="The SIM card(s) has been successfully added and activated for [User's Name]. The user can now subscribe to a data plan and begin using the service immediately."
          successActions={[
            { 
              label: "Go to Dashboard", 
              onClick: () => setIsSuccessModalOpen(false),
              variant: "default" 
            },
            { 
              label: "Add Another SIM", 
              onClick: () => {
                setIsSuccessModalOpen(false);
                setIsModalOpen(true);
              },
              variant: "outline" 
            }
          ]}
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
            <OrderProductsTable />
            <div className="grid bg-[#FFFFFF] p-4 mt-2 lg:hidden gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mobileTable.map((mobile, i) => (
                <SimTableCard key={i} {...mobile} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}