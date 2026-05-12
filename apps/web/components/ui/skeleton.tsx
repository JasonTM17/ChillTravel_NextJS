import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("tv-skeleton rounded-tv-sm", className)}
      {...props}
    />
  );
}
