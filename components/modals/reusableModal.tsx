"use client"

import type React from "react"

import { useState, useEffect } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"
import { ResponsiveModal } from "../mobileDrawer"


interface FieldGroup {
  type: "group"
  layout: "horizontal" | "vertical"
  fields: {
    type: "input" | "select" | "select-button"
    label: string
    placeholder: string
    options?: { value: string; label: string }[]
    className?: string
    name?: string // Add name for better form handling
    value?: string // Add value for controlled inputs
    onChange?: (value: string) => void // Add custom onChange
  }[]
}

interface SingleField {
  type: "input" | "select" | "select-button"
  label: string
  placeholder: string
  options?: { value: string; label: string }[]
  className?: string
  name?: string // Add name for better form handling
  value?: string // Add value for controlled inputs
  onChange?: (value: string) => void // Add custom onChange
}

type Field = SingleField | FieldGroup

interface ReusableModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subTitle?: string
  fields?: Field[] // Made optional for success modal and custom content
  onSubmit?: (data: Record<string, string>) => void // Made optional
  submitButton?: React.ReactNode
  submitButtonClassName?: string
  successMode?: boolean // New prop for success mode
  successIcon?: React.ReactNode // Custom icon
  successMessage?: string // Success message content
  successActions?: {
    // Actions/buttons for success mode
    label: string
    onClick: () => void
    variant?: "default" | "outline"
  }[]
  children?: React.ReactNode // Add children prop for custom content
  className?: string // Add className for modal
}

export function ReusableModal({
  isOpen,
  onClose,
  title,
  subTitle = "",
  fields = [],
  onSubmit = () => {},
  submitButton,
  submitButtonClassName = "",
  successMode = false,
  successIcon = <CheckCircle className="w-12 h-12 text-green-500" />,
  successMessage = "Operation completed successfully",
  successActions = [
    { label: "Go to Dashboard", onClick: onClose, variant: "default" as const },
    { label: "Add Another", onClick: onClose, variant: "outline" as const },
  ],
  children,
  className = "max-w-md",
}: ReusableModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})

  // Reset form data when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({})
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleFieldChange = (fieldName: string, value: string, customOnChange?: (value: string) => void) => {
    if (customOnChange) {
      customOnChange(value)
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }))
    }
  }

  const getFieldValue = (field: SingleField) => {
    const fieldName = field.name || field.label
    return field.value !== undefined ? field.value : formData[fieldName] || ""
  }

  const renderField = (field: SingleField, index?: number) => {
    const fieldName = field.name || field.label
    const fieldValue = getFieldValue(field)

    switch (field.type) {
      case "input":
        return (
          <Input
            key={`input-${fieldName}-${index}`}
            placeholder={field.placeholder}
            value={fieldValue}
            className={`border-[#E5E5E5] bg-white rounded-md py-1 px-3 w-full ${field.className || ""}`}
            onChange={(e) => handleFieldChange(fieldName, e.target.value, field.onChange)}
          />
        )
      case "select":
        return (
          <Select
            key={`select-${fieldName}-${index}`}
            value={fieldValue}
            onValueChange={(value) => handleFieldChange(fieldName, value, field.onChange)}
          >
            <SelectTrigger className={`border-[#E5E5E5] bg-white rounded-md py-1 px-3 w-full ${field.className || ""}`}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "select-button":
        return (
          <div key={`select-button-${fieldName}-${index}`} className="flex gap-1 flex-wrap">
            {field.options?.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={fieldValue === option.value ? "default" : "outline"}
                className={`transition-colors ${
                  fieldValue === option.value
                    ? "bg-[#132939] text-white"
                    : "border-[#E5E5E5] text-[#4D4D4D] hover:bg-gray-50"
                } ${field.className || ""}`}
                onClick={() => handleFieldChange(fieldName, option.value, field.onChange)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} title={title} subTitle={subTitle} className={className}>
      {successMode ? (
        <div className="flex flex-col items-center text-center space-y-6 p-4">
          {/* Success Icon */}
          <div className="p-4">{successIcon}</div>

          {/* Success Message */}
          {title && <h3 className="text-lg font-medium text-[#132939]">{title}</h3>}
          {subTitle && <h4 className="text-md font-medium text-[#132939]">{subTitle}</h4>}
          <p className="text-[#4D4D4D]">{successMessage}</p>

          {/* Success Actions */}
          <div className="flex flex-col w-full space-y-3 pt-4">
            {successActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant}
                className={`w-full ${
                  action.variant === "default"
                    ? "bg-[#132939] hover:bg-[#1a3a53] text-white"
                    : "border-[#E5E5E5] text-[#4D4D4D] hover:bg-gray-50"
                }`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Custom children content (for complex forms) */}
          {children ? (
            children
          ) : (
            /* Default form fields */
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  {field.type === "group" ? (
                    <div
                      className={`${field.layout === "horizontal" ? "lg:flex lg:flex-row lg:gap-4" : "flex flex-col gap-2"}`}
                    >
                      {field.fields.map((subField, subIndex) => (
                        <div
                          key={subIndex}
                          className={`${field.layout === "horizontal" ? "flex-1" : ""} ${subField.className || ""}`}
                        >
                          <Label className="block text-sm font-medium text-[#4D4D4D] mb-1">{subField.label}</Label>
                          {renderField(subField, subIndex)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <Label className="block text-sm font-medium text-[#4D4D4D]">{field.label}</Label>
                      {renderField(field, index)}
                    </>
                  )}
                </div>
              ))}

              {/* Footer buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                {submitButton ? (
                  submitButton
                ) : (
                  <Button
                    type="submit"
                    className={`bg-[#D7EFF6] text-[#60B3D1] hover:bg-[#255C79] hover:text-[#FFFFFF] w-full ${submitButtonClassName}`}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          )}
        </>
      )}
    </ResponsiveModal>
  )
}
