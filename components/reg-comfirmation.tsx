"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function RegistrationConfirmation() {
  const handleDone = () => {
    // Navigate back to home or wherever needed
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Dark background with design */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#132939] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">simkash</div>
          </div>
        </div>
        {/* Decorative curved lines */}
        <div className="absolute bottom-0 left-0 w-full h-64">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <path d="M0,200 Q100,50 200,100 T400,80 L400,200 Z" fill="rgba(255,255,255,0.1)" />
            <path d="M0,200 Q150,30 300,90 T400,60 L400,200 Z" fill="rgba(255,255,255,0.05)" />
          </svg>
        </div>
      </div>

      {/* Right side - Confirmation */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">We've received your application</h1>
            <p className="text-gray-600">We will process it and reach out to you in few days.</p>
          </div>

          <Button onClick={handleDone} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
