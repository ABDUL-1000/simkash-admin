"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReusableModal } from "@/components/modals/reusableModal"
import { FormError } from "@/components/formError"
import { AuthAPI } from "@/lib/API/api"
import { toast } from "sonner"
import { DistributableSimBatch, useDistributableSimBatches, useDistributeSim } from "@/hooks/use-distributeSim"

interface PhoneVerificationInfo {
  phone: string
  name: string
  verified: boolean
}

interface DistributeSimsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

// Define the schema for distributing a SIM
const distributeSimSchema = z.object({
  id: z.number().min(1, "Please select a SIM batch"),
  phone: z.string().length(11, "Phone number must be 11 digits"),
})

type FormInputs = z.infer<typeof distributeSimSchema>

const DistributeSimsModal: React.FC<DistributeSimsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [phoneInfo, setPhoneInfo] = useState<PhoneVerificationInfo | null>(null)
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const {
    data: simBatchesData,
    isLoading: isLoadingBatches,
    isError: isErrorBatches,
    refetch: refetchBatches,
  } = useDistributableSimBatches()
  const distributeSimMutation = useDistributeSim()
  console.log("simBatchesData:", simBatchesData)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
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
    trigger,
  } = useForm<FormInputs>({
    resolver: zodResolver(distributeSimSchema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      phone: "",
    },
  })

  const verifyPhoneNumber = async () => {
    const phone = watch("phone")
    if (!phone || phone.length !== 11) {
      setError("phone", {
        type: "manual",
        message: "Phone number must be 11 digits",
      })
      setPhoneInfo(null)
      return
    }
    setIsVerifyingPhone(true)
    clearErrors("phone")
    try {
      const response = await AuthAPI.verifySimkashAccount(phone)
      if (response.success) {
        const name = response.data?.responseBody?.name || response.data?.name || "Verified Account"
        setPhoneInfo({
          phone,
          name,
          verified: true,
        })
        clearErrors("phone")
       
      } else {
        setError("phone", {
          type: "manual",
          message: response.message || "Unable to verify phone number",
        })
        setPhoneInfo(null)
        toast.error(response.message || "Failed to verify phone number.")
      }
    } catch (error: any) {
      console.error("Verification error:", error)
      setError("phone", {
        type: "manual",
        message: error.message || "Failed to verify phone number. Please try again.",
      })
      setPhoneInfo(null)
      
    } finally {
      setIsVerifyingPhone(false)
    }
  }

  const handlePhoneBlur = async () => {
    await trigger("phone")
    if (watch("phone")?.length === 11) {
      await verifyPhoneNumber()
    }
  }

  const onSubmit = async (data: FormInputs) => {
    try {
      if (!phoneInfo?.verified) {
        setError("phone", {
          type: "manual",
          message: "Please verify the phone number first",
        })
        return
      }

      const payload = {
        batchId: data.id,
        phone: data.phone,
      }

      const response = await distributeSimMutation.mutateAsync(payload)

      setShowSuccessModal(true)
      reset()
      setPhoneInfo(null)
      if (onSuccess) {
        onSuccess(response.responseBody)
      }
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message || "SIM distribution failed",
      })
    
    }
  }

  const onReset = () => {
    setPhoneInfo(null)
    setShowSuccessModal(false)
    reset()
    onClose()
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    onReset()
  }

  const simBatches = simBatchesData || []

  if (!isMounted) return null

  return (
    <>
      <ReusableModal
        isOpen={isOpen && !showSuccessModal}
        onClose={onReset}
        title="Distribute SIMs to State Coordinator"
        subTitle=""
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700">
              Sim Batch
            </label>
            <select
              id="batch_id"
              {...register("id", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              disabled={isLoadingBatches}
            >
              <option value={0}>Select SIM batch</option>
              {simBatches.map((batch: DistributableSimBatch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batch_name} 
                </option>
              ))}
            </select>
            <FormError message={errors.id?.message} />
            {isLoadingBatches && <p className="text-sm text-gray-500 mt-1">Loading batches...</p>}
            {isErrorBatches && <p className="text-sm text-red-500 mt-1">Failed to load batches.</p>}
          </div>

          {/* Removed "Select Coordinator" and "Quantity" fields as per request */}

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <div className="relative">
              <Input
                id="phone"
                type="tel" // Use tel for phone numbers
                placeholder="Enter the simkash user ID here"
                {...register("phone")}
                onBlur={handlePhoneBlur}
                className={phoneInfo?.verified ? "border-green-500" : ""}
              />
              {isVerifyingPhone && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
              )}
              {phoneInfo?.verified && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
            <FormError message={errors.phone?.message} />
            {phoneInfo?.verified && <p className="text-sm text-green-600 mt-1">Verified: {phoneInfo.name}</p>}
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="bg-[#D7EFF6] text-[#60B3D1] hover:bg-[#255C79] hover:text-[#FFFFFF] w-full"
            disabled={distributeSimMutation.isPending || !phoneInfo?.verified}
          >
            {distributeSimMutation.isPending ? "Processing..." : "Confirm"}
          </Button>
        </form>
      </ReusableModal>

      <ReusableModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="SIM Successfully Distributed!"
        subTitle=""
        successMode={true}
        successIcon={<CheckCircle className="w-12 h-12 text-green-500" />}
        successMessage={`The SIM has been successfully distributed to ${
          phoneInfo?.name || "the customer"
        }. The user can now subscribe to a data plan and begin using the service immediately.`}
        successActions={[
          {
            label: "Go to Dashboard",
            onClick: handleSuccessModalClose,
            variant: "default",
          },
          {
            label: "Distribute Another SIM",
            onClick: () => {
              setShowSuccessModal(false)
              reset() // Reset form for new entry
              setPhoneInfo(null)
              refetchBatches() // Refetch batches to update available quantities
            },
            variant: "outline",
          },
        ]}
      />
    </>
  )
}

export default DistributeSimsModal
