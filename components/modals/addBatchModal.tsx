"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReusableModal } from "@/components/modals/reusableModal"
import { FormError } from "@/components/formError"
import { toast } from "sonner"
import { useAddBatch } from "@/hooks/use-addSim"


// Define the schema for adding a SIM batch
const addSimBatchSchema = z.object({
  batch_name: z.string().min(1, "Batch name is required"),
})

interface DistributeSimModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

type FormInputs = z.infer<typeof addSimBatchSchema>

const AddBatchModal: React.FC<DistributeSimModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<"form" | "summary" | "success">("form")
  const [summaryData, setSummaryData] = useState<FormInputs | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const addSimBatchMutation = useAddBatch()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: zodResolver(addSimBatchSchema),
    mode: "onChange",
    defaultValues: {
      batch_name: "",
    },
  })

  const handleFormSubmit = (data: FormInputs) => {
    setSummaryData(data)
    setCurrentStep("summary")
  }

  const handleConfirmSubmit = async () => {
    if (!summaryData) return
    try {
      const response = await addSimBatchMutation.mutateAsync(summaryData)

      setCurrentStep("success")
      if (onSuccess) {
        onSuccess(response.responseBody)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add SIM batch.")
    }
  }

  const handleBackToForm = () => {
    setCurrentStep("form")
    setSummaryData(null)
  }

  const handleCloseAllModals = () => {
    setCurrentStep("form") // Reset step
    setSummaryData(null)
    reset() // Reset form fields
    onClose() // Close the main modal
  }

  const handleSuccessModalClose = () => {
    handleCloseAllModals()
  }

  if (!isMounted) return null

  return (
    <>
      {/* Main Add SIM Batch Modal (Form or Summary View) */}
      <ReusableModal
        isOpen={isOpen && currentStep !== "success"}
        onClose={handleCloseAllModals}
        title={currentStep === "form" ? "Add SIM Batch" : "Confirm Addition"}
        subTitle=""
      >
        {currentStep === "form" && (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="batch_name" className="block text-sm font-medium text-gray-700">
                Batch Name
              </label>
              <Input id="batch_name" placeholder="e.g., BATCH-001-JUL25" {...register("batch_name")} />
              <FormError message={errors.batch_name?.message} />
            </div>

            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                {errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              className="bg-[#D7EFF6] text-[#60B3D1] hover:bg-[#255C79] hover:text-[#FFFFFF] w-full"
            >
              Confirm
            </Button>
          </form>
        )}
        {currentStep === "summary" && summaryData && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Summary</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sim Batch:</span>
                <span className="font-medium text-gray-900">{summaryData.batch_name}</span>
              </div>
            </div>
            <div className="flex justify-between gap-3 pt-4">
              <Button variant="outline" onClick={handleBackToForm} className="px-4 py-2 bg-black text-white rounded-md">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={addSimBatchMutation.isPending}
                className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-md"
              >
                {addSimBatchMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit
              </Button>
            </div>
          </div>
        )}
      </ReusableModal>
      {/* Success Modal */}
      <ReusableModal
        isOpen={currentStep === "success"}
        onClose={handleSuccessModalClose}
        title="SIM Batch Successfully Added!"
        subTitle=""
        successMode={true}
        successIcon={<CheckCircle className="w-12 h-12 text-green-500" />}
        successMessage={`The SIM batch "${summaryData?.batch_name}" has been successfully added.`}
        successActions={[
          {
            label: "Go to Dashboard",
            onClick: handleSuccessModalClose,
            variant: "default",
          },
          {
            label: "Add Another SIM Batch",
            onClick: () => {
              setCurrentStep("form") // Go back to form for new entry
              setSummaryData(null)
              reset() // Reset form fields
            },
            variant: "outline",
          },
        ]}
      />
    </>
  )
}

export default AddBatchModal
