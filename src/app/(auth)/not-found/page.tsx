/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Sahifa topilmadi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Siz qidirgan sahifa mavjud emas yoki noto'g'ri manzil kiritilgan.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Tizimga kirish</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}