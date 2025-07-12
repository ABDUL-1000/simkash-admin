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

interface Network {
  serviceID: string
  name: string
  image: string
}

interface SendMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const stepOneSchema = z.object({
  phoneNumber: z.string().min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
})

const stepTwoSchema = z.object({
  amount: z.number().min(1, "Amount must be at least ₦1").max(1000000, "Amount cannot exceed ₦1,000,000"),
  description: z.string().optional(),
})

const stepFourSchema = z.object({
  pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits"),
})

const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [saveBeneficiary, setSaveBeneficiary] = useState(false)
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [networkType, setNetworkType] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [networks, setNetworks] = useState<Network[]>([])
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [bankError, setBankError] = useState("")
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const [transactionId, setTransactionId] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])
  const [transactionStatus, setTransactionStatus] = useState<"delivered" | "failed" | "pending" | null>(null)

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      phoneNumber: "",
      networkId: "",
      amount: 0,
      pin: "",
      description: "",
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

  // Fetch networks list on modal open
  useEffect(() => {
    if (isOpen) {
      const fetchNetworks = async () => {
        setIsLoadingBanks(true)
        setBankError("")
        try {
          const response = await AuthAPI.getNetworkList()
          if (response.success) {
            setNetworks(response.data || [])
          } else {
            setBankError(response.message || "Failed to load networks")
          }
        } catch (error) {
          setBankError("Network error occurred")
          console.error("Failed to fetch networks:", error)
        } finally {
          setIsLoadingBanks(false)
        }
      }
      fetchNetworks()
    }
  }, [isOpen])

  const verifyNumber = async (phoneNumber: string) => {
    if (phoneNumber.length === 11) {
      setIsVerifying(true)
      setNetworkType("")
      clearErrors("phoneNumber")

      try {
        const response = await AuthAPI.verifyAirtimeNumber({
          phone: phoneNumber,
        })

        if (response.success && response.data?.responseBody?.[0]) {
          const networkInfo = response.data.responseBody[0]
          setNetworkType(networkInfo.name) // Store the network name
          const matchedNetwork = networks.find(
            (n) =>
              n.name.toLowerCase().includes(networkInfo.name.toLowerCase()) ||
              networkInfo.name.toLowerCase().includes(n.name.toLowerCase()),
          )

          if (matchedNetwork) {
            setValue("networkId", matchedNetwork.serviceID) // Store the serviceID
            console.log(`Network detected: ${networkInfo.name}, ID: ${matchedNetwork.serviceID}`)
          } else {
            console.log(`Network detected: ${networkInfo.name}, but no matching serviceID found`)
            setError("phoneNumber", {
              type: "manual",
              message: "Network not supported",
            })
          }
        } else {
          setError("phoneNumber", {
            type: "manual",
            message: "Unable to detect network for this number",
          })
        }
      } catch (error) {
        setError("phoneNumber", {
          type: "manual",
          message: "Failed to verify number",
        })
        console.error("Number verification error:", error)
      } finally {
        setIsVerifying(false)
      }
    }
  }
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setValue("phoneNumber", value)
    setNetworkType("")

    if (errors.phoneNumber) {
      clearErrors("phoneNumber")
    }

    // Auto-verify when 11 digits are entered
    if (value.length === 11) {
      verifyNumber(value)
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
    if (step === 1 && (!networkType || isVerifying)) return
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
    setNetworkType("")
    setIsProcessing(false)
    setPinDigits(["", "", "", ""])
    setTransactionId("")
    setTransactionStatus(null)
    reset()
    onClose()
  }

  const onConfirm = () => setStep(4)

  const onSubmit = async () => {
    try {
      setIsProcessing(true)
      clearErrors("root")

      const pinString = pinDigits.join("")
      const pinNumber = Number.parseInt(pinString)

      // Get the network serviceID from the form
      const networkServiceId = watch("networkId")

      // Create the form data
      const formData = {
        amount: Number(watch("amount")),
        phone: watch("phoneNumber"),
        network: networkServiceId, // Use the serviceID directly
        pin: pinNumber,
        narration: watch("description") || undefined,
      }

      // Validation...
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

      if (!formData.phone || formData.phone.length !== 11) {
        setError("phoneNumber", {
          type: "manual",
          message: "Please enter a valid 11-digit phone number",
        })
        return
      }

      if (!networkServiceId) {
        setError("phoneNumber", {
          type: "manual",
          message: "Network detection failed. Please try again.",
        })
        return
      }

    
      const response = await AuthAPI.buyAirtime(formData)
 

      if (response.success) {
        // Use the transaction_reference from your API response
        const transactionRef = response.data?.transaction_reference || `SKX${Date.now().toString().slice(-8)}`

        setTransactionId(transactionRef)

        // Extract status from responseBody
        const status = response.data?.status || "pending"
        console.log("Transaction status from response:", status)
        console.log("Datas:", response.data)

        setTransactionStatus(status)
        setStep(5)

        if (onSuccess) {
          onSuccess({
            ...formData,
            phoneNumber: formData.phone,
            transactionId: transactionRef,
            timestamp: new Date().toISOString(),
            status: status,
          })
        }
      } else {
        setError("root", {
          type: "manual",
          message: response.message || "Airtime purchase failed",
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
        return "Phone Details"
      case 2:
        return "Enter Amount"
      case 3:
        return "Confirm Purchase"
      case 4:
        return "Enter PIN"
      case 5:
        if (status === "failed") return "Purchase Failed"
        if (status=== "pending") return "Purchase Pending"
        return "Purchase Complete"
      default:
        return "Buy Airtime"
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null
  }

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onReset} className="max-w-md">
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
                <Input
                  placeholder="Phone Number (11 digits)"
                  {...register("phoneNumber")}
                  onChange={handlePhoneNumberChange}
                  maxLength={11}
                  inputMode="numeric"
                />
                <FormError message={errors.phoneNumber?.message} />
              </div>

              <div className="p-3 bg-gray-50 rounded-md min-h-[40px]">
                {isVerifying ? (
                  <span className="text-gray-500">Detecting network...</span>
                ) : networkType ? (
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium">Network: {networkType}</span>
                    <span className="text-xs text-gray-500">Auto-detected</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Enter 11-digit phone number to detect network</span>
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
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-medium">{watch("phoneNumber")}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Network</span>
                  <span className="font-medium">{networkType || "N/A"}</span>
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
                  <p className="text-xs text-gray-500">Save for faster purchases next time</p>
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
                  <span>Purchase Amount:</span>
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
              {transactionStatus === "delivered" && (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-600">Purchase Successful</h3>
                  <p className="text-gray-600">
                    ₦{watch("amount")?.toLocaleString()} airtime has been sent to {watch("phoneNumber")}
                  </p>
                </>
              )}

              {transactionStatus === "failed" && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600">Purchase Failed</h3>
                  <p className="text-gray-600">
                    Your airtime purchase of ₦{watch("amount")?.toLocaleString()} to {watch("phoneNumber")} could not be
                    completed.
                  </p>
                </>
              )}

              {transactionStatus === "pending" && (
                <>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-600">Purchase Pending</h3>
                  <p className="text-gray-600">
                    Your airtime purchase of ₦{watch("amount")?.toLocaleString()} to {watch("phoneNumber")} is being
                    processed.
                  </p>
                  <p className="text-sm text-yellow-600">
                    You will receive a notification once the transaction is complete.
                  </p>
                </>
              )}

              <div className="p-3 bg-gray-50 rounded-md text-sm">
                <p className="font-medium">Transaction Reference</p>
                <p className="text-gray-500">{transactionId || "Processing..."}</p>
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
                (step === 1 && (!networkType || isVerifying)) ||
                (step === 4 && (isProcessing || pinDigits.join("").length !== 4))
              }
            >
              {step === 3 ? "Confirm" : step === 4 ? (isProcessing ? "Processing..." : "Buy Airtime") : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default SendMoneyModal
