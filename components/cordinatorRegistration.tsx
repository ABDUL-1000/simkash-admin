"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { AuthAPI } from "@/lib/API/api"
import { RegistrationConfirmation } from "./reg-comfirmation"

const idTypes = ["National ID Card", "International Passport", "Driver's License", "Voter's Card", "NIN Slip"]

export function StateCoordinatorForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [uploadedFile, setUploadedFile] = useState<string>("")
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    country: "Nigeria",
    state: "",
    lga: "",
    address: "",
    reason: "",
    idCard: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy")
      handleInputChange("dob", formattedDate)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create a local URL for the file
      const fileUrl = URL.createObjectURL(file)
      setUploadedFile(file.name)

      // You can also convert to base64 if needed
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        // Use the base64 string as the URL or use the blob URL
        handleInputChange("idCard", base64String) // or use fileUrl for blob URL
      }
      reader.readAsDataURL(file)

      toast.success("File selected successfully")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const requiredFields = [
      "fullname",
      "email",
      "phone",
      "gender",
      "dob",
      "state",
      "lga",
      "address",
      "reason",
      "idCard",
    ]

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        return
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // Phone validation
    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    try {
      const result = await AuthAPI.registerCoordinator(formData)

      if (result.success) {
        toast.success(result.message || "Registration successful!")
        setIsSubmitted(true)
      } else {
        toast.error(result.message || "Registration failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return <RegistrationConfirmation/>
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Dark background with design */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#132939] relative overflow-hidden">
      <div className="text-[#FFFFFF] font-bold mb-2">simkash</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">
            
          </div>
        </div>
        {/* Decorative curved lines */}
       
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Simkash Partner / Coordinator Application Form</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={formData.fullname}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Choose category"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Country and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter your state"
                  required
                />
              </div>
            </div>

            {/* LGA and Home Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lga">LGA</Label>
                <Input
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => handleInputChange("lga", e.target.value)}
                  placeholder="Enter your LGA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Home Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your home address"
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Why do you want to become a Simkash Partner/Coordinator?</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="Tell us why you want to join..."
                rows={4}
                required
              />
            </div>

            {/* ID Type */}
            <div className="space-y-2">
              <Label>Select ID Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Which role are you applying for?" />
                </SelectTrigger>
                <SelectContent>
                  {idTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Government Issued ID (E.g NIN slip) *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile || "Upload any of your Gov't Issued ID"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Supported formats: .jpg, .png & PDF</p>
                </label>
                {uploadedFile && <p className="text-xs text-green-600 mt-2">Selected: {uploadedFile}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-[#D7EFF6]  text-[#60B3D1] py-3" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
