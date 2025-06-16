"use client";

import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";

import { Toaster } from "sonner";// import Header from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "TransportHub - Fleet Management",
//   description: "Manage your transport fleet efficiently",
//   generator: "v0.dev",
// };

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div>
          {children}
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}
