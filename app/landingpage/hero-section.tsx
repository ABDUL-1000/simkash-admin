"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"

export default function HeroSection() {
  const trustedLogos = [
 <Image src='/mtnlogo.png' alt="mtn image" width={80} height={80} />,
 <Image src='/airtellogo.png' alt="/airtellogo.png" width={80} height={80} />,
 <Image src='/dtsvlogo.png' alt="mtn image" width={80} height={80} />,
 <Image src='/cbn-logo.png' alt="mtn image" width={50} height={50} />,
    

 ]

  return (
    <section className="relative overflow-hidden  py-10 ">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2  gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 "
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:text-[50px] text-[40px] text-[#000000] font-semibold leading-tight"
            >
              Power Your Digital <br />Life with{" "}
              <span className="text-[#255C79] underline decoration-[#255C79] decoration-4">Simkash</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Activate SIMs, buy data, pay bills, and manage your digital wallet — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="bg-[#132939]  text-white px-8 py-2 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-sm text-[#565C69]">Trusted by Leading Brands & Partners</p>
              <div className="flex items-center space-x-6">
                {trustedLogos.map((logo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className=""
                  >
                    <span className="">{logo}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className=""
          >
            <div className="w-full max-w-md mx-auto">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className=""
              >
                <Image src="/thumb-sim.png" alt="hero image" width={500} height={500} />
              </motion.div>


       

        
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
