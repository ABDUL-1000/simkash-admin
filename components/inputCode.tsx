"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function ResetPassword() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(32)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    // Countdown timer
    if (countdown > 0 && isResendDisabled) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setIsResendDisabled(false)
    }
  }, [countdown, isResendDisabled])

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i]
      }
    }

    setCode(newCode)

    // Focus on the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleResendCode = () => {
    setCountdown(32)
    setIsResendDisabled(true)
    setCode(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
    // Here you would call your API to resend the code
    console.log("Resending code...")
  }

  const handleSendCode = () => {
    const fullCode = code.join("")
    if (fullCode.length === 6) {
      // Here you would verify the code with your API
      console.log("Verifying code:", fullCode)
      alert("Code verified! (This would normally call your API)")
    }
  }

  const isCodeComplete = code.every((digit) => digit !== "")

  return (
     <div className=" min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="hidden  w-1/2 md:flex relative flex-col items-center justify-center bg-white p-4">
        <div className="absolute top-4 left-10 text-sm text-black">
          <div className="flex items-center space-x-2">
            <div className=" flex items-center justify-center">
              <Image src="/simcard.png" alt="Logo" width={40} height={40} />
            </div>
            <span className="text-xl font-semibold text-slate-800">
              simkash
            </span>
          </div>
        </div>
        <div className="w-[60%] flex flex-col items-center text-center">
          <Image
            src="/sim.png"
            alt="Signup Illustration"
            width={400}
            height={400}
            className="w-4/6 h-4/6 pt-20 flex justify-center items-center"
          />
          <h2 className="mt-6 text-2xl font-semibold text-slate-800">
            Secure Your SIM. Own Your Data. Grow Your Wallet.
          </h2>
        </div>
      </div>

      {/* Right Side */}
      <div className="text-sm lg:hidden text-black">
      
      </div>
      <div className="w-full md:w-1/2 flex  flex-col relative bg-gray-100 p-6">
        {/* Top Right login link */}
        <div className="absolute top-4 hidden lg:block  right-10 text-sm text-black">
          <h1 className="right-10 text-sm text-black">
            {" "}
            Already have an account?{" "}
          </h1>
          <Link href="/login" className="">
            <span className="  hover:underline"> Create</span>
          </Link>
        </div>
        {/* mobile logo */}
        <div className="flex items-center justify-between ">
          <div className=" flex  lg:h-6 lg:w-6 items-center  gap-1">
            <Image src="/simcard.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-semibold text-slate-800">simkash</span>
          </div>
          
            <Link href="/login" className="">
              <span className="lg:hidden  hover:underline"> Create </span>
            </Link>
        
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full  max-w-md rounded-lg  bg-white p-6">
            <div className="text-center mb-8">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Reset your Password
              </h2>
            
              <div className="flex justify-center gap-3 mb-8">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
              inputRefs.current[index] = el
            }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-10 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:ring-cyan-400"
                  />
                ))}
              </div>

              {/* Resend Code */}
              <div className="mb-8">
                {isResendDisabled ? (
                  <p className="text-gray-500 text-start text-sm">Resend code in {countdown}s</p>
                ) : (
                  <button onClick={handleResendCode} className=" hover:underline text-sm">
                    Resend code
                  </button>
                )}
              </div>

              {/* Send Code Button */}
              <Button
                onClick={handleSendCode}
                disabled={!isCodeComplete}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Code
              </Button>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
