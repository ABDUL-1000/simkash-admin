"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, CheckCircle, Loader2, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReusableModal } from "@/components/modals/reusableModal"
import { FormError } from "@/components/formError"

import { toast } from "sonner"
import BatchSelectWithSearch from "../BatchSelect" // Assuming this is in components/BatchSelect.tsx
import { SimBatch, useAddSimsToBatch, useSimBatches } from "@/hooks/use-addSim"

const addSimsSchema = z.object({
  batchId: z.number().min(1, "Batch is required"),
  network: z.string(),
  sims: z
    .array(z.string().min(11, "Must be a valid 11-digit phone number").regex(/^[0-9]{11}$/, "Must be a valid 11-digit phone number").max(11, "Must be a valid 11-digit phone number"))
    
})

const networks = [
  { value: "MTN", label: "MTN" },
  { value: "Airtel", label: "Airtel" },
  { value: "Glo", label: "Glo" },
  { value: "9mobile", label: "9mobile" },
]

interface AddSimsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

type FormInputs = z.infer<typeof addSimsSchema>

const AddSimsModal: React.FC<AddSimsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<"form" | "summary" | "success">("form")
  const [summaryData, setSummaryData] = useState<FormInputs | null>(null)
  const [simInput, setSimInput] = useState("")
  const [simNumbers, setSimNumbers] = useState<string[]>([])
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<SimBatch | null>(null)
  const addSimsMutation = useAddSimsToBatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors,
  } = useForm<FormInputs>({
    resolver: zodResolver(addSimsSchema),
    defaultValues: {
      batchId: 0,
      network: "",
      sims: [],
    },
  })

  const watchedBatchId = watch("batchId")
  const watchedNetwork = watch("network")

  // Fetch batch details to get network if not already known
  const { data: batchesData } = useSimBatches({ page: 1, limit: 100 }) // Fetch all batches for lookup

  useEffect(() => {
    if (batchesData && watchedBatchId) {
      const batch = batchesData.simBatch.find((b) => b.id === watchedBatchId)
      if (batch) {
        setSelectedBatchDetails(batch)
        // If batch has a network, pre-fill it and make it read-only
        if (batch.network) {
          setValue("network", batch.network, { shouldValidate: true })
        } else {
          // If batch network is null, allow user to select
          setValue("network", "", { shouldValidate: true })
        }
      }
    } else {
      setSelectedBatchDetails(null)
      setValue("network", "")
    }
  }, [watchedBatchId, batchesData, setValue])

  useEffect(() => {
    setValue("sims", simNumbers, { shouldValidate: true })
  }, [simNumbers, setValue])

  const handleAddSimNumber = () => {
    const trimmedSimInput = simInput.trim()
    const simNumberSchema = z.string().regex(/^[0-9]{11}$/, "Must be a valid 11-digit phone number")

    try {
      simNumberSchema.parse(trimmedSimInput) // Validate individual SIM
      if (trimmedSimInput && !simNumbers.includes(trimmedSimInput)) {
        setSimNumbers((prev) => [...prev, trimmedSimInput])
        setSimInput("")
        clearErrors("sims") // Clear error if successfully added
      } else if (simNumbers.includes(trimmedSimInput)) {
        toast.error("Duplicate SIM number.", { description: `${trimmedSimInput} is already in the list.` })
      }
    } catch (e: any) {
      toast.error("Invalid SIM number", { description: e.errors[0].message })
    }
  }

  const handleRemoveSimNumber = (simToRemove: string) => {
    setSimNumbers((prev) => prev.filter((sim) => sim !== simToRemove))
  }

  const handleFormSubmit = (data: FormInputs) => {
    setSummaryData(data)
    setCurrentStep("summary")
  }

  const handleConfirmSubmit = async () => {
    if (!summaryData) return
    try {
      const response = await addSimsMutation.mutateAsync(summaryData)
  
      setCurrentStep("success")
      if (onSuccess) {
        onSuccess(response.responseBody)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add SIMs to batch.")
    }
  }

  const handleBackToForm = () => {
    setCurrentStep("form")
  }

  const handleCloseAllModals = () => {
    setCurrentStep("form")
    setSummaryData(null)
    setSimNumbers([])
    setSimInput("")
    setSelectedBatchDetails(null)
    reset({
      batchId: 0,
      network: "",
      sims: [],
    })
    onClose()
  }

  const handleSuccessModalClose = () => {
    handleCloseAllModals()
  }

  return (
    <>
      {/* Main Add SIMs Modal */}
      <ReusableModal
        isOpen={isOpen && currentStep !== "success"}
        onClose={handleCloseAllModals}
        title={currentStep === "form" ? "Add SIMs " : "Confirm Addition"}
        subTitle=''
      >
        {currentStep === "form" && (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Batch</label>
              <BatchSelectWithSearch
                value={watchedBatchId || null}
                onChange={(batchId, batchNetwork, batchName) => {
                  setValue("batchId", batchId || 0, { shouldValidate: true })
                  if (batchNetwork) {
                    setValue("network", batchNetwork, { shouldValidate: true })
                  } else {
                    setValue("network", "", { shouldValidate: true }) 
                  }
                 
                }}
              />
              <FormError message={errors.batchId?.message} />
            </div>

            <div className="space-y-2">
              <label htmlFor="network" className="block text-sm font-medium text-gray-700">
                Network
              </label>
              <select
                id="network"
                {...register("network")}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                disabled={!!selectedBatchDetails?.network} // Disable if batch already has a network
              >
                <option value="">Choose network provider</option>
                {networks.map((network) => (
                  <option key={network.value} value={network.value}>
                    {network.label}
                  </option>
                ))}
              </select>
              {selectedBatchDetails?.network && (
                <p className="text-xs text-gray-500 mt-1">Network pre-filled from selected batch.</p>
              )}
              <FormError message={errors.network?.message} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Add SIM Numbers</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  maxLength={11}
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  placeholder="08012345678"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSimNumber()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSimNumber} disabled={!simInput.trim()} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormError message={errors.sims?.message} />
            </div>

            {simNumbers.length > 0 && (
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-1">{simNumbers.length} SIM number(s) added</div>
                <div className="space-y-1">
                  {simNumbers.map((sim) => (
                    <div key={sim} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{sim}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveSimNumber(sim)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={simNumbers.length === 0 || !watchedBatchId || !watchedNetwork}
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
                <span className="text-gray-700">Batch Name:</span>
                <span className="font-medium text-gray-900">{selectedBatchDetails?.batch_name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Network Provider:</span>
                <span className="font-medium text-gray-900">{summaryData.network}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">SIM Numbers:</span>
                <span className="font-medium text-gray-900">{summaryData.sims.length}</span>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {summaryData.sims.map((sim) => (
                  <div key={sim} className="text-sm text-gray-700 py-1 border-b border-gray-200">
                    {sim}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between gap-3 pt-4">
              <Button variant="outline" onClick={handleBackToForm} className="px-4 py-2 bg-black text-white rounded-md">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={addSimsMutation.isPending}
                className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-md"
              >
                {addSimsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
        title="SIMs Successfully Added!"
        subTitle=""
        successMode={true}
        successIcon={<CheckCircle className="w-12 h-12 text-green-500" />}
        successMessage={`Added ${summaryData?.sims.length} SIMs to batch "${selectedBatchDetails?.batch_name || "selected batch"}"`}
        successActions={[
          {
            label: "Go to Dashboard",
            onClick: handleSuccessModalClose,
            variant: "default",
          },
          {
            label: "Add More SIMs",
            onClick: () => {
              setCurrentStep("form")
              setSummaryData(null)
              setSimNumbers([])
              setSimInput("")
              setSelectedBatchDetails(null)
              reset({
                batchId: 0,
                network: "",
                sims: [],
              })
            },
            variant: "outline",
          },
        ]}
      />
    </>
  )
}

export default AddSimsModal
