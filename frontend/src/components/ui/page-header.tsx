import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function PageHeader({ eyebrow, title, description, align, className }: PageHeaderProps) {
  return (
    <section className={cn("overflow-hidden border-b border-border bg-gradient-to-b from-brand-50/70 to-white", className)}>
      {/* Party identity hairline */}
      <div
        className="h-1 w-full bg-gradient-to-r from-brand-500 via-gold to-green-600"
        aria-hidden="true"
      />
      <div className={cn("container-page py-14 md:py-20", align === "center" && "text-center")}>
        <SectionHeading eyebrow={eyebrow} heading={title} description={description} align={align} />
      </div>
    </section>
  );
}
