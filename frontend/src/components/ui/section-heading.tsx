import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  heading: React.ReactNode;
  level?: "h1" | "h2";
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  level = "h2",
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const Heading = level;

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <Heading className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
        {heading}
      </Heading>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-muted text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
