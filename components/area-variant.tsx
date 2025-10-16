import { format } from "date-fns";
import {
  Tooltip,
  XAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CustomTooltip } from "@/components/custom-tooltip";

type Props = {
  data: {
    date: string,
    income: number,
    expenses: number,
  }[]
}

export const AreaVariant = ({data}: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f64d3d" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f64d3d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={CustomTooltip} />
        <XAxis 
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ "fontSize": "12px" }}
          tickMargin={16}
        />
        <Area 
          type="monotone"
          dataKey="income"
          stackId="income"
          strokeWidth={2}
          stroke="#82ca9d"
          fill="url(#income)"
          className="drop-shadow-sm"
        />
        <Area 
          type="monotone"
          dataKey="expenses"
          stackId="expenses"
          strokeWidth={2}
          stroke="#f64d3d"
          fill="url(#expenses)"
          className="drop-shadow-sm"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}