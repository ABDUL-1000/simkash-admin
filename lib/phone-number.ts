import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js"

export interface PhoneNumberData {
  countryCode: string
  nationalNumber: string
  formattedNumber: string
  isValid: boolean
}

/**
 * Parse and format phone number for backend submission
 * Removes leading zeros and formats properly
 */
export function parsePhoneForBackend(phoneNumber: string): PhoneNumberData | null {
  if (!phoneNumber) {
    return null
  }

  try {
    const parsed = parsePhoneNumber(phoneNumber)

    if (!parsed) {
      return null
    }

    // Use the safer approach with string methods
    const internationalFormat = parsed.formatInternational() // e.g., "+234 906 586 6898"
    const nationalFormat = parsed.formatNational() // e.g., "0906 586 6898"

    // Extract country code from international format
    const countryCodeMatch = internationalFormat.match(/^\+(\d+)/)
    const countryCode = countryCodeMatch ? `+${countryCodeMatch[1]}` : ""

    // Extract national number from national format, removing all non-digits
    let nationalNumber = nationalFormat.replace(/\D/g, "") // Remove spaces, dashes, etc.

    // Remove leading zero if present
    if (nationalNumber.startsWith("0")) {
      nationalNumber = nationalNumber.substring(1)
    }

    const formattedNumber = `${countryCode}${nationalNumber}`

    return {
      countryCode,
      nationalNumber,
      formattedNumber,
      isValid: isValidPhoneNumber(phoneNumber),
    }
  } catch (error) {
    console.error("Error parsing phone number:", error)
    return null
  }
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phoneNumber: string): string | null {
  if (!phoneNumber) {
    return "Phone number is required"
  }

  try {
    const isValid = isValidPhoneNumber(phoneNumber)

    if (!isValid) {
      return "Please enter a valid phone number"
    }

    const parsed = parsePhoneNumber(phoneNumber)
    if (!parsed) {
      return "Please enter a valid phone number"
    }

    return null
  } catch (error) {
    return "Please enter a valid phone number"
  }
}

/**
 * Format phone number for display
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  if (!phoneNumber) return ""

  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return parsed ? parsed.formatInternational() : phoneNumber
  } catch {
    return phoneNumber
  }
}

/**
 * Get country code from phone number
 */
export function getCountryCodeFromPhone(phoneNumber: string): string | null {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return parsed ? `+${parsed.countryCallingCode}` : null
  } catch {
    return null
  }
}

/**
 * Check if phone number is valid for a specific country
 */
export function isValidPhoneForCountry(phoneNumber: string, countryCode?: string): boolean {
  try {
    return isValidPhoneNumber(phoneNumber, countryCode as any)
  } catch {
    return false
  }
}
