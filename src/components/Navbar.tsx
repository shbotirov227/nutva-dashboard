import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Link href="/dashboard/profile">
          <Avatar>
            <AvatarImage src="/default-user.png" alt="User" />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
}