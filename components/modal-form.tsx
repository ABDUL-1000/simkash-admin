"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface Field {
  id: string
  label: string
  type?: "text" | "select" | "currency"
  options?: string[]
  placeholder?: string
  required?: boolean
}

interface ModalFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel: string
  fields: Field[]
  onSubmit: (data: Record<string, string>) => void
}

export function ModalForm({
  isOpen,
  onOpenChange,
  title,
  submitLabel,
  fields,
  onSubmit,
}: ModalFormProps) {
  const initialState = Object.fromEntries(fields.map((f) => [f.id, ""]))
  const [formData, setFormData] = useState(initialState)

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData(initialState)
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 overflow-y-auto">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>

              {field.type === "select" ? (
                <select
                  id={field.id}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full border rounded px-4 py-2"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "currency" ? (
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 px-2 py-1 text-sm text-gray-600 rounded">
                    NGN
                  </div>
                  <Input
                    id={field.id}
                    value={formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="pl-16"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              ) : (
                <Input
                  id={field.id}
                  type="text"
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}

          <Button type="submit" className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-full py-3">
            {submitLabel}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
