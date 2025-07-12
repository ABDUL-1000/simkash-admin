"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ResponsiveModal } from "../mobileDrawer";

interface ExamsPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWaec: () => void;
  onSelectJamb: () => void;
}

export function ExamPaymentModal({
  isOpen,
  onClose,
  onSelectWaec,
  onSelectJamb,
}: ExamsPaymentModalProps) {
  return (
    <ResponsiveModal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-fit w-[calc(100%-32px)] mx-4" // Adjusted width and margins
    >
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center">
          <div className="flex-1 text-center">
            <h2 className="text-lg font-medium">Choose Exam type</h2>
          </div>
        </div>

        <div className="space-y-3 w-full"> {/* Reduced space between buttons */}
          <Button 
            onClick={onSelectWaec} 
            className="w-full h-auto py-3 px-3 flex items-center gap-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            variant="ghost"
          >
            <div className="bg-gray-100 p-2 rounded-full shrink-0">
              <Image 
                src="/simicon.png" 
                alt="Simkash" 
                width={20} 
                height={20}
                className="w-5 h-5" // Slightly smaller icon
              />
            </div>
            <div className="flex-1 flex flex-col items-start text-left min-w-0 overflow-hidden">
              <span className="font-semibold text-sm">WAEC Result Checker</span> {/* Smaller text */}
              <span className="font-normal text-xs text-gray-500">
              Get your WAEC result checker PIN and access your exam results anytime, anywhere with ease.
              </span>
            </div>
          </Button>
          
          <Button
            onClick={onSelectJamb}
            className="w-full h-auto py-3 px-3 flex items-center gap-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            variant="ghost"
          >
            <div className="bg-gray-100 p-2 rounded-full shrink-0">
              <Image 
                src="/bank.png"
                alt="Bank Transfer" 
                width={20} 
                height={20}
                className="w-5 h-5" // Slightly smaller icon
              />
            </div>
            <div className="flex-1 flex flex-col items-start text-left min-w-0 overflow-hidden">
              <span className="font-semibold text-sm">JAMB Registration PIN</span> {/* Smaller text */}
              <span className="font-normal text-xs text-gray-500">
               Secure your official JAMB e-PIN instantly to begin your UTME registration—fast, easy, and 100% approved.
              </span>
            </div>
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}