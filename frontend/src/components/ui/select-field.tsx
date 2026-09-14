import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export function SelectField({
  label,
  error,
  id,
  children,
  className,
  ...props
}: SelectFieldProps) {
  const fieldId = id || props.name;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-ink"
      >
        {label}
        {props.required ? <span className="text-red-500" aria-hidden="true"> *</span> : null}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            "w-full appearance-none rounded-md border border-border bg-white px-3.5 py-2.5 pr-9 text-sm text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30 disabled:opacity-50",
            error && "border-red-400"
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
