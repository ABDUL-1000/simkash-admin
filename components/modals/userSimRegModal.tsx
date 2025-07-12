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

interface UserSimRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
}

const simRequestSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  // Removed address field
  // Removed quantity field
})

const UserSimRequestModal: React.FC<UserSimRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
    resolver: zodResolver(simRequestSchema),
    mode: "onChange",
    defaultValues: {
      country: "",
      state: "",
      lga: "",
     
    },
  })

  const onSubmit = async (data: any) => {
    try {
      setIsProcessing(true)
      clearErrors("root")

      const formData = {
        country: data.country,
        state: data.state,
        lga: data.lga,
        // Removed address from formData
        // Removed quantity from formData
      }

      console.log("Submitting SIM request:", formData)

      const response = await AuthAPI.userRequestSim(formData)
      console.log("SIM request response:", response)

      if (response.success) {
        setShowSuccessModal(true)
        reset()

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
          message: response.message || "SIM request failed",
        })
      }
    } catch (error) {
      console.error("SIM request error:", error)
      setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const onReset = () => {
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
      <ReusableModal isOpen={isOpen && !showSuccessModal} onClose={onReset} title="Request SIM Card" subTitle="">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <Input placeholder="Enter country" {...register("country")} />
            <FormError message={errors.country?.message} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <Input placeholder="Enter state" {...register("state")} />
            <FormError message={errors.state?.message} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Local Government Area</label>
            <Input placeholder="Enter LGA" {...register("lga")} />
            <FormError message={errors.lga?.message} />
          </div>

         

          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            className="bg-[#D7EFF6] text-[#60B3D1] hover:bg-[#255C79] hover:text-[#FFFFFF] w-full"
            disabled={isProcessing}
          >
            {isProcessing ? "Submitting Request..." : "Submit Request"}
          </Button>
        </form>
      </ReusableModal>

      {/* Success Modal */}
      <ReusableModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="SIM Request Submitted!"
        subTitle=""
        successMode={true}
        successIcon={<CheckCircle className="w-12 h-12 text-green-500" />}
        successMessage={`Your SIM card request has been successfully submitted. You will be contacted within 24-48 hours for delivery arrangements.`}
        successActions={[
          {
            label: "Go to Dashboard",
            onClick: handleSuccessModalClose,
            variant: "default",
          },
          {
            label: "Submit Another Request",
            onClick: () => {
              setShowSuccessModal(false)
            },
            variant: "outline",
          },
        ]}
      />
    </>
  )
}

export default UserSimRequestModal
