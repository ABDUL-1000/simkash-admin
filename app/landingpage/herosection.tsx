"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-10 lg:py-15 bg-[#132939] rounded-3xl relative overflow-hidden"
    >
      {/* Top left Ellipse */}
      <div className="absolute top-0 left-0 opacity-20">
        <Image
          src="/Ellipse3-big.png"
          alt="Top Right Ellipse"
          width={200}
          height={200}
          className="w-30 h-30"
        />
      </div>

      {/* Bottom Right Ellipse */}
      <div className="absolute bottom-0 right-0 opacity-20">
        <Image
          src="/Ellipse-4-right.png"
          alt="Bottom Right Ellipse"
          width={200}
          height={200}
          className="w-30 h-30"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-[30px] lg:text-[50px] text-white leading-tight">
              Ready to Power Your Digital Life?
            </h2>

            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Simkash is the all-in-one solution you've been waiting for. Whether you're a user, partner, or coordinator, it all starts here.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-[#EFF9FC] text-gray-900 px-8 py-4 text-lg rounded-full hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}