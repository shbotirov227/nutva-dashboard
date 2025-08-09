"use client";

import Link from "next/link";
import { LayoutDashboard, Package, FileText, BarChart2, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Products", href: "/dashboard/products", icon: <Package /> },
    { name: "Blog", href: "/dashboard/blog", icon: <FileText /> },
    { name: "Monitoring", href: "/dashboard/monitoring", icon: <BarChart2 /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User /> },
  ];

  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
        <Button className="w-full" variant="default" onClick={async () => await signOut()}> <LogOut /> Logout</Button>
      </nav>
    </aside>
  );
}