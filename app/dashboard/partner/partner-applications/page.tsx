"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import OrderProductsTable from "@/components/partner-simTable";
import { SimTableCard } from "@/components/sim-table-mobile";
import { StatCard } from "@/components/stat-card";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { useState } from "react";
import PartnerSimTable from "@/components/partner-simTable";
import PartnerSimRegistrationModal from "@/components/modals/partner-sim-reg-modal";
import PartnerOverViewSimTable from "@/components/partner-List-table";
import PartnerApplicationTable from "@/components/pendingPartnerTable";

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

export default function SimPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSimRegistrationSuccess = (data: any) => {
    console.log("SIM registration successful:", data);
  };

  return (
    <DashboardLayout>
      <div className="w-full p-4 bg-[#fff] font-sora">
        <PageHeader
          title="View submitted partner applications and verify their details before approving."
          subtitle=""
        />
        <PartnerSimRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSimRegistrationSuccess}
        />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PartnerApplicationTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
