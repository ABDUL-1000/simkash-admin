"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface OnboardingOverlayProps {
  onComplete: () => void
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleExplore = () => {
    setIsVisible(false)
    localStorage.setItem("onboardingComplete", "true")
    onComplete()
  }

  const handleLearnMore = () => {
    // Implement learn more functionality
    window.open("https://simkash.com/about", "_blank")
  }

  return isVisible ? (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="mb-6">
          <Image src="/images/simcard.png" alt="Simkash Logo" width={60} height={60} />
        </div>

        <div className="mb-8 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-gray-200 mb-2">Your account has been successfully created.</h2>
        <p className="text-gray-400 mb-10">We're excited to have you on board.</p>

        <div className="space-y-4 w-full">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={handleLearnMore}
          >
            Learn More About Us
          </Button>

          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleExplore}>
            Explore Dashboard
          </Button>
        </div>
      </div>
    </div>
  ) : null
}
