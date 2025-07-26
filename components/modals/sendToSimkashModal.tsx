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

    interface SimkashTransferModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (data: any) => void
    }

    const simkashTransferSchema = z.object({
    account: z.string()  .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^[0-9]+$/, "Account number must contain only digits"),
    amount: z.string().min(1, "Amount is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number"
    }),
    narration: z.string().max(100, "Narration must be less than 100 characters").optional(),
    pin: z.string().min(4, "PIN must be 4 digits").max(4, "PIN must be 4 digits").optional(),
    })

    const SendMoneyToSimkashModal: React.FC<SimkashTransferModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1)
    const [isVerifyingAccount, setIsVerifyingAccount] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [customerName, setCustomerName] = useState("")
    const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
    const [transactionId, setTransactionId] = useState("")
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
        resolver: zodResolver(simkashTransferSchema),
        mode: "onChange",
        defaultValues: {
        account: "",
        amount: "",
        narration: "",
        pin: "",
        },
    })

    // Verify account number
const verifyAccount = async () => {
  const account = watch("account");
  if (!account || account.length !== 10) {
    setError("account", {
      type: "manual",
      message: "Account number must be 10 digits",
    });
    return;
  }

  setIsVerifyingAccount(true);
  clearErrors("account");

  try {
    console.log("Verifying account:", account); // Debug log
    const response = await AuthAPI.verifySimkashAccount(account);
    console.log("Verification response:", response); // Debug log
    
    if (response.success) {
      const name = response.data?.responseBody?.name || 
                  response.data?.name || 
                  "Verified Account";
      setCustomerName(name);
      clearErrors("account");
    } else {
      setError("account", {
        type: "manual",
        message: response.message || "Unable to verify account",
      });
      setCustomerName("");
    }
  } catch (error: any) {
    console.error("Verification error:", error);
    setError("account", {
      type: "manual",
      message: error.message || "Failed to verify account. Please try again.",
    });
    setCustomerName("");
  } finally {
    setIsVerifyingAccount(false);
  }
};
const handleAccountBlur = async () => {
  await trigger("account");
  if (watch("account")?.length === 10) {  
    await verifyAccount();
  }
};
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
        const isValidStep1 = await trigger(["account", "amount"])
        if (isValidStep1 && customerName) {
        setStep(step + 1)
        }
    }

    const onBack = () => setStep((prev) => prev - 1)

    const onReset = () => {
        setStep(1)
        setCustomerName("")
        setIsProcessing(false)
        setPinDigits(["", "", "", ""])
        setTransactionId("")
        setTransactionStatus(null)
        reset()
        onClose()
    }

    // Submit transfer
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

        const payload = {
            account: watch("account"),
            amount: Number(watch("amount")),
            pin: pinNumber,
            narration: watch("narration"),
        }

        console.log("Submitting Simkash transfer:", payload)

        const response = await AuthAPI.sendMoneyToSimkash(payload)
        console.log("Transfer response:", response)

        if (response.success) {
            const transactionRef = response.data?.reference || `SIMKASH${Date.now().toString().slice(-8)}`
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
            message: response.message || "Transfer failed",
            })
        }
        } catch (error) {
        console.error("Transfer error:", error)
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
            return "Simkash Transfer"
        case 2:
            return "Confirm Transfer"
        case 3:
            return transactionStatus === "failed" ? "Transfer Failed" : "Transfer Complete"
        default:
            return "Simkash Transfer"
        }
    }

    const downloadReceipt = () => {
        const receiptData = {
        transactionId,
        amount: watch("amount") || "0",
        recipient: customerName || "N/A",
        account: watch("account") || "N/A",
        narration: watch("narration") || "N/A",
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
                    <label className="block text-sm font-medium text-gray-700">Recipient Phone Number</label>
                  <Input 
  placeholder="Enter 10-digit account number" 
  {...register("account")}
  onBlur={handleAccountBlur}
  inputMode="numeric"
  maxLength={10}
/>
                    <FormError message={errors.account?.message} />
                </div>

                {isVerifyingAccount && (
                    <div className="p-3 bg-gray-50 rounded-md text-center">
                    <span className="text-gray-500">Verifying account...</span>
                    </div>
                )}

                {customerName && !isVerifyingAccount && (
                    <div className="p-3 bg-[#EEF9FF] rounded-md">
                    <div className="flex justify-between py-1">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-medium">{customerName}</span>
                    </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
                    <Input 
                    placeholder="Enter amount" 
                    {...register("amount")}
                    inputMode="numeric"
                    />
                    <FormError message={errors.amount?.message} />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Narration (Optional)</label>
                    <Input 
                    placeholder="Enter description" 
                    {...register("narration")}
                    maxLength={100}
                    />
                    <FormError message={errors.narration?.message} />
                </div>
                </>
            )}

            {step === 2 && (
                <div className="space-y-6">
                <div className="p-4 bg-[#EEF9FF] rounded-md space-y-3">
                    <h3 className="font-medium text-gray-900">Transfer Summary</h3>
                    <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Recipient:</span>
                        <span>{customerName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Phone Number:</span>
                        <span>{watch("account")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span>₦{Number(watch("amount") || 0).toLocaleString()}</span>
                    </div>
                    {watch("narration") && (
                        <div className="flex justify-between">
                        <span className="text-gray-600">Narration:</span>
                        <span>{watch("narration")}</span>
                        </div>
                    )}
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-600 mb-4">Enter PIN to confirm transfer</p>
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
                    <h3 className="text-xl font-semibold text-green-600">Transfer Successful</h3>
                    <p className="text-gray-600">
                        ₦{Number(watch("amount") || 0).toLocaleString()} has been sent to {customerName || "recipient"}
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
                    <h3 className="text-xl font-semibold text-red-600">Transfer Failed</h3>
                    <p className="text-gray-600">
                        Your transfer of ₦{Number(watch("amount") || 0).toLocaleString()} could not be completed.
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
                    (step === 1 && (!customerName || isVerifyingAccount)) ||
                    (step === 2 && (isProcessing || pinDigits.join("").length !== 4))
                }
                >
                {step === 1 ? "Continue" : isProcessing ? "Processing..." : "Transfer"}
                </Button>
            )}
            </div>
        </div>
        </ResponsiveModal>
    )
    }

    export default SendMoneyToSimkashModal