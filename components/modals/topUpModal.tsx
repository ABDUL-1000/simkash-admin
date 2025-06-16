"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AccountDetails from "../AccountDetails"
import { ResponsiveModal } from "../mobileDrawer"
import { AuthAPI } from "@/lib/API/api"


interface TopUPModalProps {
  open: boolean
  onClose: () => void
}

const TopUPModal: React.FC<TopUPModalProps> = ({ open, onClose }) => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePayment = async () => {
    // Validate amount
    const paymentAmount = parseFloat(amount)
    if (isNaN(paymentAmount)) {
      setError("Please enter a valid amount")
      return
    }
    if (paymentAmount <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await AuthAPI.initiatePayment(paymentAmount)
      
      if (response.success) {
        // Redirect to Paystack payment page
        if (response.data?.authorization_url) {
          window.location.href = response.data.authorization_url
        } else {
          setError("Payment link not received")
        }
      } else {
        setError(response.message || "Failed to initiate payment")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Payment error:", err)
    } finally {
      // setLoading(false)
    }
  }

  return (
    <ResponsiveModal isOpen={open} onClose={onClose} className="max-w-md bg-gray-50 border-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Top Up Wallet</h2>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          <AccountDetails />

          {/* Or Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Top Up Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-8 border-gray-300 bg-white"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <Button
              type="button"
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Top Up"}
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default TopUPModal