import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { authOptions } from "@/lib/auth";
import { UserType } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={session.user as UserType} />
        <main className="p-5">
          {children}
        </main>
      </div>
    </div>
  );
}