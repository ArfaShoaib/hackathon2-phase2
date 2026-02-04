import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

interface GlassButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function GlassButton({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: GlassButtonProps) {
  const baseClasses = "transition-all duration-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(190,92%,65%,0.5)]";

  const variants = {
    default: "bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] text-[hsl(0,0%,98.5%)] hover:opacity-90",
    outline: "bg-transparent border border-[hsl(120,190,255,0.18)] text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]",
    ghost: "bg-transparent text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]",
    secondary: "bg-[hsl(25,30,70,0.17)] text-[hsl(0,0%,98.5%)] border border-[hsl(120,190,255,0.18)] hover:bg-[hsl(25,30,70,0.25)]"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    "glass-button",
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}