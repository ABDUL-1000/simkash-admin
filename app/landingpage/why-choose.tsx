"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { ReactNode, useRef } from "react"

interface FeatureCard {
  icon: ReactNode
  title: string
  description: string

}

export default function WhyChooseSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features: FeatureCard[] = [
    {
      icon: <Image src="/black-pos.png" alt="black-pos.png" width={80} height={50}  />,
      title: "Device SIM Subscription",
      description: "Get instant access to mobile data plans — tailored for various devices and POS systems."
     
    },
    {
      icon: <Image src="/blue-tick.png" alt="logo"width={80} height={50} />,
      title: "Wallet & Transactions",
      description:
        "Secure digital wallet for all your financial needs and easy real-time transaction tracking in one place.",
   
    },
    {
     icon: <Image src="/bignetworksign.png" alt="logo" width={80} height={50}  />,
      title: "Bill Payments",
      description:
        "Easily pay all your bills including electricity bills, cable TV, internet bills, and more with ease.",
   
    },
    {
     icon: <Image src="/call.png" alt="logo" width={80} height={50}  />,
      title: "Airtime & Data Top-Up",
      description: "Buy airtime or mobile data for yourself or others. Support for all major network providers.",
     
    },
    {
     icon: <Image src="/location.png" alt="logo" width={80} height={50} />,
      title: "eSIM Plans & Virtual Number",
      description:
        "Access global connectivity with our international eSIMs for seamless data connectivity anywhere in the world.",
     
    },
    {
    icon: <Image src="/kysc.png" alt="logo" width={80} height={50} />,
      title: "KYC & Support",
      description: "Protect your account with secure KYC steps, and Chat with Support 24/7 for assistance.",
  
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section ref={ref} className="py-10 lg:py-10 ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="lg:text-[50px] text-[30px] mb-[10px]">Why you should choose Simkash</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
           We’re constantly improving Simkash to give you more convenience, flexibility, and control over your digital life.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
             
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="bg-white rounded-2xl p-6 flex items-center gap-6  hover:shadow-sm transition-all duration-300 border border-gray-100"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={` rounded-full h-30 w-50 p-4 bg-[#F8F9FA] flex items-center justify-center`}
              >
                <span className="">{feature.icon}</span>
              </motion.div>

              <h3 className="text-[#000000] lg:text-[30px] flex flex-col text-[14px]  mb-4">{feature.title} <span className="text-[#565C69] lg:text-[18px]">{feature.description}</span></h3>

              <p className="text-gray-600 leading-relaxed"></p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
