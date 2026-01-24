"use client";

import React, { useState } from "react";
import {
  Home,
  Baby,
  Apple,
  Thermometer,
  BookOpen,
  Search,
  ChevronRight,
  ShieldCheck,
  Menu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Kütüphane", icon: Home, href: "/" },
  { name: "Yenidoğan & Bebek", icon: Baby, href: "/category/newborn" },
  { name: "Beslenme", icon: Apple, href: "/category/nutrition" },
  { name: "Hastalık & Semptom", icon: Thermometer, href: "/category/health" },
  { name: "Gelişim Rehberi", icon: BookOpen, href: "/category/development" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      animate={{ width: isCollapsed ? 64 : 240 }}
      className="h-screen bg-monday-dark text-white flex flex-col shadow-xl z-50 transition-all duration-300 relative shrink-0"
    >
      {/* Brand Area */}
      <div className="h-16 flex items-center px-4 border-b border-gray-700/50 overflow-hidden">
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-monday-blue to-monday-purple flex items-center justify-center shrink-0">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight">PediatriLib</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-2 space-y-1">
        <div className={cn("px-3 mb-2 text-xs font-semibold text-gray-500 uppercase", isCollapsed && "hidden")}>
          Workspaces
        </div>

        {categories.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all relative group",
                  isActive
                    ? "bg-monday-blue/90 text-white"
                    : "hover:bg-white/10 text-gray-400 hover:text-gray-100"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer / Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 bottom-8 w-6 h-6 bg-white text-gray-600 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors z-50 border border-gray-100"
      >
        <ChevronRight className={cn("w-3 h-3 transition-transform", isCollapsed ? "" : "rotate-180")} />
      </button>
    </motion.div>
  );
}
