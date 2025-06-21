"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AuthAPI } from "@/lib/API/api"
import { toast } from "sonner"

interface ProfileFormData {
  fullname: string
  phone: string
  gender: string
  country: string
  pin: number
  confirmPin: number
}

interface FormErrors {
  fullname?: string
  phone?: string
  gender?: string
  country?: string
  pin?: string
  confirmPin?: string
  general?: string
}

export default function ProfileSetupPage() {
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ProfileFormData>({
    fullname: "",
    phone: "",
    gender: "",
    country: "Nigeria",
    pin: 0,
    confirmPin: 0,
  })

  // Store PIN digits as arrays of strings to handle empty states better
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const [confirmPinDigits, setConfirmPinDigits] = useState<string[]>(["", "", "", ""])

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // PIN input refs
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([])

  // Helper functions for temporary token management
  const getTempToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("temp_access_token")
    }
    return null
  }

  const getUserData = () => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user_data")
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  const clearTempData = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("temp_access_token")
      sessionStorage.removeItem("user_data")
    }
  }

  // Update the numeric PIN values when digits change
  useEffect(() => {
    const pinString = pinDigits.join("")
    const pinNumber = pinString.length === 4 ? Number.parseInt(pinString, 10) : 0
    setFormData((prev) => ({ ...prev, pin: pinNumber }))
  }, [pinDigits])

  useEffect(() => {
    const confirmPinString = confirmPinDigits.join("")
    const confirmPinNumber = confirmPinString.length === 4 ? Number.parseInt(confirmPinString, 10) : 0
    setFormData((prev) => ({ ...prev, confirmPin: confirmPinNumber }))
  }, [confirmPinDigits])

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const tempToken = getTempToken()
      const user = getUserData()

      if (!tempToken || !user) {
        console.log("No temporary authentication found, redirecting to login")
        toast.error("Session expired. Please log in again.")
        router.push("/login")
        return
      }

      setUserData(user)
      console.log("Temporary authentication found for user:", user.email)

      // Pre-fill form with any existing user data
      if (user.fullname) setFormData((prev) => ({ ...prev, fullname: user.fullname }))
      if (user.phone) setFormData((prev) => ({ ...prev, phone: user.phone }))
      if (user.gender) setFormData((prev) => ({ ...prev, gender: user.gender }))
      if (user.country) setFormData((prev) => ({ ...prev, country: user.country }))
    }

    checkAuth()
  }, [router])

  const updateFormData = (field: keyof ProfileFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return

    const currentDigits = isConfirm ? confirmPinDigits : pinDigits
    const setDigits = isConfirm ? setConfirmPinDigits : setPinDigits

    // Update the specific digit
    const newDigits = [...currentDigits]
    newDigits[index] = value
    setDigits(newDigits)

    // Auto-focus next input if value was entered
    if (value && index < 3) {
      const refs = isConfirm ? confirmPinRefs : pinRefs
      refs.current[index + 1]?.focus()
    }

    // Clear errors when user starts typing
    if (errors.pin || errors.confirmPin) {
      setErrors((prev) => ({ ...prev, pin: undefined, confirmPin: undefined }))
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent, isConfirm = false) => {
    const currentDigits = isConfirm ? confirmPinDigits : pinDigits
    const setDigits = isConfirm ? setConfirmPinDigits : setPinDigits
    const refs = isConfirm ? confirmPinRefs : pinRefs

    if (e.key === "Backspace") {
      const newDigits = [...currentDigits]

      if (currentDigits[index]) {
        // Clear current field
        newDigits[index] = ""
        setDigits(newDigits)
      } else if (index > 0) {
        // Move to previous field and clear it
        newDigits[index - 1] = ""
        setDigits(newDigits)
        refs.current[index - 1]?.focus()
      }
    }
  }

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    if (!formData.country) {
      newErrors.country = "Please select your country"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {}

    // Check if all PIN digits are filled
    const pinComplete = pinDigits.every((digit) => digit !== "")
    const confirmPinComplete = confirmPinDigits.every((digit) => digit !== "")

    if (!pinComplete) {
      newErrors.pin = "PIN must be 4 digits"
    }

    if (!confirmPinComplete) {
      newErrors.confirmPin = "Please confirm your PIN"
    } else if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = "PINs do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBackToStep1 = () => {
    setCurrentStep(1)
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateStep2() || !acceptTerms) return

    // Additional validation
    if (!formData.pin || formData.pin < 1000 || formData.pin > 9999) {
      setErrors({ pin: "PIN must be 4 digits" })
      return
    }

    const tempToken = getTempToken()
    if (!tempToken) {
      toast.error("Session expired. Please log in again.")
      router.push("/login")
      return
    }

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      // Prepare the data for the API call
      const profileData = {
        fullname: formData.fullname.trim(),
        phone: formData.phone.replace(/\D/g, ""), // Remove non-digits
        gender: formData.gender.toLowerCase(),
        country: formData.country,
        pin: formData.pin,
      }

      console.log("Sending complete profile data:", profileData)

      // Temporarily set the token for the API call
      const originalToken = AuthAPI.getAccessToken()
      AuthAPI.setAccessToken(tempToken)

      // Use the existing updateProfile method
      const response = await AuthAPI.updateProfile(profileData)

      // Restore original token state (which should be null)
      if (originalToken) {
        AuthAPI.setAccessToken(originalToken)
      } else {
        AuthAPI.clearAccessToken()
      }

      if (response.success) {
        toast.success(response.message || "Profile completed successfully!")
        setSuccessMessage("Profile and PIN created successfully! Redirecting to dashboard...")

        // Move token from temporary to permanent storage
        AuthAPI.setAccessToken(tempToken)
        clearTempData()

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        // Handle specific error cases
        if (response.message?.includes("Session expired") || response.message?.includes("Authentication")) {
          setErrors({
            general: "Your session has expired. Please log in again.",
          })
          clearTempData()
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        } else {
          setErrors({
            general: response.message || "Failed to update profile",
          })
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSetup = () => {
    clearTempData()
    router.push("/login")
  }

  const renderProgressIndicators = () => {
    return (
      <div className="flex items-center gap-2 justify-end">
        <div className={`w-6 h-1 ${currentStep >= 1 ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
        <div className={`w-6 h-1 ${currentStep >= 2 ? "bg-[#24C0FF]" : "bg-gray-300"}`} />
        <div className="w-6 h-1 bg-gray-300" />
      </div>
    )
  }

  const renderPinInput = (
    digits: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    isConfirm = false,
  ) => {
    return (
      <div className="flex gap-2 justify-center">
        {[0, 1, 2, 3].map((index) => (
          <Input
            key={index}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[index]}
            onChange={(e) => handlePinChange(index, e.target.value, isConfirm)}
            onKeyDown={(e) => handlePinKeyDown(index, e, isConfirm)}
            className="w-16 h-16 text-center text-2xl font-semibold border-gray-300 focus:border-cyan-400 focus:ring-cyan-400"
            disabled={isLoading}
            placeholder=""
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* Left Side */}
      <div className="lg:w-1/2 hidden lg:flex relative flex-col items-center justify-center bg-white p-4">
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
            alt="Profile Setup Illustration"
            width={400}
            height={400}
            className="w-4/6 h-4/6 pt-20 flex justify-center items-center"
          />
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Secure Your SIM. Own Your Data.
            <br />
            Grow Your Wallet.
          </h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="lg:w-1/2 h-screen bg-gray-100">
        <div className="flex-col relative p-2">
          <div className="absolute hidden lg:block top-[-15] right-10 text-sm text-black">
            Need to start over?{" "}
            <button onClick={handleCancelSetup} className="hover:underline text-blue-600">
              Back to Login
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600">Profile Setup</p>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {currentStep === 1 ? "Complete Your Profile" : "Create Pin"}
                  </h1>
                  {userData && <p className="text-sm text-gray-500 mt-1">Welcome, {userData.email}</p>}
                </div>
                {renderProgressIndicators()}
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="flex flex-col bg-gray-100 p-2">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md rounded-lg shadow-md bg-white p-6">
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

              {currentStep === 1 ? (
                /* Step 1: Profile Information */
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      value={formData.fullname}
                      onChange={(e) => updateFormData("fullname", e.target.value)}
                      placeholder="John Doe"
                      className={errors.fullname ? "border-red-500" : ""}
                      disabled={isLoading}
                    />
                    {errors.fullname && <p className="text-red-500 text-xs">{errors.fullname}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <select
                        className="h-10 border rounded-l-md bg-white px-2 text-sm focus:border-cyan-400 focus:ring-cyan-400"
                        defaultValue="+234"
                      >
                        <option value="+234">+234</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                      </select>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className={`h-10 border-gray-300 rounded-l-none focus:border-cyan-400 focus:ring-cyan-400 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => updateFormData("gender", e.target.value)}
                      className={`w-full h-10 border-gray-300 border rounded-md ${
                        errors.gender ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => updateFormData("country", e.target.value)}
                      className={`w-full h-10 border border-gray-300 rounded ${errors.country ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                    {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
                  </div>

                  <Button
                    type="button"
                    onClick={handleContinueStep1}
                    className="w-full h-10 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg mt-6"
                    disabled={isLoading}
                  >
                    Continue
                  </Button>
                </form>
              ) : (
                /* Step 2: PIN Creation */
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Password</Label>
                    {renderPinInput(pinDigits, pinRefs)}
                    {errors.pin && <p className="text-red-500 text-xs text-center">{errors.pin}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label>Confirm Password</Label>
                    {renderPinInput(confirmPinDigits, confirmPinRefs, true)}
                    {errors.confirmPin && <p className="text-red-500 text-xs text-center">{errors.confirmPin}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I accept the{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={handleBackToStep1}
                      variant="outline"
                      className="flex items-center justify-center w-12 h-10"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 h-10 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || !acceptTerms || formData.pin < 1000 || formData.confirmPin < 1000}
                    >
                      {isLoading ? "Creating Account..." : "Continue"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
