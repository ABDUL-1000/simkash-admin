import VerifyOTPForgotPasswordPage from '@/components/forgetPasswordVerifyOtp'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
    <Suspense> <VerifyOTPForgotPasswordPage/></Suspense> 
    </div>
  )
}

export default page
