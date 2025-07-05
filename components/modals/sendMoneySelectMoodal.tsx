"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ResponsiveModal } from "../mobileDrawer";

interface SendMoneySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSimkash: () => void;
  onSelectOtherBank: () => void;
}

export function SendMoneySelectionModal({
  isOpen,
  onClose,
  onSelectSimkash,
  onSelectOtherBank,
}: SendMoneySelectionModalProps) {
  return (
    <ResponsiveModal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-md w-[calc(100%-32px)] mx-4" // Adjusted width and margins
    >
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center">
          <div className="flex-1 text-center">
            <h2 className="text-lg font-medium">Choose Transfer Type</h2>
          </div>
        </div>

        <div className="space-y-3 w-full"> {/* Reduced space between buttons */}
          <Button 
            onClick={onSelectSimkash} 
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
              <span className="font-semibold text-sm">Simkash to Simkash</span> {/* Smaller text */}
              <span className="font-normal text-xs text-gray-500">
                Send money instantly to any Simkash user
              </span>
            </div>
          </Button>
          
          <Button
            onClick={onSelectOtherBank}
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
              <span className="font-semibold text-sm">Send to Bank Account</span> {/* Smaller text */}
              <span className="font-normal text-xs text-gray-500">
                Transfer funds to any other bank account
              </span>
            </div>
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}