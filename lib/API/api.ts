interface SignupRequest {
  email: string
  password: string
  confirm_password: string
}

interface LoginRequest {
  email: string
  password: string
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

export class AuthAPI {
  private static baseUrl = "https://simkashapi.onrender.com"

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

        this.setAccessToken(accessToken)
        console.log("Access token saved successfully")

        setTimeout(() => {
          const savedAccessToken = this.getAccessToken()
          console.log("Verification - Access token saved:", !!savedAccessToken)
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
}
