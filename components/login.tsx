"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { useRouter } from "next/navigation"
import { AuthAPI } from "@/lib/API/api"

interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const router = useRouter()

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGoogleSignin = () => {
    console.log("Google signin clicked")
    // Implement Google OAuth here
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      const response = await AuthAPI.login({
        email: formData.email,
        password: formData.password,
      })

      if (response.success) {
        setSuccessMessage("Login successful! Redirecting...")
        // Redirect to dashboard or home page
        setTimeout(() => {
          router.push("/dashboard") // Change this to your desired redirect page
        }, 1500)
      } else {
        setErrors({ general: response.message || "Login failed" })
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
            alt="Login Illustration"
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
        {/* Top Right signup link */}
      

        {/* Mobile header */}
        <div className="flex items-center lg:hidden justify-between">
          <div className="flex lg:h-6 lg:w-6 items-center gap-1">
            <Image src="/simcard.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-semibold text-slate-800">simkash</span>
          </div>
          <Link href="/signup" className="">
            <span className="hover:underline">Sign Up</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-lg shadow-md bg-white p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-gray-600 text-sm mt-2">Sign in to your account</p>
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

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignin}
              className="w-full h-10 mb-3 border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign In with Google
            </Button>

            {/* Divider */}
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="olivia@untitledui.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={`h-10 pl-10 border-gray-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className={`h-10 pl-10 pr-10 border-gray-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex justify-end">
                <Link href="/forgetpassword" className="text-sm text-slate-800 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="button"
                onClick={handleSignIn}
                className="w-full h-10 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-slate-800 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
