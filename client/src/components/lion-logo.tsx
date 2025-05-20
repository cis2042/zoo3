import { cn } from "@/lib/utils";

interface LionLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LionLogo({ size = "md", className }: LionLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center justify-center", sizeClasses[size], className)}>
      <img
        src="/images/lion-logo.png"
        alt="ZOO3 Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
