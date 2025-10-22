import {
  Cell,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CategoryTooltip } from "@/components/category-tooltip"

import { formatPercentage } from "@/lib/utils"

const COLORS = ["#ffba00", "#ff6900", "#e17100", "oklch(47.3% 0.137 46.201)",]

type Props = {
  data: {
    name: string,
    value: number,
  }[]
}

export const PieVariant = ({ data }: Props) => {
  const totalSpend = data.reduce((acc, cur) => acc + cur.value, 0)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-col space-y-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {payload.map((entry: any, index: number) => (
                  <li
                    key={`legend-item-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="space-x-1">
                      <span className="text-sm text-foreground">
                        {entry.value}
                      </span>
                      <span className="text-sm text-foreground">
                        {formatPercentage(entry.payload.value / totalSpend * 100)}
                      </span>
                    </div>
                  </li>
                )
                )}
              </ul>
            )
          }}
        />
        <Tooltip content={<CategoryTooltip />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}