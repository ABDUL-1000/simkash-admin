"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, ChevronDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Switch } from "../ui/switch"
import { ResponsiveModal } from "../mobileDrawer"
import { FormError } from "../formError"


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
  const [selectedPrevious, setSelectedPrevious] = useState("")
  const [showPreviousDropdown, setShowPreviousDropdown] = useState(false)
  const [saveBeneficiary, setSaveBeneficiary] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  // Store PIN digits as array of strings
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])

  // PIN input refs
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  // Mock previous numbers
  const previousNumbers = [
    { number: "07083175021", network: "MTN" },
    { number: "08012345678", network: "Airtel" },
    { number: "09087654321", network: "Glo" },
  ]

  const networks = [
    { value: "mtn", label: "MTN", color: "bg-yellow-500" },
    { value: "airtel", label: "Airtel", color: "bg-red-500" },
    { value: "glo", label: "Glo", color: "bg-green-500" },
    { value: "9mobile", label: "9mobile", color: "bg-green-600" },
  ]

  const dataPlans = [
    { id: "1", name: "Daily Plan", amount: 100, validity: "1 day", data: "100MB" },
    { id: "2", name: "Weekly Plan", amount: 500, validity: "7 days", data: "1GB" },
    { id: "3", name: "Monthly Plan", amount: 1000, validity: "30 days", data: "3GB" },
    { id: "4", name: "Monthly Plan", amount: 2000, validity: "30 days", data: "5GB" },
    { id: "5", name: "Monthly Plan", amount: 3000, validity: "30 days", data: "10GB" },
    { id: "6", name: "Monthly Plan", amount: 5000, validity: "30 days", data: "20GB" },
  ]

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

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setValue("phoneNumber", value)
    setSelectedPrevious("")

    // Auto-detect network based on prefix
    if (value.length >= 4) {
      const prefix = value.substring(0, 4)
      if (
        ["0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906", "0913", "0916"].includes(
          prefix,
        )
      ) {
        setValue("network", "mtn")
      } else if (["0802", "0808", "0812", "0701", "0708", "0902", "0907", "0901", "0904", "0912"].includes(prefix)) {
        setValue("network", "airtel")
      } else if (["0805", "0807", "0815", "0705", "0905", "0915"].includes(prefix)) {
        setValue("network", "glo")
      } else if (["0809", "0818", "0817", "0909", "0908"].includes(prefix)) {
        setValue("network", "9mobile")
      }
    }
  }

  const handlePreviousSelect = (number: string) => {
    setSelectedPrevious(number)
    setValue("phoneNumber", number)
    setShowPreviousDropdown(false)

    // Auto-detect network for previous number
    const prefix = number.substring(0, 4)
    if (
      ["0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906", "0913", "0916"].includes(prefix)
    ) {
      setValue("network", "mtn")
    } else if (["0802", "0808", "0812", "0701", "0708", "0902", "0907", "0901", "0904", "0912"].includes(prefix)) {
      setValue("network", "airtel")
    } else if (["0805", "0807", "0815", "0705", "0905", "0915"].includes(prefix)) {
      setValue("network", "glo")
    } else if (["0809", "0818", "0817", "0909", "0908"].includes(prefix)) {
      setValue("network", "9mobile")
    }
  }

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan)
    setValue("plan", plan.id)
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
    setSelectedPrevious("")
    setSaveBeneficiary(false)
    setBeneficiaryName("")
    setSelectedPlan(null)
    setPinDigits(["", "", "", ""])
    reset()
    onClose()
  }

  const onConfirm = () => {
    // Move to PIN step
    setStep(4)
  }

  const onSubmit = handleSubmit(() => {
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => {
      setStep(5)
      setIsProcessing(false)
      if (onSuccess) {
        onSuccess({
          ...watchedValues,
          selectedPlan,
          saveBeneficiary,
          beneficiaryName,
        })
      }
    }, 2000)
  })

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
              {/* Select from Previous */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Select from previous</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPreviousDropdown(!showPreviousDropdown)}
                    className="w-full p-3 text-left border border-gray-300 rounded-lg bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className={selectedPrevious ? "text-gray-900" : "text-gray-500"}>
                      {selectedPrevious || "07083175021"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showPreviousDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      {previousNumbers.map((item) => (
                        <button
                          key={item.number}
                          type="button"
                          onClick={() => handlePreviousSelect(item.number)}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>{item.number}</span>
                          <span className="text-sm text-gray-500">{item.network}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Or Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 text-gray-500">Or</span>
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  placeholder="Enter new recipient Number"
                  value={watchedValues.phoneNumber || ""}
                  onChange={handlePhoneNumberChange}
                  maxLength={11}
                  inputMode="numeric"
                  className="p-3 border-gray-300 bg-white"
                />
                <FormError message={errors.phoneNumber?.message} />
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
                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {dataPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handlePlanSelect(plan)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedPlan?.id === plan.id
                          ? "border-[#24C0FF] bg-blue-50"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{plan.data}</div>
                          <div className="text-sm text-gray-500">
                            Valid for {plan.validity} • {plan.name}
                          </div>
                        </div>
                        <div className="text-[#24C0FF] font-medium">₦{plan.amount}</div>
                      </div>
                    </button>
                  ))}
                </div>
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
                    <span className="font-medium">{selectedPlan?.data}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Validity:</span>
                    <span className="font-medium">{selectedPlan?.validity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-lg">₦{selectedPlan?.amount.toLocaleString()}</span>
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
              </div>

              {/* Purchase Summary (Compact) */}
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg">₦{selectedPlan?.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{selectedPlan?.data}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{watchedValues.phoneNumber}</span>
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <div className="text-center space-y-4">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>

              <div>
                <p className="text-green-600 text-lg font-bold">Data Purchase Successful!</p>
                <p className="text-gray-600">Your data has been recharged successfully.</p>
              </div>

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
                  <span className="font-semibold">{selectedPlan?.data}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">₦{selectedPlan?.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span>#DT{Date.now()}</span>
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
              disabled={!watchedValues.phoneNumber || watchedValues.phoneNumber.length !== 11}
            >
              Continue
            </Button>
          ) : step === 2 ? (
            <Button
              onClick={onNext}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={!selectedPlan}
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
              Done
            </Button>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default DataModal
