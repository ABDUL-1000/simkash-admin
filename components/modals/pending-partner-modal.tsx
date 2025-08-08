"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Loader2, X, FileText, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { useApprovePartner, usePartnerDetails } from "@/hooks/use-pending-partners" // Corrected import path

interface PartnerDetailsModalProps {
  partnerId: number | null
  isOpen: boolean
  onClose: () => void
}

export default function PartnerDetailsModal({ partnerId, isOpen, onClose }: PartnerDetailsModalProps) {
  const { data: partnerDetails, isLoading, isError, error } = usePartnerDetails(partnerId)
  const approveMutation = useApprovePartner()
  
  const handleApprove = async () => {
    if (partnerId) {
      try {
        await approveMutation.mutateAsync(partnerId)
        toast.success(`Partner ${partnerDetails?.agent.fullname} has been approved.`)
        onClose()
      } catch (err: any) {
        toast.error(err.message || "There was an error approving the partner.")
      }
    }
  }

  // Removed handleDeny as per your request

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
            <SheetTitle className="text-left text-xl font-semibold">Application Details</SheetTitle>
            {/* Re-added close button */}
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetHeader>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading details...</span>
            </div>
          ) : isError ? (
            <div className="flex-1 flex items-center justify-center text-red-500">
              Error: {error?.message || "Failed to load details."}
            </div>
          ) : partnerDetails ? (
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Full Name</p>
                  <p className="font-medium">{partnerDetails.agent.fullname}</p>
                </div>
                {/* Email Address */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Email Address</p>
                  <p className="font-medium">{partnerDetails.agent.email}</p>
                </div>
                {/* Phone Number */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                  <p className="font-medium">{partnerDetails.agent.phone || "N/A"}</p>
                </div>
                {/* Country and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Country</p>
                    <p className="font-medium">{partnerDetails.agent.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">State</p>
                    <p className="font-medium">{partnerDetails.agent.state || "N/A"}</p>
                  </div>
                </div>
                {/* LGA */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">LGA</p>
                  <p className="font-medium">{partnerDetails.agent.lga || "N/A"}</p>
                </div>
                {/* Home Address */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Home Address</p>
                  <p className="font-medium">{partnerDetails.agent.address || "N/A"}</p>
                </div>
                {/* Reason for partnership */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Why do you want to be simkash partner?</p>
                  <p className="font-medium">{partnerDetails.agent.reason || "N/A"}</p>
                </div>
                {/* Documents Uploaded */}
                <div>
                  <div className="font-medium mb-3">Documents Uploaded</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <a
                          href={partnerDetails.agent.idCard || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Government Issued ID.pdf
                        </a>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Assuming there might be other documents like NIN, adding a placeholder */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">My NIN.png</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              No partner selected or details not found.
            </div>
          )}
          {/* Action Buttons */}
          {partnerDetails && (
            <div className="border-t px-6 py-4">
              <div className="flex gap-3">
                {/* Deny button, kept for display but disabled as no API is available yet */}
                <Button
                  variant="outline"
                  onClick={() => toast.info("Deny functionality not yet implemented.")} // Placeholder action
                  disabled={true} // Always disabled until API is ready
                  className="flex-1 bg-transparent text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Deny
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={approveMutation.isPending || !partnerId}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {approveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Accept
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
