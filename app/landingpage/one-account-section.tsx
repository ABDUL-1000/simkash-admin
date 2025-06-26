"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

export default function OneAccountSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-10 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-[40px] font-semibold text-[#000000] leading-tight">
                One Account. Endless Possibilities.
              </h2>

              <p className="text-xl text-[#565C69] leading-relaxed">
                Simplify your digital life with Simkash — from managing SIMs to staying connected, paying bills, and
                transacting seamlessly. Everything you need in one place.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Button
                size="lg"
                className="bg-[#132939]  text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create My Simkash
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className=""
          >
            <div className="">
              {/* Main Phone Mockup */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className=""
              >

              <Image src="/Frame 1000007882.png" alt="phone" width={300} height={300} className="w-full" />
              </motion.div>

        

            
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
