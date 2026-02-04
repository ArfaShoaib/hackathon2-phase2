import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export default function GlassCard({
  children,
  className,
  elevated = false,
  ...props
}: GlassCardProps) {
  const baseClasses = "rounded-2xl transition-all duration-300";

  const elevationClass = elevated
    ? "shadow-lg shadow-[hsl(0,0,0,0.3)] hover:shadow-xl hover:shadow-[hsl(190,220,255,0.4)]"
    : "shadow-md shadow-[hsl(0,0,0,0.5)]";

  const classes = cn(
    baseClasses,
    elevationClass,
    "glass-card",
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}