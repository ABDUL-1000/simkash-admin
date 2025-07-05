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
import { AuthAPI } from "@/lib/API/api"

interface Bank {
  id: number
  name: string
  code: string
}

interface SendMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const stepOneSchema = z.object({
  accountNumber: z.string().min(10, "Account number must be 10 digits").max(10, "Account number must be 10 digits"),
  bankCode: z.string().min(1, "Please select a bank"),
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

const SendMoneyToOtherBankModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [saveBeneficiary, setSaveBeneficiary] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [accountName, setAccountName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [bankError, setBankError] = useState("")
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const [transactionStatus, setTransactionStatus] = useState<"delivered" | "failed" | "pending" | null>(null)
  const [transactionId, setTransactionId] = useState<string>("")
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
  } = useForm<any>({
    resolver: zodResolver(
      step === 1 ? stepOneSchema : step === 2 ? stepTwoSchema : step === 4 ? stepFourSchema : z.object({}),
    ),
    mode: "onChange",
    defaultValues: {
      accountNumber: "",
      bankCode: "",
      amount: 0,
      description: "",
      pin: "",
    },
  })

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "amount") {
        if (value.amount > 1000000) {
          setError("amount", {
            type: "manual",
            message: "Amount exceeds maximum limit",
          })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setError])

  // Fetch banks list on modal open
  useEffect(() => {
    if (isOpen) {
      const fetchBanks = async () => {
        setIsLoadingBanks(true)
        setBankError("")
        try {
          const response = await AuthAPI.getBanksList()
          if (response.success) {
            setBanks(response.data || [])
          } else {
            setBankError(response.message || "Failed to load banks")
          }
        } catch (error) {
          setBankError("Network error occurred")
          console.error("Failed to fetch banks:", error)
        } finally {
          setIsLoadingBanks(false)
        }
      }
      fetchBanks()
    }
  }, [isOpen])

  const verifyAccount = async (accountNumber: string, bankCode: string) => {
    if (accountNumber.length === 10 && bankCode) {
      setIsVerifying(true)
      setAccountName("")

      try {
        const response = await AuthAPI.verifyAccount({
          account_number: accountNumber,
          bank_code: bankCode,
        })

        if (response.success) {
          setAccountName(response.data?.account_name || "Account verified")
          clearErrors("accountNumber")
        } else {
          setError("accountNumber", {
            type: "manual",
            message: "Account verification failed",
          })
        }
      } catch (error) {
        setError("accountNumber", {
          type: "manual",
          message: "Failed to verify account",
        })
        console.error("Account verification error:", error)
      } finally {
        setIsVerifying(false)
      }
    }
  }

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setValue("accountNumber", value)
    setAccountName("")

    if (errors.accountNumber) {
      clearErrors("accountNumber")
    }

    if (value.length === 10 && watch("bankCode")) {
      verifyAccount(value, watch("bankCode"))
    }
  }

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("bankCode", e.target.value)
    setAccountName("")
    if (watch("accountNumber")?.length === 10 && e.target.value) {
      verifyAccount(watch("accountNumber"), e.target.value)
    }
  }

  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newDigits = [...pinDigits]
    newDigits[index] = value
    setPinDigits(newDigits)
    setValue("pin", newDigits.join(""))
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
      setValue("pin", newDigits.join(""))
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
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={pinDigits[index]}
          onChange={(e) => handlePinChange(index, e.target.value)}
          onKeyDown={(e) => handlePinKeyDown(index, e)}
          className="w-16 h-16 text-center text-2xl font-semibold"
        />
      ))}
    </div>
  )

  const onNext = () => {
    if (step === 1 && (!accountName || isVerifying)) return
    if (step === 2) {
      handleSubmit(() => setStep(3))()
      return
    }
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
    setTransactionStatus(null)
    setTransactionId("")
    reset()
    onClose()
  }

  const onConfirm = () => setStep(4)

  const onSubmit = async () => {
    try {
      setIsProcessing(true)
      clearErrors("root")

      // Get form data and convert PIN to number
      const pinString = pinDigits.join("")
      const pinNumber = Number.parseInt(pinString)

      const formData = {
        amount: Number(watch("amount")),
        account_number: watch("accountNumber"),
        bank_code: watch("bankCode"),
        pin: pinNumber,
        narration: watch("description") || undefined,
      }

      // Validate data before sending
      if (isNaN(formData.amount) || formData.amount <= 0) {
        setError("amount", {
          type: "manual",
          message: "Please enter a valid amount",
        })
        return
      }

      if (isNaN(pinNumber) || pinString.length !== 4) {
        setError("pin", {
          type: "manual",
          message: "Please enter a valid 4-digit PIN",
        })
        return
      }

      if (!formData.account_number || formData.account_number.length !== 10) {
        setError("accountNumber", {
          type: "manual",
          message: "Please enter a valid 10-digit account number",
        })
        return
      }

      if (!formData.bank_code) {
        setError("bankCode", {
          type: "manual",
          message: "Please select a bank",
        })
        return
      }

      console.log("Final Transfer data being sent:", formData)

      const response = await AuthAPI.sendMoneyToOtherBank(formData)
      console.log("Transfer response:", response)

      if (response.success) {
        // Extract transaction reference and status from response
        const transactionRef = response.data?.transaction_reference || `TXN${Date.now().toString().slice(-8)}`
        const status = response.data?.status || "pending"

        console.log("Transaction status from response:", status)
        console.log("Transfer data:", response.data)

        setTransactionId(transactionRef)
        setTransactionStatus(status)
        setStep(5)

        if (onSuccess) {
          onSuccess({
            ...formData,
            accountName,
            transactionId: transactionRef,
            timestamp: new Date().toISOString(),
            status: status,
          })
        }
      } else {
        console.log("Error message:", response)
        setError("root", {
          type: "manual",
          message: response.message || "Transfer failed",
        })
      }
    } catch (error) {
      console.error("Submit error:", error)
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsProcessing(false)
    }
  }

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
        if (transactionStatus === "failed") return "Transfer Failed"
        if (transactionStatus === "pending") return "Transfer Pending"
        return "Transfer Complete"
      default:
        return "Send Money"
    }
  }

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onReset} className="max-w-md" preventOutsideClick={step < 5}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {step > 1 && step < 5 && (
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-6 h-1 ${step >= i ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
          ))}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                {isLoadingBanks ? (
                  <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
                ) : (
                  <>
                    <select
                      {...register("bankCode")}
                      onChange={handleBankChange}
                      className="w-full h-10 border rounded-md px-3 bg-white"
                      disabled={isLoadingBanks}
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.code}>
                          {bank.name} ({bank.code})
                        </option>
                      ))}
                    </select>
                    <FormError message={errors.bankCode?.message || bankError} />
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Account Number"
                  {...register("accountNumber")}
                  onChange={handleAccountNumberChange}
                  maxLength={10}
                  inputMode="numeric"
                />
                <FormError message={errors.accountNumber?.message} />
              </div>

              <div className="p-3 bg-gray-50 rounded-md min-h-[40px]">
                {isVerifying ? (
                  <span className="text-gray-500">Verifying account...</span>
                ) : accountName ? (
                  <span className="text-green-600 font-medium">{accountName}</span>
                ) : (
                  <span className="text-gray-500">Enter account details to verify</span>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Description (Optional)"
                  className="bg-white border-gray-300"
                  {...register("description")}
                />
                <FormError message={errors.description?.message} />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Available Balance:</span>
                  <span className="font-semibold">Check your wallet</span>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Recipient</span>
                  <span className="font-medium">{accountName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-medium">{watch("accountNumber")}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium">{banks.find((b) => b.code === watch("bankCode"))?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">₦{watch("amount")?.toLocaleString()}</span>
                </div>
                {watch("description") && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Description</span>
                    <span className="font-medium">{watch("description")}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium">Save as beneficiary</p>
                  <p className="text-xs text-gray-500">Save for faster transfers next time</p>
                </div>
                <Switch checked={saveBeneficiary} onCheckedChange={setSaveBeneficiary} />
              </div>

              {saveBeneficiary && (
                <div className="space-y-2">
                  <Input
                    placeholder="Beneficiary name (e.g. John Doe)"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Enter your 4-digit PIN to confirm</p>
                {renderPinInput()}
                <FormError message={errors.pin?.message} />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Transfer Amount:</span>
                  <span className="font-semibold">₦{watch("amount")?.toLocaleString()}</span>
                </div>
              </div>
              {errors.root && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                  {errors.root.message}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="text-center space-y-4 py-8">
              {/* Success State */}
              {transactionStatus === "delivered" && (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-600">Transfer Successful</h3>
                  <p className="text-gray-600">
                    ₦{watch("amount")?.toLocaleString()} has been sent to {accountName}
                  </p>
                </>
              )}

              {/* Failed State */}
              {transactionStatus === "failed" && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600">Transfer Failed</h3>
                  <p className="text-gray-600">
                    Your transfer of ₦{watch("amount")?.toLocaleString()} to {accountName} could not be completed.
                  </p>
                  <p className="text-sm text-red-500">Please try again or contact support if the problem persists.</p>
                </>
              )}

              {/* Pending State */}
              {transactionStatus === "pending" && (
                <>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-600">Transfer Pending</h3>
                  <p className="text-gray-600">
                    Your transfer of ₦{watch("amount")?.toLocaleString()} to {accountName} is being processed.
                  </p>
                  <p className="text-sm text-yellow-600">
                    You will receive a notification once the transaction is complete.
                  </p>
                </>
              )}

              {/* Transaction Details */}
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Recipient:</span>
                    <span className="font-medium">{accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-medium">{watch("accountNumber")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank:</span>
                    <span className="font-medium">
                      {banks.find((b) => b.code === watch("bankCode"))?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">₦{watch("amount")?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Reference:</span>
                    <span className="font-medium">{transactionId || "Processing..."}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          {step === 5 ? (
            <Button onClick={onReset} className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6]">
              {transactionStatus === "failed" ? "Try Again" : "Done"}
            </Button>
          ) : (
            <Button
              onClick={step === 3 ? onConfirm : step === 4 ? onSubmit : onNext}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6]"
              disabled={
                (step === 1 && (!accountName || isVerifying)) ||
                (step === 4 && (isProcessing || pinDigits.join("").length !== 4))
              }
            >
              {step === 3 ? "Confirm" : step === 4 ? (isProcessing ? "Processing..." : "Send Money") : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default SendMoneyToOtherBankModal
