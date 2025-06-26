"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function JoinMissionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const roles = [
    {
      title: "Partner",
      description:
        "Whether you're a tech-savvy entrepreneur or a regional distributor, Simkash gives you the tools to empower users and earn while doing it.",
      features: [
        "Distribute Device SIMs for users in your local area",
        "Earn commissions on each Sale",
        "Access your own Partner Dashboard",
      ],
      buttonText: "Apply as Partner",
      gradient: "bg-[#005A92]",
      image: (
        <Image
          src="/partnerImage.png"
          alt="partner"
          width={400}
          height={400}
          className="hidden lg:block"
        />
      ),
      ellipse: (
        <Image
          src="/Ellipse 3.png"
          alt="ellipse"
          width={50}
          height={50}
          className="absolute bottom-0 left-0 opacity-70"
        />
      ),
      layout: "default" 
    },
    {
      title: "State Coordinator",
      description: "Manage inventory and oversee partners in your state.",
      features: [
        "Manage inventory and oversee partners in your state",
        "Receive bulk SIM orders",
        "Become SIM and POS Regional Manager",
        "Earn commissions on each Sale",
      ],
      buttonText: "Apply as Coordinator",
      gradient: "bg-[#132939]",
      image: (
        <Image
          src="/cordinatorImage.png"
          alt="cordinatorImage.png"
          width={400}
          height={400}
          className="hidden lg:block"
        />
      ),
      ellipse: (
        <Image
          src="/Ellipse-3-right.png"
          alt="ellipse"
          width={80}
          height={80}
          className="absolute bottom-0 right-0 opacity-70"
        />
      ),
      layout: "reversed" // Added layout type
    },
  ];

  return (
    <section ref={ref} className="">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center "
        >
          <h2 className="text-[30px] lg:text-[40px]  mb-4">
            Join our mission to connect the World
          </h2>
          <p className="text-[16px] lg:text-[20px] mb-4 text-gray-600 max-w-3xl mx-auto">
            Whether you're a tech-savvy entrepreneur or a regional distributor,
            Simkash gives you the tools to empower users and earn while doing
            it.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`bg-gradient-to-br ${role.gradient} rounded-3xl p-8 text-white relative overflow-hidden`}
            >
              
              <div className=" inset-0 "></div>

            
              {role.ellipse}

              <div className="">
                <div className={`flex items-center justify-between mb-1 ${role.layout === "reversed" ? "flex-row-reverse" : ""}`}>
                  <div className="pl-6">
                    <ul className="space-y-5 mb-8">
                      <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                        {role.title}
                      </h3>
                      {role.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            isInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -20 }
                          }
                          transition={{ delay: 0.5 + featureIndex * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <span className="opacity-90 flex items-center text-[16px]">
                            <span>
                              <CheckCircle className="inline-block mr-2 w-3 h-3" />
                            </span>
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="secondary"
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold shadow-lg"
                        >
                          {role.buttonText}
                        </Button>
                      </motion.div>
                    </ul>
                  </div>
                  <div className="">{role.image}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}