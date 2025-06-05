"use client"

export const UserService = {
  isFirstTimeUser: (): boolean => {
    if (typeof window === "undefined") return false

    // Check if coming from profile setup
    const showOnboarding = localStorage.getItem("showOnboarding")
    return showOnboarding === "true"
  },

  clearOnboardingFlag: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("showOnboarding")
    }
  },

  getUserInfo: async () => {
    if (typeof window === "undefined") return { name: "User", email: "user@example.com" }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would fetch from your API
      // const response = await AuthAPI.getUserProfile()
      // return response.data

      // For now, return mock data
      return {
        name: "Yusuf Adam Baba",
        email: "yusufababa50@gmail.com",
        balance: "₦50,000.00",
        phone: "+234 801 234 5678",
        country: "Nigeria",
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      return {
        name: "User",
        email: "user@example.com",
        balance: "₦0.00",
      }
    }
  },

  getGreeting: (): string => {
    const currentTime = new Date()
    const hours = currentTime.getHours()

    if (hours < 12) {
      return "Good Morning"
    } else if (hours < 17) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  },
}
