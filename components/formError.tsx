import type React from "react"

interface FormErrorProps {
  message?: any
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null

  return <p className="text-red-500 text-xs mt-1">{message}</p>
}
