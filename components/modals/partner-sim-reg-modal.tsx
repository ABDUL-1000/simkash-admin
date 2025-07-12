"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReusableModal } from "@/components/modals/reusableModal"
import { FormError } from "@/components/formError"
import { AuthAPI } from "@/lib/API/api"

interface SimBatch {
  id: number
  batch_name: string
  quantity: number
  number_of_assigned: number
  status: string
}

interface PhoneVerificationInfo {
  phone: string
  name: string
  verified: boolean
}

interface SimRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const simRegistrationSchema = z.object({
  sim_number: z.string().min(11, "SIM number must be at least 11 digits"),
  batch_id: z.number().min(1, "Please select a SIM batch"),
  network: z.string().min(1, "Please select a network"),
  phone: z.string().min(11, "Phone number must be 11 digits").max(11, "Phone number must be 11 digits"),
})

const networks = [
  { value: "MTN", label: "MTN" },
  { value: "Airtel", label: "Airtel" },
  { value: "Glo", label: "Glo" },
  { value: "9mobile", label: "9mobile" },
]

const PartnerSimRegistrationModal: React.FC<SimRegistrationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [simBatches, setSimBatches] = useState<SimBatch[]>([])
  const [phoneInfo, setPhoneInfo] = useState<PhoneVerificationInfo | null>(null)
  const [isLoadingBatches, setIsLoadingBatches] = useState(false)
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

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
  } = useForm<any>({
    resolver: zodResolver(simRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      sim_number: "",
      batch_id: 0,
      network: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      const fetchSimBatches = async () => {
        setIsLoadingBatches(true)
        try {
          const response = await AuthAPI.getAgentSimBatches()
          if (response.success) {
            // Handle both single batch and array of batches
            const batchData = response.data
            const batches = Array.isArray(batchData) ? batchData : [batchData]
            setSimBatches(batches.filter((batch) => batch.status === "active"))
          } else {
            console.error("Failed to load SIM batches:", response.message)
          }
        } catch (error) {
          console.error("Failed to fetch SIM batches:", error)
        } finally {
          setIsLoadingBatches(false)
        }
      }

      fetchSimBatches()
    }
  }, [isOpen])

  const verifyPhoneNumber = async () => {
    const phone = watch("phone")
    if (!phone || phone.length !== 11) return

    setIsVerifyingPhone(true)
    clearErrors("phone")

    try {
      const response = await AuthAPI.verifySimkashAccount(phone)
      if (response.success && response.data) {
        setPhoneInfo({
          phone,
          name: response.data.name || response.data.customer_name || "Phone number verified",
          verified: true,
        })
        clearErrors("phone")
      } else {
        setError("phone", {
          type: "manual",
          message: response.message || "Unable to verify phone number",
        })
        setPhoneInfo(null)
      }
    } catch (error) {
      console.error("Phone verification error:", error)
      setError("phone", {
        type: "manual",
        message: "Failed to verify phone number. Please try again.",
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

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBatch = simBatches.find((batch) => batch.id === Number.parseInt(e.target.value))
    if (selectedBatch) {
      setValue("batch_id", selectedBatch.id, { shouldValidate: true })
    }
  }

  const onSubmit = async (data: any) => {
    try {
      setIsProcessing(true)
      clearErrors("root")

      if (!phoneInfo?.verified) {
        setError("phone", {
          type: "manual",
          message: "Please verify the phone number first",
        })
        return
      }

      const formData = {
        sim_number: data.sim_number,
        batch_id: data.batch_id,
        network: data.network,
        phone: data.phone,
      }

      console.log("Submitting SIM registration:", formData)

      const response = await AuthAPI.agentActivateSim(formData)
      console.log("Registration response:", response)

      if (response.success) {
        setShowSuccessModal(true)
        reset()
        setPhoneInfo(null)

        if (onSuccess) {
          onSuccess({
            ...formData,
            timestamp: new Date().toISOString(),
            status: "success",
          })
        }
      } else {
        setError("root", {
          type: "manual",
          message: response.message || "SIM registration failed",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const onReset = () => {
    setPhoneInfo(null)
    setIsProcessing(false)
    setShowSuccessModal(false)
    reset()
    onClose()
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    onReset()
  }

  if (!isMounted) return null

  return (
    <>
      <ReusableModal isOpen={isOpen && !showSuccessModal} onClose={onReset} title="Add New SIM" subTitle="">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SIM Number</label>
            <Input placeholder="Enter SIM number here" {...register("sim_number")} />
            <FormError message={errors.sim_number?.message} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <Input placeholder="Enter phone number here" {...register("phone")} onBlur={handlePhoneBlur} />
            <FormError message={errors.phone?.message} />
          </div>

          {isVerifyingPhone && (
            <div className="p-3 bg-gray-50 rounded-md text-center">
              <span className="text-gray-500">Verifying phone number...</span>
            </div>
          )}

          {phoneInfo && !isVerifyingPhone && (
            <div className="p-3 bg-[#EEF9FF] rounded-md">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Phone Status:</span>
                <span className="font-medium text-green-600">Verified</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{phoneInfo.name}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SIM Batch</label>
            <select
              {...register("batch_id", {
                valueAsNumber: true,
                onChange: handleBatchChange,
              })}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              disabled={isLoadingBatches}
            >
              <option value={0}>Select SIM Batch</option>
              {simBatches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batch_name} (Available: {batch.quantity - batch.number_of_assigned})
                </option>
              ))}
            </select>
            <FormError message={errors.batch_id?.message} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Network</label>
            <select {...register("network")} className="w-full p-2 border border-gray-300 rounded-md bg-white">
              <option value="">Select Network</option>
              {networks.map((network) => (
                <option key={network.value} value={network.value}>
                  {network.label}
                </option>
              ))}
            </select>
            <FormError message={errors.network?.message} />
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="bg-[#D7EFF6] text-[#60B3D1] hover:bg-[#255C79] hover:text-[#FFFFFF] w-full"
            disabled={isProcessing || !phoneInfo?.verified}
          >
            {isProcessing ? "Processing..." : "Add & Activate"}
          </Button>
        </form>
      </ReusableModal>

      {/* Success Modal */}
      <ReusableModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="SIM Successfully Activated!"
        subTitle=""
        successMode={true}
        successIcon={<CheckCircle className="w-12 h-12 text-green-500" />}
        successMessage={`The SIM card has been successfully added and activated for ${
          phoneInfo?.name || "the customer"
        }. The user can now subscribe to a data plan and begin using the service immediately.`}
        successActions={[
          {
            label: "Go to Dashboard",
            onClick: handleSuccessModalClose,
            variant: "default",
          },
          {
            label: "Add Another SIM",
            onClick: () => {
              setShowSuccessModal(false)
              // Keep the main modal open for another registration
            },
            variant: "outline",
          },
        ]}
      />
    </>
  )
}

export default PartnerSimRegistrationModal
