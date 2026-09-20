import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "indigo" | "amber" | "rose" | "slate" | "sky";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "emerald",
  size = "sm",
  className = "",
}: BadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2.5 py-0.5 font-medium",
    md: "text-sm px-3 py-1 font-medium",
  };

  const variantClasses = {
    emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
    indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20",
    amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
    rose: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20",
    slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-400/20",
    sky: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
