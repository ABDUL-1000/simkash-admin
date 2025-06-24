
import { AirtimeRequest, CableBillRequest, DataPlansResponse, DataRequest, ElectricBillRequest } from "../type"
import { BASE_URL } from "@/constants/api"

interface SignupRequest {
  email: string
  password: string
  confirm_password: string
}
interface AirtimeVerify {
  phone: string
}

interface LoginRequest {
  email: string
  password: string
}
 interface VerifyMeterRequest {
  serviceID: string;
  billersCode: string;
  type: string;
}
 interface VerifyAccountRequest {
  account_number: string;
  bank_code: string;
}
 interface VerifyCableNumber {
 serviceID: string;
  billersCode: string;
}

interface ProfileUpdateRequest {
  fullname: string
  phone: string
  gender: string
  country: string
  pin: number // Include pin in the profile update
}

 interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  responseBody?: any
  responseMessage?: string
  
}


interface VerifypaymentRequest {
 
  reference: string
}
interface VerifyOTPRequest {
  email: string
  otp: string
}

interface ResendOTPRequest {
  email: string
}

interface ForgotPasswordRequest {
  email: string
}

interface CreateNewPasswordRequest {
  new_password: string
  confirm_password: string
}
interface TransferRequest  {
  amount: number;
  account_number: string;
  bank_code: string;
  pin:  number;
  narration?: string;
  message?: string
  responseBody?: any
  responseMessage?: string
}

export class AuthAPI {
  private static baseUrl = BASE_URL

