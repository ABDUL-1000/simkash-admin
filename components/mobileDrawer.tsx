"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { X } from "lucide-react"

interface ResponsiveModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  preventOutsideClick?: boolean
  className?: string
}

export function ResponsiveModal({
  children,
  isOpen,
  onClose,
  title,
  description,
  preventOutsideClick = true,
  className,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleInteractOutside = (e: Event) => {
    if (preventOutsideClick) {
      e.preventDefault()
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !preventOutsideClick) {
      onClose()
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn("sm:max-w-[425px]", className)}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={preventOutsideClick ? (e) => e.preventDefault() : undefined}
        >
          {/* Custom close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent
        onInteractOutside={handleInteractOutside}
        onEscapeKeyDown={preventOutsideClick ? (e) => e.preventDefault() : undefined}
        className="max-h-[90vh] flex flex-col"
      >
        {/* Custom close button for drawer */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {(title || description) && (
          <DrawerHeader className="text-left flex-shrink-0">
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className="px-4 pb-4 overflow-y-auto flex-1">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
