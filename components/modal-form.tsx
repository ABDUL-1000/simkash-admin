"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ArrowLeft, CheckCircle, X, Clock, Download, Share2 } from "lucide-react"

interface Field {
  id: string
  label: string
  type?: "text" | "select" | "currency" | "pin"
  options?: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  hidden?: boolean
  disabled?: boolean
}

interface Step {
  title: string
  fields: Field[]
  submitLabel?: string
}

interface ModalFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  steps: Step[]
  onSubmit: (data: Record<string, string>) => Promise<{ success: boolean; message?: string }>
  onSuccess?: (data: Record<string, string>) => void
}

export function ModalForm({
  isOpen,
  onOpenChange,
  title,
  steps,
  onSubmit,
  onSuccess,
}: ModalFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"success" | "failed" | "pending" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    // Clear error when field changes
    if (error) setError(null)
  }

  const handlePinChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newPin = [...(formData.pin?.split('') || ['', '', '', ''])]
    newPin[index] = value
    handleChange('pin', newPin.join(''))
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const newPin = [...(formData.pin?.split('') || ['', '', '', ''])]
      if (newPin[index]) {
        newPin[index] = ""
      } else if (index > 0) {
        newPin[index - 1] = ""
        pinRefs.current[index - 1]?.focus()
      }
      handleChange('pin', newPin.join(''))
    }
  }

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className="w-full border rounded px-4 py-2"
            required={field.required}
            disabled={field.disabled}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      case "currency":
        return (
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</div>
            <Input
              id={field.id}
              type="number"
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="pl-8"
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled}
            />
          </div>
        )
      case "pin":
        return (
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                ref={(el) => { pinRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={formData.pin?.[index] || ''}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                className="w-16 h-16 text-center text-2xl font-semibold"
                required={field.required}
              />
            ))}
          </div>
        )
      default:
        return (
          <Input
            id={field.id}
            type={field.type || "text"}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
          />
        )
    }
  }

  const handleNext = () => {
    // Validate current step before proceeding
    const currentFields = steps[currentStep].fields
    const hasEmptyRequiredFields = currentFields.some(
      field => field.required && !formData[field.id]
    )
    
    if (hasEmptyRequiredFields) {
      setError("Please fill in all required fields")
      return
    }
    
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await onSubmit(formData)
      
      if (result.success) {
        setTransactionStatus("success")
        setCurrentStep(steps.length) // Move to success step
        onSuccess?.(formData)
      } else {
        setTransactionStatus("failed")
        setError(result.message || "Payment failed")
      }
    } catch (err) {
      setTransactionStatus("failed")
      setError("An unexpected error occurred")
      console.error("Submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({})
    setCurrentStep(0)
    setTransactionStatus(null)
    setError(null)
    onOpenChange(false)
  }

  const downloadReceipt = () => {
    // Implement receipt download
    console.log("Downloading receipt for:", formData)
  }

  const shareReceipt = () => {
    // Implement receipt sharing
    console.log("Sharing receipt for:", formData)
  }

  const isLastStep = currentStep === steps.length - 1
  const isSuccessStep = currentStep === steps.length

  return (
    
    <Sheet open={isOpen} onOpenChange={handleReset}>
      <SheetContent className="p-0 overflow-y-auto">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            {currentStep > 0 && !isSuccessStep && (
              <button onClick={handleBack} className="flex items-center text-sm text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-1" />
              </button>
            )}
            <SheetTitle className="flex-1 text-center">
              {isSuccessStep ? (
                transactionStatus === "success" ? "Payment Successful" : 
                transactionStatus === "failed" ? "Payment Failed" : title
              ) : steps[currentStep].title}
            </SheetTitle>
            <div className="w-6" />
          </div>

          <div className="flex justify-center gap-2 mt-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-1 ${currentStep >= i ? "bg-[#24C0FF]" : "bg-gray-300"}`} 
              />
            ))}
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!isSuccessStep ? (
            <>
              {steps[currentStep].fields
                .filter(field => !field.hidden)
                .map((field) => (
                  <div key={field.id} className="space-y-2">
                    {field.type !== "pin" && <Label htmlFor={field.id}>{field.label}</Label>}
                    {renderField(field)}
                  </div>
                ))
              }

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                  {error}
                </div>
              )}

              <Button
                type={isLastStep ? "submit" : "button"}
                onClick={isLastStep ? undefined : handleNext}
                className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : 
                 isLastStep ? "Confirm Payment" : 
                 steps[currentStep].submitLabel || "Continue"}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4 py-8">
              {transactionStatus === "success" ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-600">Payment Successful</h3>
                  <p className="text-gray-600">
                    ₦{formData.amount} payment was successful
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600">Payment Failed</h3>
                  <p className="text-gray-600">
                    Your payment could not be completed.
                  </p>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </>
              )}

              <div className="p-3 bg-gray-50 rounded-md text-sm">
                <p className="font-medium">Transaction Details</p>
                <p className="text-gray-500">{formData.meterNumber || "N/A"}</p>
                <p className="text-gray-500 mt-1">₦{formData.amount || "0"}</p>
              </div>

              {transactionStatus === "success" && (
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={downloadReceipt}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    onClick={shareReceipt}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              )}

              <Button 
                onClick={handleReset} 
                className="w-full bg-[#24C0FF] hover:bg-[#1BA8E6] mt-4"
              >
                {transactionStatus === "success" ? "Done" : "Try Again"}
              </Button>
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  )
}