"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Switch } from "../ui/switch"
import { ResponsiveModal } from "../mobileDrawer"
import { FormError } from "../formError"


interface SendMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

// Validation schemas for each step
const stepOneSchema = z.object({
  accountNumber: z.string().min(10, "Account number must be 10 digits").max(10, "Account number must be 10 digits"),
  bankName: z.string().min(1, "Please select a bank"),
})

const stepTwoSchema = z.object({
  amount: z.number().min(1, "Amount must be at least ₦1").max(1000000, "Amount cannot exceed ₦1,000,000"),
  description: z.string().optional(),
})

const stepFourSchema = z.object({
  pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits"),
})

type StepOneForm = z.infer<typeof stepOneSchema>
type StepTwoForm = z.infer<typeof stepTwoSchema>
type StepFourForm = z.infer<typeof stepFourSchema>

const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [saveBeneficiary, setSaveBeneficiary] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [accountName, setAccountName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Store PIN digits as array of strings
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])

  // PIN input refs
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  // Banks list
  const banks = [
    { value: "access", label: "Access Bank" },
    { value: "gtbank", label: "GTBank" },
    { value: "zenith", label: "Zenith Bank" },
    { value: "uba", label: "UBA" },
    { value: "firstbank", label: "First Bank" },
    { value: "opay", label: "Opay" },
    { value: "kuda", label: "Kuda Bank" },
    { value: "sterling", label: "Sterling Bank" },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    setError,
  } = useForm<any>({
    resolver: zodResolver(
      step === 1 ? stepOneSchema : step === 2 ? stepTwoSchema : step === 4 ? stepFourSchema : z.object({}),
    ),
    mode: "onChange",
    defaultValues: {
      accountNumber: "",
      bankName: "",
      amount: 0,
      description: "",
      pin: "",
    },
  })

  // Watch form values
  const watchedValues = watch()

  // Simulate account verification
  const verifyAccount = async (accountNumber: string, bankName: string) => {
    if (accountNumber.length === 10 && bankName) {
      setIsVerifying(true)
      // Simulate API call
      setTimeout(() => {
        const mockNames = ["John Doe", "Jane Smith", "Michael Johnson", "Sarah Wilson", "David Brown"]
        const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]
        setAccountName(randomName)
        setIsVerifying(false)
      }, 1500)
    }
  }

  // Handle account number change
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setValue("accountNumber", value)

    if (accountName) {
      setAccountName("")
    }

    if (value.length === 10 && watchedValues.bankName) {
      verifyAccount(value, watchedValues.bankName)
    }
  }

  // Handle bank change
  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("bankName", e.target.value)

    if (accountName) {
      setAccountName("")
    }

    if (watchedValues.accountNumber?.length === 10 && e.target.value) {
      verifyAccount(watchedValues.accountNumber, e.target.value)
    }
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
    if (step === 1) {
      // Manual validation for step 1
      if (!watchedValues.accountNumber || watchedValues.accountNumber.length !== 10) {
        return
      }
      if (!watchedValues.bankName) {
        return
      }
      if (!accountName) {
        return // Don't proceed if account name is not verified
      }
      setStep(2)
      return
    }

    if (step === 2) {
      // Use form validation for step 2
      handleSubmit(() => {
        setStep(3)
      })()
      return
    }

    // For other steps
    setStep(step + 1)
  }

  const onBack = () => setStep((prev) => prev - 1)

  const onReset = () => {
    setStep(1)
    setSaveBeneficiary(false)
    setBeneficiaryName("")
    setAccountName("")
    setIsProcessing(false)
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
    // Simulate transaction processing
    setTimeout(() => {
      setStep(5)
      setIsProcessing(false)
      if (onSuccess) {
        onSuccess({
          ...watchedValues,
          accountName,
          saveBeneficiary,
          beneficiaryName,
        })
      }
    }, 2000)
  })

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Recipient Details"
      case 2:
        return "Enter Amount"
      case 3:
        return "Confirm Transfer"
      case 4:
        return "Enter PIN"
      case 5:
        return "Transfer Complete"
      default:
        return "Send Money"
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onReset}
      preventOutsideClick={step < 5} // Allow outside click only on success step
      className="max-w-md bg-gray-50 border-0"
    >
      <div className="space-y-4">
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

        {/* Step Progress Bar */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-1 ${step >= 1 ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
            <div className={`w-6 h-1 ${step >= 2 ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
            <div className={`w-6 h-1 ${step >= 3 ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
            <div className={`w-6 h-1 ${step >= 4 ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
            <div className={`w-6 h-1 ${step >= 5 ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
          </div>
        </div>

        {/* Step Contents */}
        <div className="space-y-4">
          {step === 1 && (
            <>
              {/* Bank Selection */}
              <div className="space-y-2">
                <select
                  value={watchedValues.bankName || ""}
                  onChange={handleBankChange}
                  className="w-full h-10 border border-gray-300 rounded-md px-3 focus:border-cyan-400 focus:ring-cyan-400 bg-white"
                >
                  <option value="">Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
                <FormError message={errors.bankName?.message} />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Input
                  placeholder="Account Number (10 digits)"
                  value={watchedValues.accountNumber || ""}
                  onChange={handleAccountNumberChange}
                  maxLength={10}
                  inputMode="numeric"
                  className="bg-white border-gray-300"
                />
                <FormError message={errors.accountNumber?.message} />
              </div>

              {/* Account Name Verification */}
              <div className="p-3 bg-white border border-gray-200 rounded-md min-h-[40px] flex items-center">
                {isVerifying ? (
                  <span className="text-gray-500">Verifying account...</span>
                ) : accountName ? (
                  <span className="text-green-600 font-medium">{accountName}</span>
                ) : (
                  <span className="text-gray-400">Account name will appear here</span>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Amount */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-8 bg-white border-gray-300"
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
              <FormError message={errors.amount?.message} />

              {/* Description */}
              <Input
                placeholder="Description (Optional)"
                className="bg-white border-gray-300"
                {...register("description")}
              />

              {/* Balance Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Available Balance:</span>
                  <span className="font-semibold">₦25,000.00</span>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Transfer Summary */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient:</span>
                    <span className="font-medium">{accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{banks.find((b) => b.value === watchedValues.bankName)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">{watchedValues.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-lg">₦{Number(watchedValues.amount || 0).toLocaleString()}</span>
                  </div>
                  {watchedValues.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{watchedValues.description}</span>
                    </div>
                  )}
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
                <p className="text-gray-600">Enter your 4-digit PIN to confirm this transfer</p>
              </div>

              <div className="space-y-4">
                {renderPinInput()}
                <FormError message={errors.pin?.message} />
              </div>

              {/* Transfer Summary (Compact) */}
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sending:</span>
                  <span className="font-semibold text-lg">₦{Number(watchedValues.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{accountName}</span>
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
                <p className="text-green-600 text-lg font-bold">Transfer Successful!</p>
                <p className="text-gray-600">Your money has been sent successfully.</p>
              </div>

              {/* Transaction Details */}
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm border border-gray-200">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">₦{Number(watchedValues.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span>{accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span>#SKX{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6">
          {step < 5 ? (
            <Button
              onClick={step === 3 ? onConfirm : step === 4 ? onSubmit : onNext}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={
                (step === 1 && (!accountName || isVerifying)) ||
                (step === 4 && (isProcessing || pinDigits.join("").length !== 4))
              }
            >
              {step === 3 ? "Confirm" : step === 4 ? (isProcessing ? "Processing..." : "Send Money") : "Continue"}
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

export default SendMoneyModal
