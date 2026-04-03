import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className, glass = false, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? 'bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20 dark:border-white/10'
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700',
        hover && 'hover:scale-[1.02] hover:shadow-xl cursor-pointer',
        glow && 'animate-glow',
        className
      )}
    >
      {children}
    </div>
  );
}
