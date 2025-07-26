"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import OrderProductsTable from "@/components/partner-simTable";
import { SimTableCard } from "@/components/sim-table-mobile";
import { SimManagement } from "@/components/user-device-sim-header";
import { StatCard } from "@/components/stat-card";

import Image from "next/image";
import { number } from "zod";
import UserSimRegistrationModal from "@/components/modals/distributeSimModal";
import { PageHeader } from "@/components/page-header";
import PartnerSimRegistrationModal from "@/components/modals/partner-sim-reg-modal";
import { useState } from "react";
import UserAssignedSimTable from "@/components/partner-simTable";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import DistributeSimModal from "@/components/modals/distributeSimModal";
import AddSimModal from "@/components/modals/addSimModal";
import AddedSimsTable from "@/components/addedSimsTable";

const stats = [
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
    value: 4,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
  {
    title: "Current SIMs",
    icon: (
      <Image
        src="/sim-icon-dark.png"
        alt="logo"
        width={20}
        height={30}
        className="h-5 w-4"
      />
    ),
    value: 2,
    note: "Updated 10m",
    minWidth: "min-w-[150px]",
  },
  {
    title: "SIMs Distributed",
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
  const [distributeSimModal, setDistributeSimModal] = useState(false);
  const [addSimModal, setAddSimModal] = useState(false);
  const handleSimRegistrationSuccess = (data: any) => {
    console.log("SIM registration successful:", data);
  };
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col p-4 font-sora">
        {/* PageHeader with the modal trigger */}
        <PageHeader
          title=""
          subtitle=""
          onAddClick={() => setDistributeSimModal(true)}
          addLabel="Distribute SIM"
        />

        {/* SIM Registration Modal */}
        <DistributeSimModal
          isOpen={distributeSimModal}
          onClose={() => setDistributeSimModal(false)}
          onSuccess={handleSimRegistrationSuccess}
        />
        <AddSimModal
          isOpen={addSimModal}
          onClose={() => setAddSimModal(false)}
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
            <div className="relative mt-2 flex justify-between gap-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-9 pr-4 py-2 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full"
                // value={searchTerm}
                // onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // onApplyFilter()
                  }
                }}
              />
              <Button
                variant="outline"
                // onClick={onApplyFilter}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Image
                  src="/filter-mail-circle.png"
                  alt="logo"
                  width={20}
                  height={30}
                  className="h-4 w-4"
                />
                Apply Filter
              </Button>
              <Button
                variant="ghost"
                className="rounded-full border border-[#012641]"
                onClick={() => setAddSimModal(true)}
              >
                {" "}
                <Plus />
                Add SIMs
              </Button>
            </div>
            <AddedSimsTable />
         
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
