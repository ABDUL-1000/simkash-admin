"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0); // 0 for right, 1 for left

  const testimonials = [
    {
      quote:
        "Simkash helped me build a stream of income as a state coordinator. I manage partners easily and monitor everything from my dashboard.",
      name: "Bukhari M.",
      role: "State Coordinator, Kano",
      avatar: "👩‍💼",
    },
    {
      quote:
        "As a partner, Simkash has transformed how I serve my community. The commission structure is fair and the platform is incredibly easy to use.",
      name: "Faruq H.",
      role: "Partner, Lagos",
      avatar: "👨‍💼",
    },
    {
      quote:
        "The digital wallet feature has made managing my finances so much easier. I can pay bills, buy data, and track everything in one place.",
      name: "Abdull A.",
      role: "Small Business Owner",
      avatar: "👩‍💻",
    },
  ];

  const nextTestimonial = () => {
    setDirection(0); // right direction
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(1); // left direction
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction === 0 ? 100 : -100,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction === 0 ? -100 : 100,
        opacity: 0,
      };
    },
  };

  return (
    <section ref={ref} className="py-20 w-[80%] mx-auto lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-[20px] lg:text-[40px] text-center mb-6">
            Real people. Real results. Hear from the people who are powering their digital lives with Simkash.
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Left Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevTestimonial}
            className="absolute  hidden left-0 top-1/2 -translate-y-1/3 -translate-x-20 w-12 h-12 bg-[#F8F9FA] rounded-full p-2 lg:flex items-center justify-center hover:shadow-xl transition-shadow z-10"
          >
 <Image src="/testimonialArrow.png" alt="arrow" width={80} height={50} className="hidden lg:block"/>,         
  </motion.button>

          {/* Testimonial Card */}
          <div className="bg-[#F8F9FA] rounded-lg   p-4 lg:p-4 relative shadow-lg">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentTestimonial}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex flex-col lg:flex-col-reverse items-center justify-center gap-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 justify-center">
                  <div className="w-10 h-10 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-sm lg:text-sm shadow-lg">
                    {testimonials[currentTestimonial].avatar}
                    
                  </div>
                    <div>
                    <p className="font-bold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</p>
                    <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  </div>
                </motion.div>

                <div className="flex-1 text-center lg:text-center">
                  <blockquote className="text-sm lg:text-xl text-gray-700 mb-1 leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>

                
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex items-center justify-center mt-8">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => {
                    setDirection(index > currentTestimonial ? 0 : 1);
                    setCurrentTestimonial(index);
                  }}
                  className={`w-3 h-3 mx-1 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextTestimonial}
            className="absolute hidden right-0 top-1/2 -translate-y-1/2 translate-x-20 w-12 h-12 bg-[#F8F9FA] rounded-full p-2 lg:flex items-center justify-center hover:shadow-xl transition-shadow z-10"
          >
           <Image src="/testimonialArrowRight.png" alt="arrow" width={80} height={50} className="hidden lg:block"/>,
          </motion.button>
        </div>
      </div>
    </section>
  );
}