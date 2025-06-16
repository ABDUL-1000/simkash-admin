"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, X, Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Switch } from "../ui/switch"
import { ResponsiveModal } from "../mobileDrawer"
import { FormError } from "../formError"
import { AuthAPI } from "@/lib/API/api" // Adjust path as needed

interface DataModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const dataSchema = z.object({
  phoneNumber: z.string().min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
  network: z.string().min(1, "Please select a network"),
  plan: z.string().min(1, "Please select a data plan"),
  pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits"),
})

type DataForm = z.infer<typeof dataSchema>

const DataModal: React.FC<DataModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [dataPlans, setDataPlans] = useState<any[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  const [planError, setPlanError] = useState("")
  const [apiError, setApiError] = useState("")
  const [saveBeneficiary, setSaveBeneficiary] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [transactionStatus, setTransactionStatus] = useState<"delivered" | "failed" | "pending" | null>(null)
  const [transactionId, setTransactionId] = useState<string>("")

  // Store PIN digits as array of strings
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])

  // PIN input refs
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    setError,
  } = useForm<DataForm>({
    resolver: step === 2 ? zodResolver(dataSchema) : undefined,
    defaultValues: {
      phoneNumber: "",
      network: "",
      plan: "",
      pin: "",
    },
  })

  const watchedValues = watch()

  const networks = [
    { value: "mtn", label: "MTN", color: "bg-yellow-500", serviceID: "mtn-data" },
    { value: "airtel", label: "Airtel", color: "bg-red-500", serviceID: "airtel-data" },
    { value: "glo", label: "Glo", color: "bg-green-500", serviceID: "glo-data" },
    { value: "9mobile", label: "9mobile", color: "bg-green-600", serviceID: "9mobile-data" },
  ]

  useEffect(() => {
    const fetchDataPlans = async () => {
      const selectedNetwork = watchedValues.network
      if (!selectedNetwork) return

      const network = networks.find((n) => n.value === selectedNetwork)
      if (!network) return

      setIsLoadingPlans(true)
      setPlanError("")
      setDataPlans([])

      try {
        const response = await AuthAPI.getDataPlans(network.serviceID)
        if (response.success && response.data?.responseBody?.variations) {
          setDataPlans(response.data.responseBody.variations)
        } else {
          setPlanError(response.message || "Failed to load data plans")
        }
      } catch (error) {
        setPlanError("Network error occurred")
        console.error("Failed to fetch data plans:", error)
      } finally {
        setIsLoadingPlans(false)
      }
    }

    if (step >= 2) {
      fetchDataPlans()
    }
  }, [watchedValues.network, step])

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setValue("phoneNumber", value)
  }

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan)
    setValue("plan", plan.variation_code) // Use variation_code instead of id
  }

  // Handle PIN digit change
  const handlePinChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return

    // Update the specific digit
    const newDigits = [...pinDigits]
    newDigits[index] = value
    setPinDigits(newDigits)

    // Update form value
    const pinString = newDigits.join("")
    setValue("pin", pinString)

    // Auto-focus next input if value was entered
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus()
    }

    // Clear errors when user starts typing
    if (errors.pin) {
      setError("pin", { type: "manual", message: "PIN must be 4 digits" })
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const newDigits = [...pinDigits]

      if (pinDigits[index]) {
        // Clear current field
        newDigits[index] = ""
        setPinDigits(newDigits)
        setValue("pin", newDigits.join(""))
      } else if (index > 0) {
        // Move to previous field and clear it
        newDigits[index - 1] = ""
        setPinDigits(newDigits)
        setValue("pin", newDigits.join(""))
        pinRefs.current[index - 1]?.focus()
      }
    }
  }

  // Render PIN input function
  const renderPinInput = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[0, 1, 2, 3].map((index) => (
          <Input
            key={index}
            ref={(el) => {
              pinRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={pinDigits[index]}
            onChange={(e) => handlePinChange(index, e.target.value)}
            onKeyDown={(e) => handlePinKeyDown(index, e)}
            className="w-16 h-16 text-center text-2xl font-semibold border-gray-300 focus:border-cyan-400 focus:ring-cyan-400"
            placeholder=""
          />
        ))}
      </div>
    )
  }

  const onNext = () => {
    // Manual validation for step 1
    if (step === 1) {
      if (!watchedValues.phoneNumber || watchedValues.phoneNumber.length !== 11) {
        return
      }
      if (!watchedValues.network) {
        return
      }
      setStep(2)
      return
    }

    // For step 2, use form validation
    if (step === 2) {
      if (!selectedPlan) {
        return
      }
      setStep(3)
      return
    }

    // For other steps
    setStep(step + 1)
  }

  const onBack = () => setStep(step - 1)

  const onReset = () => {
    setStep(1)
    setIsProcessing(false)
    setSaveBeneficiary(false)
    setBeneficiaryName("")
    setSelectedPlan(null)
    setPinDigits(["", "", "", ""])
    setTransactionStatus(null)
    setTransactionId("")
    reset()
    onClose()
    setDataPlans([])
    setIsLoadingPlans(false)
    setPlanError("")
    setApiError("")
  }

  const onConfirm = () => {
    // Move to PIN step
    setStep(4)
  }

  const onSubmit = async () => {
    try {
      setIsProcessing(true)
      setApiError("")

      if (!selectedPlan) {
        setApiError("Please select a data plan")
        return
      }

      const pinString = pinDigits.join("")
      const pinNumber = Number.parseInt(pinString)

      if (isNaN(pinNumber) || pinString.length !== 4) {
        setApiError("Please enter a valid 4-digit PIN")
        return
      }

      const selectedNetwork = networks.find((n) => n.value === watchedValues.network)
      if (!selectedNetwork) {
        setApiError("Invalid network selection")
        return
      }

      // Prepare the data for the API according to the required format
      const buyDataPayload = {
        serviceID: selectedNetwork.serviceID, // e.g., "glo-data"
        billersCode: watchedValues.phoneNumber, // Phone number as string
        variation_code: selectedPlan.variation_code, // e.g., "glo100"
        amount: Number(Number.parseFloat(selectedPlan.variation_amount)), // Convert to number
        phone: watchedValues.phoneNumber, // Keep as string, not number
        pin: pinNumber, // PIN as number
      }

      console.log("Buy Data payload:", buyDataPayload)

      const response = await AuthAPI.buyData(buyDataPayload)

      if (response.success) {
        // Extract transaction reference and status from response
        const transactionRef = response.data?.transaction_reference || `DTX${Date.now().toString().slice(-8)}`
        const status = response.data?.status || "pending"

        console.log("Transaction status from response:", status)
        console.log("Data purchase response:", response.data)

        setTransactionId(transactionRef)
        setTransactionStatus(status)
        setStep(5)

        if (onSuccess) {
          onSuccess({
            ...buyDataPayload,
            transactionId: transactionRef,
            timestamp: new Date().toISOString(),
            plan: selectedPlan,
            beneficiaryName: saveBeneficiary ? beneficiaryName : null,
            status: status,
          })
        }
      } else {
        setApiError(response.message || "Data purchase failed")
      }
    } catch (error) {
      console.error("Submit error:", error)
      setApiError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Buy Data"
      case 2:
        return "Select Plan"
      case 3:
        return "Confirm Purchase"
      case 4:
        return "Enter PIN"
      case 5:
        if (transactionStatus === "failed") return "Purchase Failed"
        if (transactionStatus === "pending") return "Purchase Pending"
        return "Purchase Complete"
      default:
        return "Buy Data"
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onReset}
      preventOutsideClick={step < 5} // Allow outside click only on success step
      className="max-w-md bg-gray-50 border-0"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {step > 1 && step < 5 && (
            <button onClick={onBack} className="flex items-center text-sm text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>
          )}
          <div className="flex-1 text-center">
            <h2 className="text-lg font-medium text-gray-900">{getStepTitle()}</h2>
          </div>
          <div className="w-6" />
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-6 h-1 rounded-full transition-colors ${step >= stepNum ? "bg-[#24C0FF]" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {step === 1 && (
            <>
              {/* Phone Number Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  placeholder="Enter phone number"
                  value={watchedValues.phoneNumber || ""}
                  onChange={handlePhoneNumberChange}
                  maxLength={11}
                  inputMode="numeric"
                  className="p-3 border-gray-300 bg-white"
                />
                <FormError message={errors.phoneNumber?.message} />
              </div>

              {/* Network Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Select Network</label>
                <div className="grid grid-cols-2 gap-2">
                  {networks.map((network) => (
                    <button
                      key={network.value}
                      type="button"
                      onClick={() => setValue("network", network.value)}
                      className={`p-3 text-center border rounded-lg transition-colors ${
                        watchedValues.network === network.value
                          ? "border-[#24C0FF] bg-blue-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${network.color} mx-auto mb-1`} />
                      <span className="text-sm font-medium">{network.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Network Display */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Phone Number:</span>
                  <span className="font-medium">{watchedValues.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network:</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        networks.find((n) => n.value === watchedValues.network)?.color
                      }`}
                    />
                    <span className="font-medium">
                      {networks.find((n) => n.value === watchedValues.network)?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Plans */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Select Data Plan</label>

                {isLoadingPlans ? (
                  <div className="p-4 text-center text-gray-500">Loading data plans...</div>
                ) : planError ? (
                  <div className="p-4 text-center text-red-500">{planError}</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {dataPlans.map((plan) => (
                      <button
                        key={plan.variation_code}
                        type="button"
                        onClick={() => handlePlanSelect(plan)}
                        className={`p-3 text-left border rounded-lg transition-colors ${
                          selectedPlan?.variation_code === plan.variation_code
                            ? "border-[#24C0FF] bg-blue-50"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-sm">{plan.name}</div>
                          </div>
                          <div className="text-[#24C0FF] font-medium">
                            ₦{Number.parseFloat(plan.variation_amount).toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Balance Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Available Balance:</span>
                  <span className="font-semibold">₦25,000.00</span>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Purchase Summary */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone Number:</span>
                    <span className="font-medium">{watchedValues.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          networks.find((n) => n.value === watchedValues.network)?.color
                        }`}
                      />
                      <span className="font-medium">
                        {networks.find((n) => n.value === watchedValues.network)?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Plan:</span>
                    <span className="font-medium">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Validity:</span>
                    <span className="font-medium">{selectedPlan?.validity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-lg">
                      ₦{selectedPlan ? Number.parseFloat(selectedPlan.variation_amount).toLocaleString() : "0"}
                    </span>
                  </div>
                </div>

                {/* Save Beneficiary */}
                <div className="space-y-3">
                  <div className="flex bg-white p-3 rounded-lg border border-gray-200 items-center justify-between">
                    <span>Save to Beneficiaries?</span>
                    <Switch checked={saveBeneficiary} onCheckedChange={setSaveBeneficiary} />
                  </div>

                  {saveBeneficiary && (
                    <Input
                      placeholder="Beneficiary Name"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="text-center mb-4">
                <p className="text-gray-600">Enter your 4-digit PIN to confirm this purchase</p>
              </div>

              <div className="space-y-4">
                {renderPinInput()}
                <FormError message={errors.pin?.message} />
                {apiError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
                    {apiError}
                  </div>
                )}
              </div>

              {/* Purchase Summary (Compact) */}
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg">
                    ₦{selectedPlan ? Number.parseFloat(selectedPlan.variation_amount).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{watchedValues.phoneNumber}</span>
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <div className="text-center space-y-4 py-8">
              {/* Success State */}
              {transactionStatus === "delivered" && (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <div>
                    <p className="text-green-600 text-lg font-bold">Data Purchase Successful!</p>
                    <p className="text-gray-600">Your data has been recharged successfully.</p>
                  </div>
                </>
              )}

              {/* Failed State */}
              {transactionStatus === "failed" && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <p className="text-red-600 text-lg font-bold">Data Purchase Failed</p>
                    <p className="text-gray-600">
                      Your data purchase of ₦
                      {selectedPlan ? Number.parseFloat(selectedPlan.variation_amount).toLocaleString() : "0"} to{" "}
                      {watchedValues.phoneNumber} could not be completed.
                    </p>
                    <p className="text-sm text-red-500">Please try again or contact support if the problem persists.</p>
                  </div>
                </>
              )}

              {/* Pending State */}
              {transactionStatus === "pending" && (
                <>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-yellow-600 text-lg font-bold">Data Purchase Pending</p>
                    <p className="text-gray-600">
                      Your data purchase of ₦
                      {selectedPlan ? Number.parseFloat(selectedPlan.variation_amount).toLocaleString() : "0"} to{" "}
                      {watchedValues.phoneNumber} is being processed.
                    </p>
                    <p className="text-sm text-yellow-600">
                      You will receive a notification once the transaction is complete.
                    </p>
                  </div>
                </>
              )}

              {/* Transaction Details */}
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm border border-gray-200">
                <div className="flex justify-between">
                  <span>Phone Number:</span>
                  <span className="font-semibold">{watchedValues.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span>{networks.find((n) => n.value === watchedValues.network)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Plan:</span>
                  <span className="font-semibold">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">
                    ₦{selectedPlan ? Number.parseFloat(selectedPlan.variation_amount).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-medium">{transactionId || "Processing..."}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          {step === 1 ? (
            <Button
              onClick={onNext}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={!watchedValues.phoneNumber || watchedValues.phoneNumber.length !== 11 || !watchedValues.network}
            >
              Continue
            </Button>
          ) : step === 2 ? (
            <Button
              onClick={onNext}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={!selectedPlan || isLoadingPlans}
            >
              Continue
            </Button>
          ) : step === 3 ? (
            <Button
              onClick={onConfirm}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
            >
              Confirm
            </Button>
          ) : step === 4 ? (
            <Button
              onClick={onSubmit}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={isProcessing || pinDigits.join("").length !== 4}
            >
              {isProcessing ? "Processing..." : "Buy Data"}
            </Button>
          ) : (
            <Button
              onClick={onReset}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
            >
              {transactionStatus === "failed" ? "Try Again" : "Done"}
            </Button>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default DataModal
