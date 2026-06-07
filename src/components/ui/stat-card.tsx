import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: Trend;
  trendValue?: string;
  icon: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
  iconBg = "bg-primary/10",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-2xl",
            iconBg,
          )}
        >
          {icon}
        </div>
        {trend && trendValue && (
          <span
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend === "up" && "text-green",
              trend === "down" && "text-red",
              trend === "neutral" && "text-dark-4",
            )}
          >
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "–"} {trendValue}
          </span>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-2xl font-bold text-dark dark:text-white">{value}</h3>
        <p className="mt-1 text-sm font-medium text-dark-4 dark:text-dark-6">
          {label}
        </p>
        {subValue && (
          <p className="mt-1 text-xs text-dark-6 dark:text-dark-4">{subValue}</p>
        )}
      </div>
    </div>
  );
}
