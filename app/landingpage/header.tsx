"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = ["Products", "About", "Pricing", "Contact Us"]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
           <Image src="/simcard.png" alt="logo" width={20} height={30} className="h-5 w-8" />
            <span className="text-[35px] text-[#012641]">simkash</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href="#"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2 }}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                className="hidden md:inline-flex bg-[#132939]  text-[#FFFFFF]  rounded-full  hover:bg-gray-50"
              >
                <Link href="/login">
                <span className="text-[13px] px-6"> Sign In</span>
              </Link>
               
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-100"
          >
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <a key={item} href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
              <Button variant="outline" className="w-full bg-[#132939]  text-[#FFFFFF]  rounded-full  hover:bg-gray-50">
                Sign In
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}
