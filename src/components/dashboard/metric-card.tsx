import React from 'react';
import {
  CircleDollarSign,
  ShoppingBag,
  Users,
  ReceiptText,
  TrendingUp,
  TrendingDown,
  Coffee,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  titleTh: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparisonText: string;
  iconName: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  CircleDollarSign,
  ShoppingBag,
  Users,
  ReceiptText,
  Coffee,
  Package,
};

export function MetricCard({
  title,
  titleTh,
  value,
  change,
  isPositive,
  comparisonText,
  iconName,
  className,
}: MetricCardProps) {
  const Icon = iconMap[iconName] || CircleDollarSign;

  return (
    <div
      className={cn(
        'group bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 transition-all duration-200 hover:border-[#C8B8A6] hover:shadow-[0_4px_20px_-4px_rgba(92,61,40,0.06)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#75665B]">
            {title}
          </p>
          <p className="text-sm font-bold text-[#442B1A] mt-0.5">
            {titleTh}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28] group-hover:bg-[#5C3D28] group-hover:text-white transition-all">
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2B1A12]">
          {value}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md',
            isPositive
              ? 'text-[#1E5E3A] bg-[#EAF5EE] border border-[#C8E8D3]'
              : 'text-[#A82020] bg-[#FDF1F1] border border-[#F8D2D2]'
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {change}
        </span>
        <span className="text-[#75665B] font-medium">{comparisonText}</span>
      </div>
    </div>
  );
}
