import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Locale } from "@/types";
import { localizePath } from "@/lib/i18n";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700",
  secondary:
    "bg-green-700 text-white shadow-sm hover:bg-green-800 active:bg-green-900",
  dark: "bg-ink text-white hover:bg-ink-soft",
  outline:
    "border border-border-strong bg-white text-ink hover:border-brand-400 hover:text-brand-700",
  ghost: "text-ink hover:bg-green-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  locale?: Locale;
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

export function LinkButton({
  className,
  href,
  variant = "primary",
  size = "md",
  locale,
  ...props
}: LinkButtonProps) {
  const finalHref = locale ? localizePath(href, locale) : href;
  return (
    <Link
      href={finalHref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
