"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Image, FileText, BarChart2, User, LogOut, ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Asosiy sahifa", href: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Banner", href: "/dashboard/banner", icon: <Image /> },
    { name: "Mahsulotlar", href: "/dashboard/products", icon: <Package /> },
    { name: "Blog", href: "/dashboard/blog", icon: <FileText /> },
    { name: "Monitoring", href: "/dashboard/monitoring", icon: <BarChart2 /> },
    { name: "Profil", href: "/dashboard/profile", icon: <User /> },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
  };

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"
        } border-r transition-all duration-300 ease-in-out p-4 h-screen sticky top-0 left-0`}
    >
      <Button
        variant="ghost"
        className="w-[40px] mb-4 cursor-pointer ml-auto flex items-center justify-center"
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ArrowRightToLine /> : <ArrowLeftToLine />}
      </Button>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-2 p-2 rounded transition-all ${isCollapsed ? "justify-center space-x-0" : ""
              } ${isActive(item.href) ? "bg-[#e3e3e3] text-accent-foreground dark:bg-accent" : "hover:bg-accent"}`}
          >
            <span className="flex-shrink-0">
              {item.icon}
            </span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
        <Button
          className={`w-full cursor-pointer ${isCollapsed ? "justify-center" : ""}`}
          variant="default"
          onClick={async () => await signOut()}
        >
          <LogOut />
          {!isCollapsed && <span className="ml-2">Akkauntdan chiqish</span>}
        </Button>
      </nav>
    </aside>
  );
}