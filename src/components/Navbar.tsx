"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/types";
// import { logout } from "@/lib/api";

export default function Navbar({ user }: { user?: UserType }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    // window.location.href = "/(auth)/login";
  };

  if (!isClient) return null;

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/profile">
            <Avatar>
              <AvatarImage
                src={user?.image || "/default-user.webp"}
                alt={user?.email || "User"}
              />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
          </Link>
          <span className="text-sm">{user?.email || "Foydalanuvchi"}</span>
          <Button className="cursor-pointer" variant="outline" size="sm" onClick={handleLogout}>
            Chiqish
          </Button>
        </div>
      </div>
    </nav>
  );
}