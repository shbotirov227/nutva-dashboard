/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Yuklanmoqda...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            Admin paneliga xush kelibsiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Bu admin paneli mahsulotlar, bloglar va sayt tashriflarini boshqarish uchun mo'ljallangan. Tizimga kirish uchun quyidagi tugmani bosing.
          </p>
          <Button asChild className="w-full">
            <a href="/login">Tizimga kirish</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}