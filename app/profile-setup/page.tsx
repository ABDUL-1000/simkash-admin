"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface FormData {
  fullName: string
  phoneNumber: string
  countryCode: string
  gender: string
  country: string
  referralCode: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

const steps = [
  { id: 1, title: "Basic Info" },
  { id: 2, title: "Create Password" },
  { id: 3, title: "Verification" },
]

const countries = [
  { code: "+234", name: "Nigeria" },
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+233", name: "Ghana" },
  { code: "+254", name: "Kenya" },
]

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    countryCode: "+234",
    gender: "",
    country: "",
    referralCode: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Handle final submission
      console.log("Form submitted:", formData)
      alert("Profile setup completed! (This would normally call your API)")
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.phoneNumber && formData.gender && formData.country
      case 2:
        return (
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.acceptTerms
        )
      case 3:
        return true
      default:
        return false
    }
  }

  const renderProgressBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${currentStep >= step.id ? "bg-cyan-400" : "bg-gray-300"}`} />
          {index < steps.length - 1 && (
            <div className={`w-8 h-0.5 ${currentStep > step.id ? "bg-cyan-400" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => updateFormData("fullName", e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
          Phone Number
        </Label>
        <div className="flex mt-1">
          <Select value={formData.countryCode} onValueChange={(value) => updateFormData("countryCode", value)}>
            <SelectTrigger className="w-24 rounded-r-none border-r-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phoneNumber"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData("phoneNumber", e.target.value)}
            className="rounded-l-none flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
          Gender
        </Label>
        <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
          Country
        </Label>
        <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nigeria">Nigeria</SelectItem>
            <SelectItem value="ghana">Ghana</SelectItem>
            <SelectItem value="kenya">Kenya</SelectItem>
            <SelectItem value="usa">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="referralCode" className="text-sm font-medium text-gray-700">
          Referral Code (optional)
        </Label>
        <Input
          id="referralCode"
          placeholder="Enter referral code here"
          value={formData.referralCode}
          onChange={(e) => updateFormData("referralCode", e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative mt-1">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Strong password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password
        </Label>
        <div className="relative mt-1">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={formData.acceptTerms}
          onCheckedChange={(checked) => updateFormData("acceptTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
          I accept the{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </Label>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Verification Required</h3>
        <p className="text-gray-600 mt-2">
          We've sent a verification code to your phone number. Please enter the code to complete your profile setup.
        </p>
      </div>
      <div>
        <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
          Verification Code
        </Label>
        <Input
          id="verificationCode"
          placeholder="Enter 6-digit code"
          className="mt-1 text-center text-lg tracking-widest"
          maxLength={6}
        />
      </div>
      <p className="text-sm text-gray-500">
        Didn't receive the code? <button className="text-blue-600 hover:underline">Resend</button>
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <Image
              src="/simkash-illustration.png"
              alt="SimKash Illustration"
              width={400}
              height={400}
              className="mx-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure Your SIM. Own Your Data.
            <br />
            Grow Your Wallet.
          </h2>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">simkash</span>
          </div>
          <div className="text-sm text-gray-600">
            Already have account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Profile Setup</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {steps.find((step) => step.id === currentStep)?.title}
              </h1>
            </div>

            {renderProgressBar()}

            <div className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <Button
                onClick={handleContinue}
                disabled={!isStepValid()}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-lg font-medium"
              >
                {currentStep === 3 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
