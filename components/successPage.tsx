"use client";

import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthAPI } from "@/lib/API/api";


interface TransactionData {
  id: number;
  user_id: number;
  amount: number;
  method: string;
  reference: string;
  status: string;
  transaction_date: string;
  payment_gateway_id: number;
  request_id: string | null;
  updatedAt: string;
  createdAt: string;
  responseBody: any;
}

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      
      if (!reference) {
        setError("Missing transaction reference");
        setLoading(false);
        return;
      }

      try {
        const response = await AuthAPI.verifyPayment({ reference });
        console.log("Transaction verified:", response.responseBody?.data);
        console.log("response:", response.data);

        
        if (response.data.data ) {
          setTransaction(response.data.data);
        } else {
          setError(response.message || "Failed to verify transaction");
        }
      } catch (err) {
        setError("An error occurred while verifying payment");
        console.error("Payment verification error:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
        </div>
        <p className="text-blue-600 text-lg font-bold">Verifying Transaction...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-10 h-10 bg-red-500 rounded-full"></div>
        </div>
        <p className="text-red-600 text-lg font-bold">Verification Failed</p>
        <p className="text-gray-600">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-lg font-bold">No transaction data found</p>
      </div>
    );
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format amount with commas
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center space-y-4">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <div>
          <p className="text-green-600 text-lg font-bold">
            Transfer Successful!
          </p>
          <p className="text-gray-600">
            Your payment has been processed successfully.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-lg p-4 space-y-2 text-sm border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-semibold">{formatAmount(transaction.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method:</span>
            <span className="capitalize">{transaction.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID:</span>
            <span>#{transaction.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="text-green-500 font-medium capitalize">{transaction.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span>{formatDate(transaction.transaction_date)}</span>
          </div>
        </div>

        <div className="pt-4">
          <Link href="/dashboard" legacyBehavior>
            <Button
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
            >
              Done
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;