"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RelativeTimeProps {
  date: number | Date;
  className?: string;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);
  const timestamp = typeof date === "number" ? date : date.getTime();
  const dateObj = new Date(timestamp);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>-</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className}>
            {formatDistanceToNow(dateObj, { addSuffix: true })}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {dateObj.toLocaleString()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
