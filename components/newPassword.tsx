"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { useRouter, useSearchParams } from "next/navigation"
import { AuthAPI } from "@/lib/API/api"

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  newPassword?: string
  confirmPassword?: string
  general?: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/forgot-password")
    }
  }, [email, router])

  const updateFormData = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleResetPassword = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      const response = await AuthAPI.createNewPassword({
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      })

      if (response.success) {
        setSuccessMessage("Password reset successfully! Redirecting to login...")
        // Clear any stored tokens since password was reset
        AuthAPI.clearAccessToken()
        // Redirect to login page
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setErrors({ general: response.message || "Failed to reset password" })
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="hidden w-1/2 md:flex relative flex-col items-center justify-center bg-white p-4">
        <div className="absolute top-4 left-10 text-sm text-black">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center">
              <Image src="/simcard.png" alt="Logo" width={40} height={40} />
            </div>
            <span className="text-xl font-semibold text-slate-800">simkash</span>
          </div>
        </div>
        <div className="w-[60%] flex flex-col items-center text-center">
          <Image
            src="/sim.png"
            alt="Reset Password Illustration"
            width={400}
            height={400}
            className="w-4/6 h-4/6 pt-20 flex justify-center items-center"
          />
          <h2 className="mt-6 text-2xl font-semibold text-slate-800">
            Secure Your SIM. Own Your Data. Grow Your Wallet.
          </h2>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col relative bg-gray-100 p-6">
        {/* Top Right back link */}
        <div className="absolute top-4 hidden lg:block right-10 text-sm text-black">
          <Link href="/login" className="flex items-center gap-2 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {/* Mobile header */}
        <div className="flex items-center lg:hidden justify-between">
          <div className="flex lg:h-6 lg:w-6 items-center gap-1">
            <Image src="/simcard.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-semibold text-slate-800">simkash</span>
          </div>
          <Link href="/login" className="flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-lg shadow-md bg-white p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
              <p className="text-gray-600 text-sm mt-2">
                Your new password must be different from previous used passwords.
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => updateFormData("newPassword", e.target.value)}
                    className={`h-10 pl-10 pr-10 border-gray-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className={`h-10 pl-10 pr-10 border-gray-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                  <li className={/(?=.*[a-z])/.test(formData.newPassword) ? "text-green-600" : ""}>
                    One lowercase letter
                  </li>
                  <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? "text-green-600" : ""}>
                    One uppercase letter
                  </li>
                  <li className={/(?=.*\d)/.test(formData.newPassword) ? "text-green-600" : ""}>One number</li>
                </ul>
              </div>

              {/* Reset Password Button */}
              <Button
                type="button"
                onClick={handleResetPassword}
                className="w-full h-10 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
