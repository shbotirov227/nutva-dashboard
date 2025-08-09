"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "@/components/charts/SalesChart";
import { VisitorsChart } from "@/components/charts/VisitorsChart";
import { fetchSalesData, fetchVisitorsData } from "@/lib/api";

export default function MonitoringPage() {
  const { data: salesData = [], isLoading: salesLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSalesData,
  });

  const { data: visitorsData = [], isLoading: visitorsLoading } = useQuery({
    queryKey: ["visitors"],
    queryFn: fetchVisitorsData,
  });

  if (salesLoading || visitorsLoading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sotuvlar haqida</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={salesData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tashriflar haqida</CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorsChart data={visitorsData} />
        </CardContent>
      </Card>
    </div>
  );
}