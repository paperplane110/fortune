import { clsx, type ClassValue } from "clsx"
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

// NOTE How to format currency in Chinese or other locations.
export function formatCurrency(value: number) {
  return Intl.NumberFormat("zh-Hans-CN",
    {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 2,
    }
  ).format(value)
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false },
) {
  const result = new Intl.NumberFormat(
    "zh-Hans",
    {
      style: "percent"
    }
  ).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`
  } else {
    return result
  }
}

export function calculatePercentageChange(
  current: number,
  previous: number,
) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function fillEmptyDays(
  activeDays: {
    date: Date,
    income: number,
    expense: number,
  }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return []
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));
    if (found) {
      return found
    } else {
      return {
        date: day,
        income: 0,
        expense: 0,
      };
    }
  });
  return transactionsByDay;
}

type Period = {
  from: string | Date | undefined,
  to: string | Date | undefined,
}

export function formatDateRange(period: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  // in tutorial is !period?.from. Why use question mark
  if (!period.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }
  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }
  return format(period.from, "LLL dd, y");  // TODO I don't understand here's logic
}
