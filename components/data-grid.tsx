"use client";

import { useSearchParams } from "next/navigation";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
import { DataCard, DataCardLoading } from "@/components/data-card";

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const dateRangeLabel = formatDateRange({ from, to });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb2 mb-8">
      <DataCard 
        title="Remaining"
        value={data?.remainingAmount || 0}
        percentageChange={data?.remainingChange || 0}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard 
        title="Income"
        value={data?.incomeAmount || 0}
        percentageChange={data?.incomeChange || 0}
        icon={FaArrowTrendUp}
        variant="success"
        dateRange={dateRangeLabel}
      />
      <DataCard 
        title="Expenses"
        value={data?.expensesAmount || 0}
        percentageChange={data?.expensesChange || 0}
        icon={FaArrowTrendDown}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </div>
  )
}

