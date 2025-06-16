import VerifyOTPPage from "@/components/signUpVerifyotp";
import { Suspense } from "react";



export default function Page() {
  return <Suspense> <VerifyOTPPage/> </Suspense>;
}