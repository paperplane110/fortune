"use client"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const COLORS = ["#ffba00", "#ff6900", "#e17100", "oklch(47.3% 0.137 46.201)",]

type Props = {
  data: {
    name: string,
    value: number
  }[]
}

export const RadialVairiant = ({ data = [] }: Props) => {
  const chartData = data.map((item, index) => {
    return {
      ...item,
      expenses: item.value,
      fill: COLORS[index % COLORS.length],
    }
  }, [])
  const chartConfig = chartData.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={-30}
        endAngle={360}
        innerRadius={30}
        outerRadius={110}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="name" className="bg-white" />}
        />
        <RadialBar dataKey="expenses" background>
          <LabelList
            position="insideStart"
            dataKey="name"
            className="fill-white capitalize mix-blend-luminosity"
            fontSize={11}
          />
        </RadialBar>
      </RadialBarChart>
    </ChartContainer>
  )
}
