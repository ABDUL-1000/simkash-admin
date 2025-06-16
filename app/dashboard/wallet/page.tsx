"use client";

import AccountDetails from "@/components/AccountDetails";
import { DashboardLayout } from "@/components/dashboard-layout";
import TopUPModal from "@/components/modals/topUpModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function WalletPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const quickActions = [
    {
      icon: "/Vector.png",
      label: "Send",
      onClick: () => setOpenModal("send"),
      group: "top",
    },
    {
      icon: "/Vector3.png",
      label: "Withdraw",
      onClick: () => setOpenModal("withdraw"),
      group: "top",
    },
    {
      icon: "/Vector1.png",
      label: "Top Up",
      onClick: () => setOpenModal("topup"),
      group: "bottom",
    },
  ];

  return (
    <DashboardLayout>
      <div className=" ">
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex w-full lg:gap-2 ">
              {/* Left: Wallet balance */}
              <div className="w-full md:w-1/2 bg-white p-6">
                <div className="lg:text-center text-start">
                  <h3 className="lg:text-lg text-[0.7rem] text-center font-medium text-gray-600 mb-2 mt-2">
                    Wallet Balance
                  </h3>
                  <div className="flex flex-col items-center lg:justify-center">
                    <div className="flex items-center m-0 lg:justify-center">
                      <span className="lg:text-5xl text-2xl font-bold">
                        <span className="text-gray-400">₦</span>
                        <span className="text-black">50,000.</span>
                        <span className="text-gray-400">00</span>
                      </span>
                      <button className="ml-4 text-gray-500 hover:text-gray-700">
                        <Image
                          src="/eye.png"
                          alt="icon"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                    {/* Dropdown Button */}
                    <div className="mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowAccountModal(true)}
                        className="flex items-center gap-1 text-sm p-2 rounded-full bg-[#F4F5F8]"
                      >
                        View Account Details
                        <Image
                          src="/arrowdown.png"
                          alt="icon"
                          width={15}
                          height={15}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <TopUPModal
                open={openModal === "topup"}
                onClose={() => setOpenModal(null)}
              />
              {showAccountModal && (
                <div
                  className="fixed inset-0  bg-black bg-opacity-1 flex items-end md:items-center justify-center z-50"

                  // no onClick here to avoid closing when clicking outside
                >
                  <div
                    className="bg-white rounded-t-2xl md:rounded-lg p-6 w-full md:w-96"
                    // prevent propagation so clicking inside doesn’t close it
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Account Details</h2>
                      {/* X button — now no onClick */}
                      <Button
                        className="text-gray-500 hover:text-gray-700"
                        variant="ghost"
                        onClick={() => setShowAccountModal(false)}
                      >
                        <X size={20} />
                      </Button>
                    </div>
                    <AccountDetails />
                  </div>
                </div>
              )}
              {/* Right: Action buttons */}
              <div className="w-full hidden  md:w-1/2 lg:flex flex-col gap-4">
                {/* Top: Send & Withdraw */}
                <div className="flex  gap-2">
                  {quickActions
                    .filter((action) => action.group === "top")
                    .map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className="flex-1 p-4  w-[100%] bg-white rounded-lg flex flex-col items-center justify-center"
                      >
                        <Image
                          src={action.icon}
                          alt={action.label}
                          width={20}
                          height={20}
                        />
                        <span className="mt-2 text-sm">{action.label}</span>
                      </button>
                    ))}
                </div>

                {/* Bottom: Top Up */}
                {quickActions
                  .filter((action) => action.group === "bottom")
                  .map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="w-full lg:p-4 bg-white rounded-lg flex flex-col items-center justify-center"
                    >
                      <Image
                        src={action.icon}
                        alt={action.label}
                        width={20}
                        height={20}
                      />
                      <span className="mt-2 text-sm">{action.label}</span>
                    </button>
                  ))}
              </div>
              <div className=" flex lg:hidden md:hidden justify-center items-center mt-6 w-full gap-8">
                {quickActions.map((action, index) => (
                  <div key={index} className="flex items-center flex-col justify-center">
                    <Button
                      key={index}
                      onClick={action.onClick}
                      className=" bg-white rounded-lg p-6 px-6 "
                    >
                      <Image
                        src={action.icon}
                        alt={action.label}
                        width={15}
                        height={15}
                      />
                    </Button>
                    <div>
                      <h1 className="mt-2 text-[0.8rem]">{action.label}</h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="mb-4">
                <Image
                  src="/Vector6.png"
                  alt="Empty"
                  width={100}
                  height={100}
                  className="h-8 w-6 lg:h-20 lg:w-20"
                />
              </div>
              <h4 className="text-gray-500 font-medium mb-1">
                You haven't made any transactions yet.
              </h4>
              <p className="text-gray-400 text-sm">
                Once you start using Simkash, your activities will show up here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
