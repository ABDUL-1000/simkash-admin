"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, X, Download, Share2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResponsiveModal } from "../mobileDrawer"
import { FormError } from "../formError"
import { AuthAPI } from "@/lib/API/api"

interface CableService {
  name: string
  serviceID: string
}

interface CableVariation {
  variation_code: string
  name: string
  variation_amount: string
  fixedPrice: string
}

interface CableVariationResponse {
  ServiceName: string
  serviceID: string
  convinience_fee: string
  variations: CableVariation[]
}

interface CustomerInfo {
  serviceID: string
  billersCode: string
  variation_code: string
  name: string
  amount: string
}

interface CablePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const cablePaymentSchema = z.object({
  serviceID: z.string().min(1, "Please select a cable service"),
  variation_code: z.string().min(1, "Please select a package"),
  billersCode: z.string().min(8, "Card number must be at least 8 digits"),
  phone: z.string().min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
  pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits").optional(),
})

const CablePaymentModal: React.FC<CablePaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [cableServices, setCableServices] = useState<CableService[]>([])
  const [cableVariations, setCableVariations] = useState<CableVariation[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [isLoadingVariations, setIsLoadingVariations] = useState(false)
  const [isVerifyingCard, setIsVerifyingCard] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const [transactionId, setTransactionId] = useState<string>("")
  const [transactionStatus, setTransactionStatus] = useState<"success" | "failed" | "pending" | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    trigger,
  } = useForm<any>({
    resolver: zodResolver(cablePaymentSchema),
    mode: "onChange",
    defaultValues: {
      serviceID: "",
      variation_code: "",
      billersCode: "",
      phone: "",
      pin: "",
    },
  })

  // Load cable services when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCableServices = async () => {
        setIsLoadingServices(true)
        try {
          const response = await AuthAPI.getCableService()
          if (response.success && response.data?.responseBody) {
            setCableServices(response.data.responseBody)
          } else {
            console.error("Failed to load cable services:", response.message)
          }
        } catch (error) {
          console.error("Failed to fetch cable services:", error)
        } finally {
          setIsLoadingServices(false)
        }
      }
      fetchCableServices()
    }
  }, [isOpen])

  // Load cable variations when service is selected
  const handleServiceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedServiceID = e.target.value
    setValue("serviceID", selectedServiceID, { shouldValidate: true })
    setValue("variation_code", "", { shouldValidate: true })
    setCableVariations([])
    setCustomerInfo(null)

    if (selectedServiceID) {
      setIsLoadingVariations(true)
      try {
        const response = await AuthAPI.getCableVariation(selectedServiceID)
        if (response.success && response.data?.responseBody?.variations) {
          setCableVariations(response.data.responseBody.variations)
        } else {
          console.error("Failed to load cable variations:", response.message)
        }
      } catch (error) {
        console.error("Failed to fetch cable variations:", error)
      } finally {
        setIsLoadingVariations(false)
      }
    }
  }

  // Handle variation selection
  const handleVariationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVariationCode = e.target.value
    setValue("variation_code", selectedVariationCode, { shouldValidate: true })

    // If card number is already entered, verify again with new variation
    if (watch("billersCode")?.length >= 8 && watch("serviceID")) {
      verifyCardNumber()
    }
  }

  // Verify card number
  const verifyCardNumber = async () => {
    const billersCode = watch("billersCode")
    const serviceID = watch("serviceID")
    const variation_code = watch("variation_code")

    if (!billersCode || !serviceID || !variation_code) return

    setIsVerifyingCard(true)
    clearErrors("billersCode")

    try {
      const response = await AuthAPI.verifyCableNumber({
        serviceID,
        billersCode,
      })

      if (response.success && response.data) {
        const selectedVariation = cableVariations.find((v) => v.variation_code === variation_code)

        setCustomerInfo({
          serviceID,
          billersCode,
          variation_code,
          name: response.data.Customer_Name || "Unknown Customer",
          amount: selectedVariation?.variation_amount || "0",
        })
        clearErrors("billersCode")
      } else {
        setError("billersCode", {
          type: "manual",
          message: response.message || "Unable to verify card number",
        })
        setCustomerInfo(null)
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError("billersCode", {
        type: "manual",
        message: "Failed to verify card number. Please try again.",
      })
      setCustomerInfo(null)
    } finally {
      setIsVerifyingCard(false)
    }
  }

  const handleCardNumberBlur = async () => {
    await trigger("billersCode")
    if (watch("billersCode")?.length >= 8 && watch("serviceID") && watch("variation_code")) {
      await verifyCardNumber()
    }
  }

  // PIN input handlers
  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newDigits = [...pinDigits]
    newDigits[index] = value
    setPinDigits(newDigits)
    setValue("pin", newDigits.join(""), { shouldValidate: true })
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus()
    }
    if (errors.pin) {
      clearErrors("pin")
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const newDigits = [...pinDigits]
      if (pinDigits[index]) {
        newDigits[index] = ""
      } else if (index > 0) {
        newDigits[index - 1] = ""
        pinRefs.current[index - 1]?.focus()
      }
      setPinDigits(newDigits)
      setValue("pin", newDigits.join(""), { shouldValidate: true })
    }
  }

  const renderPinInput = () => (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3].map((index) => (
        <Input
          key={index}
             ref={(el) => {
            pinRefs.current[index] = el
          }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={pinDigits[index]}
          onChange={(e) => handlePinChange(index, e.target.value)}
          onKeyDown={(e) => handlePinKeyDown(index, e)}
          className="w-16 h-16 text-center text-2xl font-semibold"
          autoFocus={index === 0}
        />
      ))}
    </div>
  )

  // Navigation
  const onNext = async () => {
    const isValidStep1 = await trigger(["serviceID", "variation_code", "billersCode", "phone"])

    if (isValidStep1 && customerInfo) {
      setStep(step + 1)
    }
  }

  const onBack = () => setStep((prev) => prev - 1)

  const onReset = () => {
    setStep(1)
    setCustomerInfo(null)
    setCableVariations([])
    setIsProcessing(false)
    setPinDigits(["", "", "", ""])
    setTransactionId("")
    setTransactionStatus(null)
    reset()
    onClose()
  }

  // Submit payment
  const onSubmit = async () => {
    try {
      setIsProcessing(true)
      clearErrors("root")

      const pinString = pinDigits.join("")
      const pinNumber = Number.parseInt(pinString)

      if (isNaN(pinNumber) || pinString.length !== 4) {
        setError("pin", {
          type: "manual",
          message: "Please enter a valid 4-digit PIN",
        })
        return
      }

      if (!customerInfo) {
        setError("root", {
          type: "manual",
          message: "Customer information not found. Please verify your card number.",
        })
        return
      }

      const payload = {
        serviceID: customerInfo.serviceID,
        billersCode: customerInfo.billersCode,
        variation_code: customerInfo.variation_code,
        amount: customerInfo.amount,
        phone: watch("phone"),
        pin: pinNumber,
      }

      console.log("Submitting cable payment:", payload)

      const response = await AuthAPI.payCableBill(payload)
      console.log("Payment response:", response)

      if (response.success) {
        const transactionRef = response.data?.transaction_reference || `CABLE${Date.now().toString().slice(-8)}`
        setTransactionId(transactionRef)
        setTransactionStatus("success")
        setStep(3)

        if (onSuccess) {
          onSuccess({
            ...payload,
            transactionId: transactionRef,
            timestamp: new Date().toISOString(),
            status: "success",
          })
        }
      } else {
        setTransactionStatus("failed")
        setError("root", {
          type: "manual",
          message: response.message || "Cable payment failed",
        })
      }
    } catch (error) {
      console.error("Payment error:", error)
      setTransactionStatus("failed")
      setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Cable TV Payment"
      case 2:
        return "Confirm Payment"
      case 3:
        return transactionStatus === "failed" ? "Payment Failed" : "Payment Complete"
      default:
        return "Pay Cable TV"
    }
  }

  const downloadReceipt = () => {
    const receiptData = {
      transactionId,
      amount: customerInfo?.amount || "0",
      customerName: customerInfo?.name || "N/A",
      service: cableServices.find((s) => s.serviceID === customerInfo?.serviceID)?.name || "N/A",
      package: cableVariations.find((v) => v.variation_code === customerInfo?.variation_code)?.name || "N/A",
      date: new Date().toLocaleString(),
      status: transactionStatus,
    }
    console.log("Downloading receipt:", receiptData)
    // Implement actual download logic
  }

  const shareReceipt = () => {
    console.log("Sharing receipt for transaction:", transactionId)
    // Implement actual share logic
  }

  if (!isMounted) return null

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onReset} className="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {step > 1 && step < 3 && (
            <button onClick={onBack} className="flex items-center text-sm text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>
          )}
          <div className="flex-1 text-center">
            <h2 className="text-lg font-medium">{getStepTitle()}</h2>
          </div>
          <div className="w-6" />
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-6 h-1 ${step >= i ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
          ))}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cable Service</label>
                <select
                  {...register("serviceID", { onChange: handleServiceChange })}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  disabled={isLoadingServices}
                >
                  <option value="">Select cable service</option>
                  {cableServices.map((service) => (
                    <option key={service.serviceID} value={service.serviceID}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <FormError message={errors.serviceID?.message} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Package</label>
                <select
                  {...register("variation_code", { onChange: handleVariationChange })}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  disabled={isLoadingVariations || !watch("serviceID")}
                >
                  <option value="">Select package</option>
                  {cableVariations.map((variation) => (
                    <option key={variation.variation_code} value={variation.variation_code}>
                      {variation.name}
                    </option>
                  ))}
                </select>
                <FormError message={errors.variation_code?.message} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <Input placeholder="Enter card number" {...register("billersCode")} onBlur={handleCardNumberBlur} />
                <FormError message={errors.billersCode?.message} />
              </div>

              {isVerifyingCard && (
                <div className="p-3 bg-gray-50 rounded-md text-center">
                  <span className="text-gray-500">Verifying card number...</span>
                </div>
              )}

              {customerInfo && !isVerifyingCard && (
                <div className="p-3 bg-[#EEF9FF] rounded-md">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Customer Name:</span>
                    <span className="font-medium">{customerInfo.name}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input placeholder="Enter phone number" {...register("phone")} />
                <FormError message={errors.phone?.message} />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 bg-[#EEF9FF] rounded-md space-y-3">
                <h3 className="font-medium text-gray-900">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between ">
                    <span className="text-gray-600">Service:</span>
                    <span>{cableServices.find((s) => s.serviceID === customerInfo?.serviceID)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span>{cableVariations.find((v) => v.variation_code === customerInfo?.variation_code)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span>{customerInfo?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Number:</span>
                    <span>{customerInfo?.billersCode}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Amount:</span>
                    <span>₦{Number(customerInfo?.amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Enter PIN </p>
                {renderPinInput()}
                <FormError message={errors.pin?.message} />
              </div>

              {errors.root && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                  {errors.root.message}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 py-8">
              {transactionStatus === "success" ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-600">Payment Successful</h3>
                  <p className="text-gray-600">
                    ₦{Number(customerInfo?.amount || 0).toLocaleString()} cable TV payment for{" "}
                    {customerInfo?.name || "customer"} has been processed
                  </p>

                  <div className="p-3 bg-[#EEF9FF] rounded-md text-sm">
                    <p className="font-medium">Transaction Reference</p>
                    <p className="text-gray-500">{transactionId}</p>
                  </div>

                  <div className="flex justify-center gap-4 mt-4">
                    <Button variant="outline" onClick={downloadReceipt} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={shareReceipt} className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600">Payment Failed</h3>
                  <p className="text-gray-600">
                    Your cable TV payment of ₦{Number(customerInfo?.amount || 0).toLocaleString()} could not be
                    completed.
                  </p>
                  {errors.root?.message && <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>}
                  <div className="p-3 bg-[#EEF9FF] rounded-md text-sm mt-4">
                    <p className="font-medium">Transaction Reference</p>
                    <p className="text-gray-500">{transactionId}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          {step === 3 ? (
            <Button
              onClick={onReset}
              className="w-full bg-[#D7EFF6] text-[#60B3D1] hover:bg-[#255C79] hover:text-[#FFFFFF]"
            >
              Done
            </Button>
          ) : (
            <Button
              onClick={step === 1 ? onNext : onSubmit}
              className="w-full bg-[#D7EFF6] text-[#60B3D1] hover:bg-[#255C79] hover:text-[#FFFFFF]"
              disabled={
                (step === 1 && (!customerInfo || isVerifyingCard)) ||
                (step === 2 && (isProcessing || pinDigits.join("").length !== 4))
              }
            >
              {step === 1 ? "Continue" : isProcessing ? "Processing..." : "Pay"}
            </Button>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default CablePaymentModal
