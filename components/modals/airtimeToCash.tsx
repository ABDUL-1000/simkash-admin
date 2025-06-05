"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, ChevronDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ResponsiveModal } from "../mobileDrawer"
import { FormError } from "../formError"


interface AirtimeToCashModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const airtimeToCashSchema = z.object({
  phoneNumber: z.string().min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
  network: z.string().min(1, "Please select a network"),
  amount: z.number().min(100, "Minimum amount is ₦100").max(50000, "Maximum amount is ₦50,000"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits"),
})

type AirtimeToCashForm = z.infer<typeof airtimeToCashSchema>

const AirtimeToCashModal: React.FC<AirtimeToCashModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPrevious, setSelectedPrevious] = useState("")
  const [showPreviousDropdown, setShowPreviousDropdown] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  // Store OTP digits as array of strings
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""])
  // Store PIN digits as array of strings
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])

  // OTP and PIN input refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
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

  // Conversion rates (90% of airtime value)
  const conversionRates = {
    mtn: 0.9,
    airtel: 0.85,
    glo: 0.8,
    "9mobile": 0.75,
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    setError,
  } = useForm<AirtimeToCashForm>({
    resolver: undefined, // Remove conditional validation
    defaultValues: {
      phoneNumber: "",
      network: "",
      amount: 0,
      otp: "",
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

  // Handle OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return

    const newDigits = [...otpDigits]
    newDigits[index] = value
    setOtpDigits(newDigits)

    const otpString = newDigits.join("")
    setValue("otp", otpString)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    if (errors.otp) {
      setError("otp", { type: "manual", message: "OTP must be 6 digits" })
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const newDigits = [...otpDigits]

      if (otpDigits[index]) {
        newDigits[index] = ""
        setOtpDigits(newDigits)
        setValue("otp", newDigits.join(""))
      } else if (index > 0) {
        newDigits[index - 1] = ""
        setOtpDigits(newDigits)
        setValue("otp", newDigits.join(""))
        otpRefs.current[index - 1]?.focus()
      }
    }
  }

  // Handle PIN digit change
  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return

    const newDigits = [...pinDigits]
    newDigits[index] = value
    setPinDigits(newDigits)

    const pinString = newDigits.join("")
    setValue("pin", pinString)

    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus()
    }

    if (errors.pin) {
      setError("pin", { type: "manual", message: "PIN must be 4 digits" })
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const newDigits = [...pinDigits]

      if (pinDigits[index]) {
        newDigits[index] = ""
        setPinDigits(newDigits)
        setValue("pin", newDigits.join(""))
      } else if (index > 0) {
        newDigits[index - 1] = ""
        setPinDigits(newDigits)
        setValue("pin", newDigits.join(""))
        pinRefs.current[index - 1]?.focus()
      }
    }
  }

  // Render OTP input
  const renderOtpInput = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Input
            key={index}
            ref={(el) => {
              otpRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otpDigits[index]}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-semibold border-gray-300 focus:border-cyan-400 focus:ring-cyan-400"
            placeholder=""
          />
        ))}
      </div>
    )
  }

  // Render PIN input
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

  // Calculate cash value based on network and amount
  const calculateCashValue = () => {
    const network = watchedValues.network as keyof typeof conversionRates
    const amount = watchedValues.amount || 0
    const rate = conversionRates[network] || 0.9
    return amount * rate
  }

  const sendOtp = () => {
    setIsVerifyingOtp(true)
    // Simulate OTP sending
    setTimeout(() => {
      setIsVerifyingOtp(false)
      setStep(2)
    }, 1500)
  }

  const verifyOtp = () => {
    if (otpDigits.join("").length === 6) {
      setStep(3)
    }
  }

  const onNext = () => {
    if (step === 1) {
      if (!watchedValues.phoneNumber || watchedValues.phoneNumber.length !== 11) {
        return
      }
      sendOtp()
      return
    }

    if (step === 2) {
      verifyOtp()
      return
    }

    if (step === 3) {
      if (!watchedValues.amount || watchedValues.amount < 100) {
        return
      }
      setStep(4)
      return
    }

    setStep(step + 1)
  }

  const onBack = () => setStep(step - 1)

  const onReset = () => {
    setStep(1)
    setIsProcessing(false)
    setSelectedPrevious("")
    setOtpDigits(["", "", "", "", "", ""])
    setPinDigits(["", "", "", ""])
    reset()
    onClose()
  }

  const onConfirm = () => {
    setStep(5)
  }

  const onSubmit = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setStep(6)
      setIsProcessing(false)
      if (onSuccess) {
        onSuccess({
          ...watchedValues,
          cashValue: calculateCashValue(),
        })
      }
    }, 2000)
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Airtime to Cash"
      case 2:
        return "Verify Phone Number"
      case 3:
        return "Enter Amount"
      case 4:
        return "Confirm Conversion"
      case 5:
        return "Enter PIN"
      case 6:
        return "Conversion Complete"
      default:
        return "Airtime to Cash"
    }
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onReset}
      preventOutsideClick={step < 6}
      className="max-w-md bg-gray-50 border-0"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {step > 1 && step < 6 && (
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
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-5 h-1 rounded-full transition-colors ${step >= stepNum ? "bg-[#24C0FF]" : "bg-gray-300"}`}
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
                  placeholder="Enter SIM number with airtime"
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
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-medium">{watchedValues.phoneNumber}</span>
                </p>
              </div>

              <div className="space-y-4">
                {renderOtpInput()}
                <FormError message={errors.otp?.message} />
              </div>

              <div className="text-center">
                <button className="text-sm text-[#24C0FF] hover:underline">Resend OTP</button>
              </div>
            </>
          )}

          {step === 3 && (
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

              {/* Amount Input */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Enter Airtime Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <Input
                    type="number"
                    placeholder="Enter airtime amount"
                    className="pl-8 p-3 border-gray-300 bg-white"
                    {...register("amount", { valueAsNumber: true })}
                  />
                </div>
                <FormError message={errors.amount?.message} />

                {/* Conversion Rate Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate:</span>
                    <span className="font-semibold">
                      {(conversionRates[watchedValues.network as keyof typeof conversionRates] || 0.9) * 100}% of value
                    </span>
                  </div>
                </div>

                {watchedValues.amount > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>You will receive:</span>
                      <span className="font-semibold text-green-600">₦{calculateCashValue().toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              {/* Conversion Summary */}
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
                    <span className="text-gray-600">Airtime Amount:</span>
                    <span className="font-medium">₦{watchedValues.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-medium">
                      {(conversionRates[watchedValues.network as keyof typeof conversionRates] || 0.9) * 100}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash Value:</span>
                    <span className="font-medium text-lg text-green-600">₦{calculateCashValue().toLocaleString()}</span>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                  <p>
                    <strong>Note:</strong> This will convert your airtime to cash. The airtime will be deducted from
                    your SIM card.
                  </p>
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="text-center mb-4">
                <p className="text-gray-600">Enter your 4-digit PIN to confirm this conversion</p>
              </div>

              <div className="space-y-4">
                {renderPinInput()}
                <FormError message={errors.pin?.message} />
              </div>

              {/* Conversion Summary (Compact) */}
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Airtime Amount:</span>
                  <span className="font-medium">₦{watchedValues.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Cash Value:</span>
                  <span className="font-semibold text-lg text-green-600">₦{calculateCashValue().toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          {step === 6 && (
            <div className="text-center space-y-4">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>

              <div>
                <p className="text-green-600 text-lg font-bold">Conversion Successful!</p>
                <p className="text-gray-600">Your airtime has been converted to cash successfully.</p>
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
                  <span>Airtime Amount:</span>
                  <span className="font-semibold">₦{watchedValues.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash Value:</span>
                  <span className="font-semibold text-green-600">₦{calculateCashValue().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span>#AC{Date.now()}</span>
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
              disabled={!watchedValues.phoneNumber || watchedValues.phoneNumber.length !== 11 || isVerifyingOtp}
            >
              {isVerifyingOtp ? "Sending OTP..." : "Send OTP"}
            </Button>
          ) : step === 2 ? (
            <Button
              onClick={onNext}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={otpDigits.join("").length !== 6}
            >
              Verify OTP
            </Button>
          ) : step === 3 ? (
            <Button
              onClick={onNext}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={!watchedValues.amount || watchedValues.amount < 100}
            >
              Continue
            </Button>
          ) : step === 4 ? (
            <Button
              onClick={onConfirm}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
            >
              Confirm
            </Button>
          ) : step === 5 ? (
            <Button
              onClick={onSubmit}
              className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] text-white py-3 rounded-lg font-medium"
              disabled={isProcessing || pinDigits.join("").length !== 4}
            >
              {isProcessing ? "Processing..." : "Convert to Cash"}
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

export default AirtimeToCashModal
