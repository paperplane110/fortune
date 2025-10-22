"use client"
import { useState } from "react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";
import qs from "query-string"
import { cn, formatDateRange } from "@/lib/utils";
import {
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading: isLoadingSummary } = useGetSummary();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramsState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramsState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
      accountId,
    };
    const url = qs.stringifyUrl({
      url: pathname,
      query
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  }

  const onReset = () => {
    setDate({
      from: defaultFrom,
      to: defaultTo,
    });
    pushToUrl(undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoadingSummary}
          size="sm"
          variant="outline"
          className="flex items-center justify-between w-full lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent focus-visible:ring-transparent focus:bg-white/30 focus-visible:bg-white/30 outline-none text-white transition"
        >
          <span>
            {formatDateRange(paramsState)}
          </span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full lg:w-auto p-0" 
        align="start"
      >
        <Calendar
          disabled={isLoadingSummary}
          autoFocus
          mode="range"
          numberOfMonths={2}
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
        />
        <div className="p-4 w-full flex items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date?.to}
              className="w-full"
              variant="outline"
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date?.to}
              className="w-full"
              variant="default"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}