  // Cookie management methods
  static setCookie(name: string, value: string, days = 7) {
    try {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

      const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;${!isLocalhost ? "secure;" : ""}samesite=strict`
      document.cookie = cookieString

      console.log(`Cookie set: ${name}`, value.substring(0, 20) + "...")
    } catch (error) {
      console.error("Error setting cookie:", error)
    }
  }

  static getCookie(name: string): string | null {
    try {
      if (typeof document === "undefined") return null

      const nameEQ = name + "="
      const ca = document.cookie.split(";")
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === " ") c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) {
          const value = c.substring(nameEQ.length, c.length)
          console.log(`Cookie retrieved: ${name}`, value.substring(0, 20) + "...")
          return value
        }
      }
      console.log(`Cookie not found: ${name}`)
      return null
    } catch (error) {
      console.error("Error getting cookie:", error)
      return null
    }
  }

  static deleteCookie(name: string) {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
      console.log(`Cookie deleted: ${name}`)
    } catch (error) {
      console.error("Error deleting cookie:", error)
    }
  }

  static getAccessToken(): string | null {
    return this.getCookie("access_token")
  }

  static setAccessToken(token: string) {
    this.setCookie("access_token", token, 7)
  }

  static clearAccessToken() {
    this.deleteCookie("access_token")
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  static async sendOTP(data: SignupRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || result.message || "Network error occurred")
      }

      if (!result.responseSuccessful) {
        return {
          success: false,
          message: result.responseMessage || "Failed to send OTP",
        }
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "OTP sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  static async verifyforgetPasswordOTP(data: VerifyOTPRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/user/verify-forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || result.message || "Network error occurred")
      }

      if (!result.responseSuccessful) {
        return {
          success: false,
          message: result.responseMessage || "OTP verification failed",
        }
      }

      if (result.responseBody && result.responseBody.accessToken) {
        const { accessToken } = result.responseBody
        this.setAccessToken(accessToken)
        console.log("Access token saved after OTP verification")
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "OTP verified successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  static async verifyPayment(refrence:VerifypaymentRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${this.getAccessToken()}`,   
        },
        body: JSON.stringify(refrence),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || result.message || "Network error occurred")
      }

      if (!result.responseSuccessful) {
        return {
          success: false,
          message: result.responseMessage ,
        }
      }

      if (result.responseBody && result.responseBody.accessToken) {
        const { accessToken } = result.responseBody
        this.setAccessToken(accessToken)
       
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "OTP verified successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
  static async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || result.message || "Network error occurred")
      }

      if (!result.responseSuccessful) {
        return {
          success: false,
          message: result.responseMessage || "OTP verification failed",
        }
      }

      if (result.responseBody && result.responseBody.accessToken) {
        const { accessToken } = result.responseBody
        this.setAccessToken(accessToken)
        console.log("Access token saved after OTP verification")
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "OTP verified successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  static async resendOTP(data: ResendOTPRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || result.message || "Failed to resend OTP")
      }

      return {
        success: result.responseSuccessful || true,
        data: result.responseBody || result,
        message: result.responseMessage || result.message || "OTP resent successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  static async login(data: LoginRequest): Promise<ApiResponse> {
    try {
      console.log("Attempting login...")
      const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("Login response:", result)

      if (!response.ok) {
      
        throw new Error(result.responseMessage || result.message || "Network error occurred")
        
      }

      if (!result.responseSuccessful) {
        return {
          
          success: false,
          message: result.responseMessage || "Login failed",
        }
      }

      if (result.responseBody && result.responseBody.accessToken) {
        const { accessToken } = result.responseBody

        // this.setAccessToken(accessToken)
        console.log("Access token saved successfully")

        setTimeout(() => {
          // const savedAccessToken = this.getAccessToken()
          // console.log("Verification - Access token saved:", !!savedAccessToken)
        }, 100)

        return {
          success: true,
          data: result.responseBody,
          message: result.responseMessage || "Login successful",
        }
      } else {
        console.error("No access token found in successful response")
        return {
          success: false,
          message: "Login response missing access token",
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      }
    }
  }

  static async updateProfile(data: ProfileUpdateRequest): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      console.log("Token available:", !!token)

      if (!token) {
        return {
          success: false,
          message: "Authentication token is required. Please log in again.",
        }
      }

      // Ensure all data is properly formatted and no undefined values
      const profileData = {
        fullname: String(data.fullname || "").trim(),
        phone: String(data.phone || "").replace(/\D/g, ""), // Remove non-digits
        gender: String(data.gender || "").toLowerCase(),
        country: String(data.country || ""),
        pin: Number(data.pin), // Send pin as number
      }

      // Validate required fields
      if (!profileData.fullname) {
        return {
          success: false,
          message: "Full name is required",
        }
      }

      if (!profileData.phone) {
        return {
          success: false,
          message: "Phone number is required",
        }
      }

      if (!profileData.gender) {
        return {
          success: false,
          message: "Gender is required",
        }
      }

      if (!profileData.country) {
        return {
          success: false,
          message: "Country is required",
        }
      }

      if (!profileData.pin || profileData.pin < 1000 || profileData.pin > 9999) {
        return {
          success: false,
          message: "PIN must be a 4-digit number",
        }
      }

      console.log("Sending profile data:", profileData)
      console.log("Request URL:", `${this.baseUrl}/api/v1/user/profile`)

      const response = await fetch(`${this.baseUrl}/api/v1/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      let result
      try {
        result = await response.json()
        console.log("Response body:", result)
      } catch (parseError) {
        console.error("Failed to parse response JSON:", parseError)
        const textResponse = await response.text()
        console.log("Raw response:", textResponse)

        return {
          success: false,
          message: `Server returned ${response.status}: ${response.statusText}. Raw response: ${textResponse}`,
        }
      }

      if (!response.ok) {
        if (response.status === 400) {
          return {
            success: false,
            message: result.responseMessage || result.message || "Invalid request data. Please check your input.",
          }
        } else if (response.status === 401) {
          this.clearAccessToken()
          return {
            success: false,
            message: "Session expired. Please log in again.",
          }
        } else if (response.status === 403) {
          return {
            success: false,
            message: "Access denied. You don't have permission to update this profile.",
          }
        } else {
          return {
            success: false,
            message: result.responseMessage || result.message || `Server error: ${response.status}`,
          }
        }
      }

      return {
        success: result.responseSuccessful !== false,
        data: result.responseBody || result,
        message: result.responseMessage || result.message || "Profile updated successfully",
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = this.getAccessToken()
      if (token) {
        await fetch(`${this.baseUrl}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {
          // Ignore logout endpoint errors
        })
      }
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      this.clearAccessToken()
      console.log("Access token cleared")

      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
  }

  

  static async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAccessToken()

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  static async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/user/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || result.message || "Network error occurred")
      }

      if (!result.responseSuccessful) {
        return {
          success: false,
          message: result.responseMessage || "Failed to send reset code",
        }
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "Reset code sent successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
  static async buyData(data: DataRequest): Promise<ApiResponse> {
    try {
      console.log("API received data:", data)

      // Validate input data
      if (!data.serviceID) {
        throw new Error("Service ID is required")
      }

      if (!data.billersCode) {
        throw new Error("Billers code is required")
      }

      if (!data.variation_code) {
        throw new Error("Variation code is required")
      }

      if (data.amount === null || data.amount === undefined || data.amount <= 0) {
        throw new Error("Amount must be a positive number")
      }

      if (!data.phone) {
        throw new Error("Phone number is required")
      }

      if (data.pin === null || data.pin === undefined) {
        throw new Error("PIN is required")
      }

      const pin = typeof data.pin === "string" ? Number.parseInt(data.pin) : data.pin
      if (isNaN(pin) || pin.toString().length !== 4) {
        throw new Error("PIN must be 4 digits")
      }

      const token = this.getAccessToken()
      if (!token) {
        return {
          success: false,
          responseMessage: "Authentication token is required",
        }
      }

      // Convert phone to number for the API
      const phoneNumber = typeof data.phone === "string" ? Number.parseInt(data.phone) : data.phone

      const payload = {
        serviceID: data.serviceID,
        billersCode: data.billersCode, // This will be the phone number as string
        variation_code: data.variation_code,
        amount: data.amount,
        phone: phoneNumber,
        pin: pin,
      }

      console.log("Sending payload:", payload)

      const response = await fetch(`${this.baseUrl}/api/v1/billpayment/data/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      console.log("API Response Status:", response.status)
      console.log("API Response Body:", result)

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = result.responseMessage || result.error || "Invalid request data"
          console.error("400 Bad Request Details:", result)
          throw new Error(errorMessage)
        }
        throw new Error(result.responseMessage || "Data purchase failed")
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "Data purchase successful",
      }
    } catch (error) {
      console.error("Data purchase error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Data purchase failed",
      }
    }
  }




static async payElectricBill(data: ElectricBillRequest): Promise<ApiResponse> {
  try {
    console.log("API received data:", data)

    // Validation - check for required fields
    if (!data.amount || typeof data.amount !== 'string') {
      throw new Error("Amount is required and must be a string")
    }
    
    if (!data.billersCode) {
      throw new Error("Meter number is required")
    }
    
    if (!data.variation_code) {
      throw new Error("Meter type is required")
    }
    
    if (!data.serviceID) {
      throw new Error("Service provider is required")
    }
    
    if (!data.phone) {
      throw new Error("Phone number is required")
    }
    
    if (data.pin === null || data.pin === undefined) {
      throw new Error("PIN is required")
    }

    // Convert pin to number if it's a string
    const pin = typeof data.pin === "string" ? Number.parseInt(data.pin) : data.pin
    if (isNaN(pin) || pin.toString().length !== 4) {
      throw new Error("PIN must be 4 digits")
    }

    const token = this.getAccessToken()
    if (!token) {
      return {
        success: false,
        responseMessage: "Authentication token is required",
      }
    }

    // Prepare payload with correct field names and types
    const payload = {
      serviceID: data.serviceID,
      billersCode: data.billersCode,
      variation_code: data.variation_code,
      amount: data.amount, // Already a string
      phone: data.phone,
      pin: pin
    }

    console.log("Sending payload:", payload)

    const response = await fetch(`${this.baseUrl}/api/v1/billpayment/electricity/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      if (response.status === 400) {
        const errorMessage = result.responseMessage || result.error || "Invalid request data"
        console.error("400 Bad Request Details:", result)
        throw new Error(errorMessage)
      }
      throw new Error(result.responseMessage || "Payment failed")
    }

    return {
      success: true,
      data: result.responseBody || result,
      message: result.responseMessage || "Electric payment successful",
    }
  } catch (error) {
    console.error("Payment error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Electric payment failed",
    }
  }
}
static async payCableBill(data: CableBillRequest): Promise<ApiResponse> {
  try {
    console.log("API received data:", data)

    // Validation - check for required fields
    if (!data.amount || typeof data.amount !== 'string') {
      throw new Error("Amount is required and must be a string")
    }
    
    if (!data.billersCode) {
      throw new Error("Meter number is required")
    }
    
    if (!data.variation_code) {
      throw new Error("Meter type is required")
    }
    
    if (!data.serviceID) {
      throw new Error("Service provider is required")
    }
    
    if (!data.phone) {
      throw new Error("Phone number is required")
    }
    
    if (data.pin === null || data.pin === undefined) {
      throw new Error("PIN is required")
    }

    // Convert pin to number if it's a string
    const pin = typeof data.pin === "string" ? Number.parseInt(data.pin) : data.pin
    if (isNaN(pin) || pin.toString().length !== 4) {
      throw new Error("PIN must be 4 digits")
    }

    const token = this.getAccessToken()
    if (!token) {
      return {
        success: false,
        responseMessage: "Authentication token is required",
      }
    }

    // Prepare payload with correct field names and types
    const payload = {
      serviceID: data.serviceID,
      billersCode: data.billersCode,
      variation_code: data.variation_code,
      amount: data.amount, // Already a string
      phone: data.phone,
      pin: pin
    }

    console.log("Sending payload:", payload)

    const response = await fetch(`${this.baseUrl}/api/v1/billpayment/cable/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      if (response.status === 400) {
        const errorMessage = result.responseMessage || result.error || "Invalid request data"
        console.error("400 Bad Request Details:", result)
        throw new Error(errorMessage)
      }
      throw new Error(result.responseMessage || "Payment failed")
    }

    return {
      success: true,
      data: result.responseBody || result,
      message: result.responseMessage || "Electric payment successful",
    }
  } catch (error) {
    console.error("Payment error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Electric payment failed",
    }
  }
}
static async buyAirtime(data: AirtimeRequest): Promise<ApiResponse> {
    try {
      console.log("API received data:", data)

      // 1. Validate input data before sending
      if (data.amount === null || data.amount === undefined) {
        throw new Error("Amount is required")
      }

      // Convert to number if it's a string
      const amount = typeof data.amount === "string" ? Number.parseFloat(data.amount) : data.amount

      if (isNaN(amount)) {
        throw new Error("Amount must be a valid number")
      }

      if (amount <= 0) {
        throw new Error("Amount must be positive")
      }

      // Additional validation for required fields
      if (!data.phone
      ) {
        throw new Error("Account number is required")
      }
      if (!data.network) {
        throw new Error("Bank code is required")
      }
      if (data.pin === null || data.pin === undefined) {
        throw new Error("PIN is required")
      }

      const pin = typeof data.pin === "string" ? Number.parseInt(data.pin) : data.pin
      if (isNaN(pin) || pin.toString().length !== 4) {
        throw new Error("PIN must be 4 digits")
      }

     
      const token = this.getAccessToken()
      if (!token) {
        return {
          success: false,
          responseMessage: "Authentication token is required",
        }
      }

      
      const payload = {
        amount: amount,
        phone: data.phone,
       network: data.network,
        pin: pin,
      }

      console.log("Sending payload:", payload)

      const response = await fetch(`${this.baseUrl}/api/v1/billpayment/airtime/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      console.log("API Response Status:", response.status)
      console.log("API Response Body:", result)
  

      if (!response.ok) {
       

        if (response.status === 400) {
          const errorMessage = result.responseMessage || result.error || "Invalid request data"
          console.error("400 Bad Request Details:", result)
          throw new Error(errorMessage)
        }

        throw new Error(result.responseMessage || "Payment failed")
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "Airtime purchase successful",
      }
    } catch (error) {
      console.error("Payment error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Airtime purchase failed",
      }
    }
  }
static async sendMoney(data: TransferRequest): Promise<ApiResponse> {
    try {
      console.log("API received data:", data)

      // 1. Validate input data before sending
      if (data.amount === null || data.amount === undefined) {
        throw new Error("Amount is required")
      }

      // Convert to number if it's a string
      const amount = typeof data.amount === "string" ? Number.parseFloat(data.amount) : data.amount

      if (isNaN(amount)) {
        throw new Error("Amount must be a valid number")
      }

      if (amount <= 0) {
        throw new Error("Amount must be positive")
      }

      // Additional validation for required fields
      if (!data.account_number) {
        throw new Error("Account number is required")
      }
      if (!data.bank_code) {
        throw new Error("Bank code is required")
      }
      if (data.pin === null || data.pin === undefined) {
        throw new Error("PIN is required")
      }

      // Convert PIN to number and validate
      const pin = typeof data.pin === "string" ? Number.parseInt(data.pin) : data.pin
      if (isNaN(pin) || pin.toString().length !== 4) {
        throw new Error("PIN must be 4 digits")
      }

      // 2. Get and verify token
      const token = this.getAccessToken()
      if (!token) {
        return {
          success: false,
          responseMessage: "Authentication token is required",
        }
      }

      // 3. Prepare the payload with type safety
      const payload = {
        amount: amount,
        account_number: data.account_number,
        bank_code: data.bank_code,
        pin: pin, // Send as number
        ...(data.narration && { narration: data.narration }),
      }

      console.log("Sending payload:", payload)

      // 4. Make the API call
      const response = await fetch(`${this.baseUrl}/api/v1/payment/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      // 5. Handle response
      const result = await response.json()

      console.log("API Response Status:", response.status)
      console.log("API Response Body:", result)

      if (!response.ok) {
       

        // For 400 errors, provide more specific error information
        if (response.status === 400) {
          const errorMessage = result.responseMessage || result.error || "Invalid request data"
          console.error("400 Bad Request Details:", result)
          throw new Error(errorMessage)
        }

        throw new Error(result.responseMessage || "Payment failed")
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "Payment successful",
      }
    } catch (error) {
      console.error("Payment error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Payment failed",
      }
    }
  }
  static async initiatePayment(amount: number): Promise<ApiResponse> {
  try {
    const token = this.getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication token is required. Please log in again.",
      };
    }

    console.log("Initiating payment...");
    
    const response = await fetch(`${this.baseUrl}/api/v1/payment/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    const result = await response.json();
    console.log("Payment response:", result);

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAccessToken();
        return {
          success: false,
          message: "Session expired. Please log in again.",
        };
      }
      throw new Error(result.responseMessage || result.message || "Failed to initiate payment");
    }

    if (!result.responseSuccessful) {
      return {
        success: false,
        message: result.responseMessage || "Failed to initiate payment",
      };
    }

    return {
      success: true,
      data: result.responseBody || result,
      message: result.responseMessage || "Payment initiated successfully",
    };
  } catch (error) {
    console.error("Payment initiation error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

  static async createNewPassword(data: CreateNewPasswordRequest): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/api/v1/user/create-new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || result.message || "Failed to create new password")
      }

      if (!result.responseSuccessful) {
        return {
          success: false,
          message: result.responseMessage || "Failed to create new password",
        }
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "Password updated successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }

  static async testConnection(): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      const response = await fetch(`${this.baseUrl}/api/v1/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      const result = await response.json()

      return {
        success: response.ok,
        data: result,
        message: response.ok ? "Connection successful" : "Connection failed",
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
    static async getDataPlans(serviceID: string): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required",
        }
      }

      const response = await fetch(`${this.baseUrl}/api/v1/billpayment/data/plans?serviceID=${serviceID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result: DataPlansResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || "Failed to fetch data plans")
      }

      return {
        success: true,
        data: result,
        message: result.responseMessage || "Data plans fetched successfully",
      }
    } catch (error) {
      console.error("Data plans fetch error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch data plans",
      }
    }
  }

  static async getCableService(): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required",
        }
      }

      const response = await fetch(`${this.baseUrl}/api/v1/billpayment/cable/service`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result: DataPlansResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || "Failed to fetch data plans")
      }

      return {
        success: true,
        data: result,
        message: result.responseMessage || "Data plans fetched successfully",
      }
    } catch (error) {
      console.error("Data plans fetch error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch data plans",
      }
    }
  }
  static async getCableVariation(serviceID: string): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required",
        }
      }

      const response = await fetch(`${this.baseUrl}/api/v1/billpayment/cable/variation?serviceID=${serviceID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result: DataPlansResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.responseMessage || "Failed to fetch data plans")
      }

      return {
        success: true,
        data: result,
        message: result.responseMessage || "Data plans fetched successfully",
      }
    } catch (error) {
      console.error("Data plans fetch error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch data plans",
      }
    }
  }

  static async getNetworkList(): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required. Please log in again.",
        }
      }

      console.log("Fetching dashboard data...")
      
      const response = await fetch(`${this.baseUrl}/api/v1/billpayment/airtime/network`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      console.log("Dashboard response:", result)
      

      if (!response.ok) {
     
        throw new Error(result.responseMessage || result.message || "Failed to fetch banks list")
      }

     

      return {
        success: true,
        data: result.responseBody || result,
        
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
  static async getElectricBillers(): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required. Please log in again.",
        }
      }

      console.log("Fetching dashboard data...")
      
      const response = await fetch(`${this.baseUrl}/api/v1/billpayment/electricity/service`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      console.log("Dashboard response:", result)
      

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAccessToken()
          return {
            success: false,
            message: "Session expired. Please log in again.",
          }
        }
        throw new Error(result.responseMessage || result.message || "Failed to fetch banks list")
      }

     

      return {
        success: true,
        data: result.responseBody || result,
        
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
  static async getBanksList(): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required. Please log in again.",
        }
      }

      console.log("Fetching dashboard data...")
      
      const response = await fetch(`${this.baseUrl}/api/v1/payment/banks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      console.log("Dashboard response:", result)
      

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAccessToken()
          return {
            success: false,
            message: "Session expired. Please log in again.",
          }
        }
        throw new Error(result.responseMessage || result.message || "Failed to fetch banks list")
      }

     

      return {
        success: true,
        data: result.responseBody || result,
        
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
  static async getDashboardData(): Promise<ApiResponse> {
    try {
      const token = this.getAccessToken()
      
      if (!token) {
        return {
          success: false,
          message: "Authentication token is required. Please log in again.",
        }
      }

      console.log("Fetching dashboard data...")
      
      const response = await fetch(`${this.baseUrl}/api/v1/user/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()
      console.log("Dashboard response:", result)
      console.log("Dashboard user details:", result.responseBody.wallet.balance)
      

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAccessToken()
          return {
            success: false,
            message: "Session expired. Please log in again.",
          }
        }
        throw new Error(result.responseMessage || result.message || "Failed to fetch dashboard data")
      }

      if (!result.responseSuccessful) {
        return {
          success: false,
          message: result.responseMessage || "Failed to fetch dashboard data",
        }
      }

      return {
        success: true,
        data: result.responseBody || result,
        message: result.responseMessage || "Dashboard data fetched successfully",
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
      }
    }
  }
 

static async verifyCableNumber(data: VerifyCableNumber): Promise<ApiResponse> {
  try {
    const token = this.getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication token is required",
      };
    }

    const response = await fetch(`${this.baseUrl}/api/v1/billpayment/cable/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAccessToken();
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
      }
      throw new Error(result.responseMessage || result.message || "Account verification failed");
    }

    return {
      success: result.responseSuccessful !== false,
      data: result.responseBody || result,
      message: result.responseMessage || "Account verified successfully",
    };
  } catch (error) {
    console.error("Account verification error:", error);
    console.log("Error response:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
static async verifyAccount(data: VerifyAccountRequest): Promise<ApiResponse> {
  try {
    const token = this.getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication token is required",
      };
    }

    const response = await fetch(`${this.baseUrl}/api/v1/payment/verify-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAccessToken();
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
      }
      throw new Error(result.responseMessage || result.message || "Account verification failed");
    }

    return {
      success: result.responseSuccessful !== false,
      data: result.responseBody || result,
      message: result.responseMessage || "Account verified successfully",
    };
  } catch (error) {
    console.error("Account verification error:", error);
    console.log("Error response:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
static async verifyMeterNumber(data: VerifyMeterRequest): Promise<ApiResponse> {
  try {
    const token = this.getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication token is required",
      };
    }

    const response = await fetch(`${this.baseUrl}/api/v1/billpayment/electricity/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
 
      throw new Error(result.responseMessage || result.message || "Account verification failed");
    }

    return {
      success: result.responseSuccessful !== false,
      data: result.responseBody || result,
      message: result.responseMessage || "Account verified successfully",
    };
  } catch (error) {
    console.error("Account verification error:", error);
    console.log("Error response:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}
static async verifyAirtimeNumber(phoneNumer: AirtimeVerify): Promise<ApiResponse> {
  try {
    const token = this.getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Authentication token is required",
      };
    }

    const response = await fetch(`${this.baseUrl}/api/v1/billpayment/airtime/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(phoneNumer), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Verification failed");
    }

    const result = await response.json();
    return {
      success: true,
      data: result,
      message: result.message || "Verification successful",
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error occurred",
    };
  }
} 
}
