"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onExplore: () => void
  onLearnMore: () => void
}

export function WelcomeModal({ isOpen, onClose, onExplore, onLearnMore }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto p-8 text-center border-0 shadow-2xl">
        <DialogHeader className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center">
                <Image src="/simcard.png" alt="Logo" width={40} height={40} />
              </div>
              <span className="text-xl font-semibold text-slate-800">simkash</span>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">You are welcome 🎉</p>
            <DialogTitle className="text-2xl font-bold text-slate-800">Get Started With Simkash</DialogTitle>
          </div>

          {/* Description */}
          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            Your account has been successfully created.
            <br />
            We're excited to have you on board.
          </DialogDescription>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="space-y-3 mt-8">
          <Button
            variant="outline"
            onClick={onLearnMore}
            className="w-full h-12 border-gray-300 hover:bg-gray-50 text-slate-700 font-medium"
          >
            Learn More About Us
          </Button>
          <Button onClick={onExplore} className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-medium">
            Explore Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
