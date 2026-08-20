import { Fragment } from "react";
import { clinic, formatDayHours } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Opening hours as a description list — <dt> day / <dd> hours is the correct
 * semantic pairing, and it gives assistive tech an explicit relationship that a
 * bare grid of <span>s would not.
 *
 * Rendered from clinic.hours.week, the same source the JSON-LD
 * openingHoursSpecification is generated from, so the visible hours and the
 * structured data can never drift apart.
 */
export function OpeningHours({
  compact = false,
  className,
}: {
  /** Abbreviated day names + tighter type, for the footer column. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-[auto_1fr] items-baseline gap-x-5",
        compact ? "gap-y-1 text-sm" : "gap-y-1.5 text-base",
        className,
      )}
    >
      {clinic.hours.week.map((d) => {
        const closed = !d.opens || !d.closes;
        return (
          <Fragment key={d.day}>
            <dt className={cn("font-semibold", closed && "text-muted-foreground")}>
              {compact ? d.day.slice(0, 3) : d.day}
            </dt>
            <dd
              className={cn(
                "text-right tabular-nums",
                closed ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {formatDayHours(d)}
            </dd>
          </Fragment>
        );
      })}
    </dl>
  );
}
