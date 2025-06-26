"use client"

import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  const footerLinks = {
    "About Simkash": ["About Us"],
    Products: ["Digital Wallet", "Bill Payments", "Data Plans", "eSIM"],
    Support: ["Help Center", "Contact Us", "System Status", "Security"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <footer className=" text-[#012641] mt-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
               <Image src = "/simcard.png" alt="logo" width={20} height={30} className="h-8 w-12"/>
                <span className="text-[20px] lg:text-[30px]">simkash</span>
              </div>
              
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 b rounded-full flex items-center justify-center  transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={30} className="font-bold" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-[#000000] transition-colors"
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

   
      </div>
    </footer>
  )
}
