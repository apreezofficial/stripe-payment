"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    variant === "outline"
      ? "border border-pink-400 text-pink-500 hover:bg-pink-100"
      : "bg-pink-500 hover:bg-pink-600 text-white";

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-full font-medium transition-all disabled:opacity-50",
        base,
        className
      )}
      {...props}
    />
  );
}
