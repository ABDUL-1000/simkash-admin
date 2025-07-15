"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDashboardStore } from "@/app/store/zustandstore/useStore";
import { NotificationsModal } from "../modals/notificationModal";

interface NavbarProps {
  username?: string;
  email?: string;
}

export function Navbar({ username, email }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const userProfile = useDashboardStore((state) => state.userProfile);

  const currentTime = new Date();
  const hours = currentTime.getHours();
  let greeting = "Good Morning";
  if (hours >= 12 && hours < 17) {
    greeting = "Good Afternoon";
  } else if (hours >= 17) {
    greeting = "Good Evening";
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Logo - Left aligned */}
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 font-semibold lg:hidden"
        >
          <Image src="/simcard.png" alt="Simkash Logo" width={24} height={24} />
          <span className="text-lg font-bold text-slate-800">simkash</span>
        </Link>

        {/* Desktop Greeting */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-medium">
            {greeting}, {userProfile?.fullname}
          </h1>
        </div>

        {/* Right Side Actions */}

        <div className="flex  items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 w-48 md:w-64 rounded-full bg-gray-100 border-none"
            />
          </div>
          <div className=" lg:hidden ">
            <NotificationsModal />
          </div>

           <div className=" hidden lg:block ">
            <NotificationsModal />
          </div>
        </div>
      </div>
    </header>
  );
}
