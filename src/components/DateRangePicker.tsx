"use client";

import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  onChange: (range: { from: string | null; to: string | null }) => void;
}

export default function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected);

    onChange({
      from: selected?.from ? formatDate(selected.from) : null,
      to: selected?.to ? formatDate(selected.to) : null,
    });
  };

  return (
    <div className="p-2 border rounded-md shadow-sm">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
      />
    </div>
  );
}