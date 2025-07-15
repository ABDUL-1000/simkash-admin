"use client"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { Label } from "@/components/ui/label"

interface PhoneInputComponentProps {
  value: string
  onChange: (value: string | undefined) => void
  error?: string
  disabled?: boolean
  placeholder?: string
}

export function PhoneInputComponent({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = "Enter phone number",
}: PhoneInputComponentProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry="NG" // Default to Nigeria
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`phone-input ${error ? "phone-input-error" : ""}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}

      <style jsx global>{`
        .phone-input {
          display: flex;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .phone-input-error {
          border-color: #ef4444;
        }
        
        .phone-input .PhoneInputCountry {
          padding: 0.5rem;
          background: white;
          border-right: 1px solid #d1d5db;
        }
        
        .phone-input .PhoneInputInput {
          flex: 1;
          padding: 0.5rem;
          border: none;
          outline: none;
          font-size: 0.875rem;
        }
        
        .phone-input .PhoneInputInput:focus {
          outline: 2px solid #06b6d4;
          outline-offset: -2px;
        }
        
        .phone-input:focus-within {
          border-color: #06b6d4;
          box-shadow: 0 0 0 1px #06b6d4;
        }
        
        .phone-input .PhoneInputCountrySelect {
          background: transparent;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
        }
        
        .phone-input .PhoneInputCountrySelect:focus {
          outline: none;
        }
        
        .phone-input .PhoneInputCountryIcon {
          width: 1.25rem;
          height: 1rem;
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  )
}
