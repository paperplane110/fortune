"use client"
// NOTE DIFFERENT FROM TUTORIAL
// Using shadcn chart component.

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A radar chart with dots"

const chartConfig = {
  value: {
    label: "Expenses",
    color: "oklch(75% 0.183 55.934)",
  },
} satisfies ChartConfig

type Props = {
  data: {
    name: string,
    value: number,
  }[]
}

export const RadarVariant = ({ data = [] }: Props) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <RadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white" />} />
        <PolarAngleAxis dataKey="name" />
        <PolarGrid />
        <Radar
          dataKey="value"
          fill="oklch(75% 0.183 55.934)"
          fillOpacity={0.6}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  )
}
