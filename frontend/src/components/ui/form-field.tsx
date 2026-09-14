import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const fieldClasses =
  "w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30 disabled:opacity-50";

export function FormField({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: FormFieldProps) {
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
      <input
        id={fieldId}
        className={cn(fieldClasses, error && "border-red-400")}
        {...props}
      />
      {hint && !error ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
