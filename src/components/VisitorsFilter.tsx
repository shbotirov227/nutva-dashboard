"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/formatDate";
import { PopoverClose } from "@radix-ui/react-popover";

interface VisitorsFilterProps {
  data: { date: string; totalVisits: number }[];
  onFilter: (filtered: { date: string; totalVisits: number }[]) => void;
}

export function VisitorsFilter({ data, onFilter }: VisitorsFilterProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleFilter = () => {
    if (!dateRange?.from && !dateRange?.to) {
      // onFilter(data);
      return undefined;
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);

      if (dateRange?.from && dateRange?.to) {
        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);

        return itemDate >= startDate && itemDate <= endDate;
      }

      if (dateRange?.from && !dateRange.to) {
        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);

        const itemDateOnly = new Date(itemDate);
        itemDateOnly.setHours(0, 0, 0, 0);

        return itemDateOnly.getTime() === startDate.getTime();
      }

      return true;
    });

    const sortedFiltered = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    onFilter(sortedFiltered);
  };

  return (
    <div className="flex items-center gap-4 mt-5">

      <Button
        variant="outline"
        onClick={() => onFilter([])}
        className="cursor-pointer"
      >
        Barchasini ko'rsatish
      </Button>

      <Popover>
        <PopoverTrigger asChild className="cursor-pointer">
          <Button variant="outline">
            {dateRange?.from
              ? dateRange.to
                ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                : "-"
              : "Sanani tanlang"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
            className="w-full"
            captionLayout="dropdown"
            footer={
              <div className="flex justify-between p-2">
                <PopoverClose asChild>
                  <Button variant="secondary" className="cursor-pointer">
                    Yopish
                  </Button>
                </PopoverClose>
                <Button onClick={handleFilter} className="cursor-pointer">Filtrlash</Button>
              </div>
            }
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleFilter} className="cursor-pointer">Filterlash</Button>
      <Button
        variant="secondary"
        className="cursor-pointer"
        onClick={() => {
          handleSelect(undefined);
          onFilter(data);
        }}
      >
        Filterni tozalash
      </Button>
    </div>
  );
}