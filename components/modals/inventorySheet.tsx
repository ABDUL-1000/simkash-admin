// components/service-edit-sheet.tsx
import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useService, useUpdateService } from "@/hooks/use-inventory"
import { toast } from "sonner"


interface ServiceEditSheetProps {
  serviceId: number
  open: boolean
  onClose: () => void
}

const ServiceEditSheet: React.FC<ServiceEditSheetProps> = ({
  serviceId,
  open,
  onClose,
}) => {
  const { data: service, isLoading, error } = useService(serviceId)
  const updateServiceMutation = useUpdateService()

  const [percentage, setPercentage] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (service) {
      setPercentage(service.discount_percentage)
      setIsActive(service.isActive)
    }
  }, [service])

  const handleSave = async () => {
    const payload: {
      id: number
      percentage?: string
      isActive?: boolean
    } = { id: serviceId }

    if (percentage !== service?.discount_percentage) {
      payload.percentage = percentage
    }

    if (isActive !== service?.isActive) {
      payload.isActive = isActive
    }

    // Only send request if there are changes
    if (Object.keys(payload).length > 1) {
      try {
        await updateServiceMutation.mutateAsync(payload)
        toast.success("Service updated successfully")
        onClose()
      } catch (error) {
        console.error("Failed to update service:", error)
      }
    } else {
      onClose()
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>Customization</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading service...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{"Error: " + error.message}</p>
          </div>
        ) : service ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service</Label>
              <Input
                id="name"
                value={service.name}
                disabled
                className="opacity-70"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="percentage">Discount Percentage</Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Enter discount percentage"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <Button
              onClick={handleSave}
              disabled={updateServiceMutation.isPending}
              className="mt-4"
            >
              {updateServiceMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export default ServiceEditSheet