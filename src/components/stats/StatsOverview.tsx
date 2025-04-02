import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { BaseStats } from "../../types/stats"

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
              {stats.totalMined + stats.totalPlaced + stats.totalCrafted}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total mined
              </p>
              <p className="text-sm font-medium">{stats.totalMined}</p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total placed
              </p>
              <p className="text-sm font-medium">{stats.totalPlaced}</p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total crafted
              </p>
              <p className="text-sm font-medium">{stats.totalCrafted}</p>
            </div>
            <div className="flex justify-between gap-8">
              <p className="text-sm font-medium text-muted-foreground">
                total distance
              </p>
              <p className="text-sm font-medium">{stats.totalDistance} m</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
