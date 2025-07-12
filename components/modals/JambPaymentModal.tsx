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

interface JambVariation {
  variation_code: string
  name: string
  variation_amount: string
  fixedPrice: string
}

interface ProfileInfo {
  serviceID: string
  billersCode: string
  type: string
  name: string
}

interface JambPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const jambPaymentSchema = z.object({
  serviceID: z.string().min(1, "Service ID is required"),
  variation_code: z.string().min(1, "Please select a variation"),
  billersCode: z.string().min(10, "Profile ID must be at least 10 digits"),
  amount: z.string().min(1, "Amount is required"),
  phone: z.string().min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
  pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits").optional(),
})

const JambPaymentModal: React.FC<JambPaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [variations, setVariations] = useState<JambVariation[]>([])
  const [selectedVariation, setSelectedVariation] = useState<JambVariation | null>(null)
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null)
  const [isLoadingVariations, setIsLoadingVariations] = useState(false)
  const [isVerifyingProfile, setIsVerifyingProfile] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const [transactionId, setTransactionId] = useState<string>("")
  const [transactionStatus, setTransactionStatus] = useState<"delivered" | "failed" | "pending" | null>(null)
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
    resolver: zodResolver(jambPaymentSchema),
    mode: "onChange",
    defaultValues: {
      serviceID: "jamb",
      variation_code: "",
      billersCode: "",
      amount: "",
      phone: "",
      pin: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      const fetchVariations = async () => {
        setIsLoadingVariations(true)
        try {
          const response = await AuthAPI.getJambVariations()
          if (response.success) {
            const variationsData = response.data?.variations || response.data?.varations || []
            setVariations(variationsData)
          } else {
            console.error("Failed to load variations:", response.message)
          }
        } catch (error) {
          console.error("Failed to fetch variations:", error)
        } finally {
          setIsLoadingVariations(false)
        }
      }

      fetchVariations()
    }
  }, [isOpen])

  const verifyProfileId = async () => {
    const billersCode = watch("billersCode")
    const serviceID = watch("serviceID")
    const variation_code = watch("variation_code")

    if (!billersCode || !serviceID || !variation_code) return

    setIsVerifyingProfile(true)
    clearErrors("billersCode")

    try {
      const response = await AuthAPI.verifyJambProfile({
        serviceID,
        billersCode,
        type: variation_code,
      })

      if (response.success && response.data) {
        setProfileInfo({
          serviceID,
          billersCode,
          type: variation_code,
          name: response.data.Customer_Name || response.data.name || "Profile verified successfully",
        })
        clearErrors("billersCode")
      } else {
        setError("billersCode", {
          type: "manual",
          message: response.message || "Unable to verify profile ID",
        })
        setProfileInfo(null)
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError("billersCode", {
        type: "manual",
        message: "Failed to verify profile ID. Please try again.",
      })
      setProfileInfo(null)
    } finally {
      setIsVerifyingProfile(false)
    }
  }

  const handleProfileIdBlur = async () => {
    await trigger("billersCode")
    if (watch("billersCode")?.length >= 10 && watch("variation_code")) {
      await verifyProfileId()
    }
  }

  const handleVariationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVar = variations.find((v) => v.variation_code === e.target.value)
    if (selectedVar) {
      setSelectedVariation(selectedVar)
      setValue("variation_code", selectedVar.variation_code, { shouldValidate: true })
      setValue("amount", selectedVar.variation_amount, { shouldValidate: true })

      // Clear previous profile info when variation changes
      setProfileInfo(null)

      // Re-verify if profile ID is already entered
      if (watch("billersCode")?.length >= 10) {
        verifyProfileId()
      }
    }
  }

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

  const onNext = async () => {
    const isValidStep1 = await trigger(["serviceID", "variation_code", "billersCode", "amount", "phone"])
    if (isValidStep1 && profileInfo) {
      setStep(step + 1)
    }
  }

  const onBack = () => setStep((prev) => prev - 1)

  const onReset = () => {
    setStep(1)
    setSelectedVariation(null)
    setProfileInfo(null)
    setIsProcessing(false)
    setPinDigits(["", "", "", ""])
    setTransactionId("")
    setTransactionStatus(null)
    reset()
    onClose()
  }

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

      const formData = {
        serviceID: watch("serviceID"),
        variation_code: watch("variation_code"),
        billersCode: watch("billersCode"),
        amount: watch("amount"),
        phone: watch("phone"),
        pin: pinNumber,
      }

      console.log("Submitting JAMB payment:", formData)

      const response = await AuthAPI.payJambBill(formData)
      console.log("Payment response:", response)

      if (response.success) {
        const transactionRef = response.data?.transaction_reference || `JAMB${Date.now().toString().slice(-8)}`
        setTransactionId(transactionRef)
        setTransactionStatus("delivered")
        setStep(3)

        if (onSuccess) {
          onSuccess({
            ...formData,
            transactionId: transactionRef,
            timestamp: new Date().toISOString(),
            status: "success",
          })
        }
      } else {
        setTransactionStatus("failed")
        setError("root", {
          type: "manual",
          message: response.message || "JAMB payment failed",
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
        return "JAMB Payment"
      case 2:
        return "Enter PIN"
      case 3:
        return transactionStatus === "failed" ? "Payment Failed" : "Payment Complete"
      default:
        return "Pay JAMB"
    }
  }

  const downloadReceipt = () => {
    const receiptData = {
      transactionId,
      amount: watch("amount"),
      profileId: watch("billersCode"),
      variation: selectedVariation?.name || "N/A",
      customerName: profileInfo?.name || "N/A",
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
                <label className="block text-sm font-medium text-gray-700">JAMB Service Type</label>
                <select
                  {...register("variation_code", { onChange: handleVariationChange })}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  disabled={isLoadingVariations}
                >
                  <option value="">Select JAMB service type</option>
                  {variations.map((variation) => (
                    <option key={variation.variation_code} value={variation.variation_code}>
                      {variation.name} - ₦{Number.parseFloat(variation.variation_amount).toLocaleString()}
                    </option>
                  ))}
                </select>
                <FormError message={errors.variation_code?.message} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {selectedVariation?.variation_code === "de" ? "DE Number" : "JAMB Number"}
                </label>
                <Input
                  placeholder={`Enter ${selectedVariation?.variation_code === "de" ? "DE" : "JAMB"} number`}
                  {...register("billersCode")}
                  onBlur={handleProfileIdBlur}
                />
                <FormError message={errors.billersCode?.message} />
              </div>

              {isVerifyingProfile && (
                <div className="p-3 bg-gray-50 rounded-md text-center">
                  <span className="text-gray-500">Verifying profile...</span>
                </div>
              )}

              {profileInfo && !isVerifyingProfile && (
                <div className="p-3 bg-[#EEF9FF] rounded-md">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Profile Status:</span>
                    <span className="font-medium text-green-600">Verified</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{profileInfo.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{selectedVariation?.name}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                <Input
                  placeholder="Amount"
                  value={watch("amount") ? `₦${Number.parseFloat(watch("amount")).toLocaleString()}` : ""}
                  disabled
                  className="bg-gray-50"
                />
                <FormError message={errors.amount?.message} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input placeholder="Enter phone number" {...register("phone")} />
                <FormError message={errors.phone?.message} />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Enter your 4-digit PIN to confirm payment</p>
                {renderPinInput()}
                <FormError message={errors.pin?.message} />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service:</span>
                  <span className="font-semibold">{selectedVariation?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Profile ID:</span>
                  <span className="font-semibold">{watch("billersCode")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-semibold">₦{Number.parseFloat(watch("amount") || "0").toLocaleString()}</span>
                </div>
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
              {transactionStatus === "delivered" ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-600">Payment Successful</h3>
                  <p className="text-gray-600">
                    ₦{Number.parseFloat(watch("amount") || "0").toLocaleString()} JAMB payment for{" "}
                    {selectedVariation?.name} has been processed
                  </p>
                  <div className="p-3 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium">Transaction Reference</p>
                    <p className="text-gray-500">{transactionId}</p>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      variant="outline"
                      onClick={downloadReceipt}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={shareReceipt} className="flex items-center gap-2 bg-transparent">
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
                    Your JAMB payment of ₦{Number.parseFloat(watch("amount") || "0").toLocaleString()} could not be
                    completed.
                  </p>
                  {errors.root?.message && <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>}
                  <div className="p-3 bg-gray-50 rounded-md text-sm mt-4">
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
                (step === 1 && (!profileInfo || isVerifyingProfile)) ||
                (step === 2 && (isProcessing || pinDigits.join("").length !== 4))
              }
            >
              {step === 1 ? "Continue" : isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default JambPaymentModal
