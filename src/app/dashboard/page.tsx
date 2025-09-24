"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package, FileText, BarChart2, User } from "lucide-react";
import MonitoringPage from "./monitoring/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllBlogs, getAllProducts, getPurchaseRequests, getVisits } from "@/lib/api";

export default function DashboardPage() {
  const { data: purchaseRequests, isLoading, error } = useQuery({
    queryKey: ["purchase-requests"],
    queryFn: async () => await getPurchaseRequests(),
  });

  const { data: visits } = useQuery({
    queryKey: ["visits"],
    queryFn: async () => await getVisits(),
  });


  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await getAllProducts(),
  });

  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => await getAllBlogs(),
  });

  // if (isLoading) return <div className="flex items-center justify-center min-h-screen">Yuklanmoqda...</div>;
  // if (error) return <div className="flex items-center justify-center min-h-screen">Xatolik: {(error as Error).message}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Boshqaruv paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mahsulotlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{products?.length || 0}</p>
            <Link href="/dashboard/products">
              <Button variant="link" className="mt-2 cursor-pointer">Batafsil</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bloglar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{blogs?.length || 0}</p>
            <Link href="/dashboard/blog">
              <Button variant="link" className="mt-2 cursor-pointer">Batafsil</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Tashriflar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{visits?.data?.length || 0}</p>
            <Link href="/dashboard/monitoring">
              <Button variant="link" className="mt-2 cursor-pointer">Batafsil</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Sotuvlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{purchaseRequests?.data?.length || 0}</p>
            <Link href="/dashboard/monitoring">
              <Button variant="link" className="mt-2 cursor-pointer">Batafsil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tezkor havolalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/products">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <Package className="h-5 w-5" />
                Mahsulotlarni boshqarish
              </Button>
            </Link>
            <Link href="/dashboard/blog">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-5 w-5" />
                Bloglarni boshqarish
              </Button>
            </Link>
            <Link href="/dashboard/monitoring">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <BarChart2 className="h-5 w-5" />
                Monitoring
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                <User className="h-5 w-5" />
                Profil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <MonitoringPage />
    </div>
  );
}