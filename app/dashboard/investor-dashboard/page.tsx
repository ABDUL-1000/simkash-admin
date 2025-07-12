"use client";

import { useDashboardStore } from "@/app/store/zustandstore/useStore";
import AccountDetails from "@/components/AccountDetails";
import { DashboardLayout } from "@/components/dashboard-layout";
import { SendMoneySelectionModal } from "@/components/modals/sendMoneySelectMoodal";
import SendMoneyToOtherBankModal from "@/components/modals/sendMoneyToOtherBanksModal";
import SendMoneyToSimkashModal from "@/components/modals/sendToSimkashModal";
import TopUPModal from "@/components/modals/topUpModal";
import WithdrawModal from "@/components/modals/withdrawModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthAPI } from "@/lib/API/api";

import {  Eye, EyeOff, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DashboardData {
  date: string;
  wallet: {
    balance: string;
  };
  transaction: Transaction[];
}

interface Transaction {
  id: number;
  amount: string;
  transaction_type: string;
  description: string;
  status: "success" | "Pending" | "Failed";
  createdAt: string;
}

export default function WalletPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const setDashboardDatas = useDashboardStore((state) => state.setDashboardData);
  const wallet = useDashboardStore((state) => state.wallet);

  const quickActions = [
    {
      icon: "/Vector.png",
      label: "Send",
      onClick: () => setOpenModal("send-money"),
    },
    {
      icon: "/Vector3.png",
      label: "Withdraw",
      onClick: () => setOpenModal("withdraw"),
    },
    {
      icon: "/Vector1.png",
      label: "Top Up",
      onClick: () => setOpenModal("topup"),
    },
  ];

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(num);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await AuthAPI.getDashboardData();

        if (response.success) {
          const data = response.data;
          setDashboardData(data);
          setDashboardDatas(data);
          console.log("✅ Set dashboard data:", response.data);
        } else {
          setError(response.message || "Failed to load dashboard data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
    });
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#24C0FF] text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 text-center text-gray-500">
        No dashboard data available
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="">
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col  lg:flex-row w-full gap-4">
              {/* Left: Wallet balance - takes half width on large screens */}
              <div className="w-full flex items-center justify-center lg:w-1/2 bg-white p-6 rounded-lg">
                <div className="lg:text-center text-start">
                  <h3 className="lg:text-lg text-sm font-medium text-gray-600 mb-2">
                    Wallet Balance
                  </h3>
                  <div className="flex items-center lg:justify-center">
                    <span className="lg:text-5xl text-2xl font-bold">
                      {showBalance ? (
                        <span className="text-black">
                          {formatAmount(wallet?.balance.toString() || "0.00")}
                        </span>
                      ) : (
                        <span className="text-black">••••</span>
                      )}
                    </span>
                    <button
                      className="ml-4 text-gray-500 hover:text-gray-700"
                      onClick={toggleBalanceVisibility}
                      aria-label={showBalance ? "Hide balance" : "Show balance"}
                    >
                      {showBalance ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
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
              
              {/* Right: Action buttons - takes half width on large screens */}
                <div className="w-full flex items-center justify-center lg:w-1/2 bg-white p-6 rounded-lg">
                <div className="lg:text-center text-start">
                  <h3 className="lg:text-lg text-sm font-medium text-gray-600 mb-2">
                    Wallet Balance
                  </h3>
                  <div className="flex items-center lg:justify-center">
                    <span className="lg:text-5xl text-2xl font-bold">
                      {showBalance ? (
                        <span className="text-black">
                          {formatAmount(wallet?.balance.toString() || "0.00")}
                        </span>
                      ) : (
                        <span className="text-black">••••</span>
                      )}
                    </span>
                    <button
                      className="ml-4 text-gray-500 hover:text-gray-700"
                      onClick={toggleBalanceVisibility}
                      aria-label={showBalance ? "Hide balance" : "Show balance"}
                    >
                      {showBalance ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
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

            {showAccountModal && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50"
              >
                <div
                  className="bg-white rounded-t-2xl md:rounded-lg p-6 w-full md:w-96"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Account Details</h2>
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
          </CardContent>
        </Card>
        
        {/* Transactions */}
        <div className="animate-fade-in mt-6">
          <Card className="shadow-none">
            <CardContent className="p-0 shadow-none">
              <div className="grid grid-cols-5 lg:text-sm text-[0.5rem] font-medium text-gray-500 bg-[#FAFAFA] rounded-full m-2">
                <div className="p-4">Date</div>
                <div className="p-4">Type</div>
                <div className="p-4">Description</div>
                <div className="p-4">Amount</div>
                <div className="p-4">Status</div>
              </div>
      
              {dashboardData.transaction.length > 0 ? (
                dashboardData.transaction.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-5 text-sm border-b last:border-0"
                  >
                    <div className="p-4">{formatDate(transaction.createdAt)}</div>
                    <div className="p-4 capitalize">
                      {transaction.transaction_type}
                    </div>
                    <div className="p-4">{transaction.description}</div>
                    <div className="p-4">{formatAmount(transaction.amount)}</div>
                    <div className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="mb-4">
                    <Image
                      src="/Vector6.png"
                      alt="Empty transactions"
                      width={100}
                      height={100}
                      priority
                    />
                  </div>
                  <h4 className="text-gray-500 font-medium mb-1">
                    You haven't made any transactions yet.
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Once you start using Simkash, your activities will show up
                    here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
           <WithdrawModal
        isOpen={openModal === "withdraw"}
        onClose={() => setOpenModal(null)}
      />
           <SendMoneySelectionModal
              isOpen={openModal === "send-money"}
              onClose={() => setOpenModal(null)}
              onSelectSimkash={() => {
                setOpenModal("send-to-simkash");
              }}
              onSelectOtherBank={() => {
                setOpenModal("send-to-other");
              }}
            />
               <SendMoneyToOtherBankModal
        isOpen={openModal === "send-to-other"}
        onClose={() => setOpenModal(null)}
      />
         <SendMoneyToSimkashModal
        isOpen={openModal === "send-to-simkash"}
        onClose={() => setOpenModal(null)}
      />
             <TopUPModal
        open={openModal === "topup"}
        onClose={() => setOpenModal(null)}
      />
      
      </div>
    </DashboardLayout>
  );
}