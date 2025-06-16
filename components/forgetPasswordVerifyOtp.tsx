"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AuthAPI } from "@/lib/API/api";

interface FormErrors {
  otp?: string;
  general?: string;
}

export default function VerifyOTPForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/forgetpassword");
    }
  }, [email, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: undefined }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const validateOtp = (): boolean => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return false;
    }

    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ otp: "OTP must contain only numbers" });
      return false;
    }

    return true;
  };

  const handleVerifyOTP = async () => {
    if (!validateOtp()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await AuthAPI.verifyforgetPasswordOTP({
        email,
        otp: otp.join(""),
      });

      if (response.success) {
        const destination = `/newpassword?email=${encodeURIComponent(email)}`;
        setSuccessMessage(`OTP verified successfully! Redirecting...`);

        // Redirect to new password page
        setTimeout(() => {
          router.push(destination);
        }, 1500);
      } else {
        setErrors({
          general: response.message || "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      setErrors((errors) => ({
        ...errors,
        general: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await AuthAPI.forgotPassword({
        email,
      });

      if (response.success) {
        setSuccessMessage("New OTP sent successfully!");
        setCountdown(300); // Reset to 5 minutes
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]); // Clear OTP fields
        // Focus first input after resend
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      } else {
        setErrors({ general: response.message || "Failed to resend OTP" });
      }
    } catch (error) {
      setErrors((errors) => ({
        ...errors,
        general: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="hidden w-1/2 md:flex relative flex-col items-center justify-center bg-white p-4">
        <div className="absolute top-4 left-10 text-sm text-black">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center">
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
            alt="OTP Verification Illustration"
            width={400}
            height={400}
            className="w-4/6 h-4/6 pt-20 flex justify-center items-center"
          />
          <h2 className="mt-6 text-2xl font-semibold text-slate-800">
            Reset Your Password
          </h2>
          <p className="mt-2 text-gray-600">
            Enter the verification code to reset your password
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col relative bg-gray-100 p-6">
        {/* Top Right back link */}
        <div className="absolute top-4 hidden lg:block right-10 text-sm text-black">
          <Link
            href="/forgetpassword"
            className="flex items-center gap-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        {/* Mobile header */}
        <div className="flex items-center lg:hidden justify-between">
          <div className="flex lg:h-6 lg:w-6 items-center gap-1">
            <Image src="/simcard.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-semibold text-slate-800">
              simkash
            </span>
          </div>
          <Link
            href="/forgetpassword"
            className="flex items-center gap-1 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Verify Your Identity
              </h2>
              <p className="text-gray-600 text-sm">
                We've sent a 6-digit verification code to
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-slate-800">
                  <Suspense>{email}</Suspense>
                </span>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Timeout Warning */}
            {countdown === 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  OTP has expired. Please request a new one.
                </p>
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Enter 6-digit code
                </Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                        errors.otp ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1 text-center">
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="button"
                onClick={handleVerifyOTP}
                className="w-full h-10 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg"
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                {canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    className="text-slate-800 hover:text-slate-900 font-medium"
                    disabled={isResending}
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend in {Math.floor(countdown / 60)}:
                    {(countdown % 60).toString().padStart(2, "0")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
