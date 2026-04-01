import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

export function CTAButton({
  href,
  children,
  variant = "primary",
  className,
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-8 py-3 text-base font-semibold transition-all duration-300",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
        variant === "outline" &&
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
