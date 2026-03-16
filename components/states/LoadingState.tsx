"use client"

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-36 w-full rounded-md" />
    </div>
  );
}
