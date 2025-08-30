"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "@/components/charts/SalesChart";
import { VisitorsChart } from "@/components/charts/VisitorsChart";
import { getPurchaseRequests, getVisits } from "@/lib/api";
import { useEffect, useState } from "react";
import { VisitorsFilter } from "@/components/VisitorsFilter";
import { Skeleton } from "@/components/ui/skeleton";
import QueryWrapper from "@/components/QueryWrapper";

export default function MonitoringPage() {
  const [filteredVisits, setFilteredVisits] = useState<typeof visitsData>([]);

  const {
    data: purchaseRequestsData = [],
    isLoading: purchaseRequestsLoading,
    isError: purchaseRequestsError,
    error: purchaseRequestsErrorObj,
    refetch: refetchPurchaseRequests,
  } = useQuery({
    queryKey: ["purchase-requests"],
    queryFn: getPurchaseRequests,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const {
    data: visitsData = [],
    isLoading: visitsLoading,
    isError: visitsError,
    error: visitsErrorObj,
    refetch: refetchVisits,
  } = useQuery({
    queryKey: ["visits"],
    queryFn: getVisits,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (visitsData.length > 0) {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 10);

      const lastWeekData = visitsData.filter((item: { date: string | number | Date }) => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && itemDate <= now;
      });

      setFilteredVisits(lastWeekData);
    }
  }, [visitsData]);

  const displayData = filteredVisits.length > 0 ? filteredVisits : visitsData;
  const sortedDisplayData = [...displayData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const isLoading = purchaseRequestsLoading || visitsLoading;
  const isError = purchaseRequestsError || visitsError;
  const error = purchaseRequestsErrorObj || visitsErrorObj;
  const refetch = refetchPurchaseRequests || refetchVisits;
  

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center space-y-4">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  //         <p className="text-muted-foreground">Yuklanmoqda...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <QueryWrapper
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
    >
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sotuvlar haqida</CardTitle>
        </CardHeader>
        <CardContent>
          {/* {isLoading ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ) : ( */}
          <SalesChart data={purchaseRequestsData} />
          {/* )} */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Tashriflar haqida</CardTitle>
          {/* {isLoading ? (
            <Skeleton className="h-9 w-32 rounded-md" />
          ) : ( */}
          <VisitorsFilter data={visitsData} onFilter={setFilteredVisits} />
          {/* )} */}
        </CardHeader>
        <CardContent>
          {/* {isLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ) : ( */}
          <VisitorsChart data={sortedDisplayData} />
          {/* )} */}
        </CardContent>
      </Card>
    </div>
    </QueryWrapper>
  );
}
