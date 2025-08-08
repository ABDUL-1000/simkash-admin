"use client";

import React from "react";
import { Toaster } from "sonner";
import { Sora } from "next/font/google";
import "@/app/globals.css";

// Initialize Sora font
const sora = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={sora.className}>
    
      <body >
       

        <div>
          {children}
          <Toaster position="top-right" />
        </div>
      
      </body>
    </html>
  );
}