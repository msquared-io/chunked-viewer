import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import type { BaseStats } from "../../types/stats"
import { formatNumber } from "../../lib/utils"

interface StatsOverviewProps {
  stats: BaseStats
  title: string
  description: string
}

export function StatsOverview({
  stats,
  title,
  description,
}: StatsOverviewProps) {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm font-medium text-muted-foreground">
              total blocks/items
            </p>
            <p className="text-3xl font-bold">
              {formatNumber(
                stats.totalMined + stats.totalPlaced + stats.totalCrafted,
                0,
              )}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total mined
              </p>
              <p className="text-sm font-medium">
                {formatNumber(stats.totalMined, 0)}
              </p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total placed
              </p>
              <p className="text-sm font-medium">
                {formatNumber(stats.totalPlaced, 0)}
              </p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total crafted
              </p>
              <p className="text-sm font-medium">
                {formatNumber(stats.totalCrafted, 0)}
              </p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total updates
              </p>
              <p className="text-sm font-medium">
                {formatNumber(stats.totalPlayerUpdates, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
