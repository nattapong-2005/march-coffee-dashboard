import React from 'react';
import { OrderStatus, StockStatus } from '@/data/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus | StockStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  let style = 'bg-[#F4EFEB] text-[#4E4035] border-[#DFD7CC]';
  let label = status;

  switch (status) {
    case 'Completed':
      style = 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] font-bold';
      label = 'สำเร็จ / Completed';
      break;
    case 'Preparing':
      style = 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] font-bold';
      label = 'กำลังเตรียม / Preparing';
      break;
    case 'Pending':
      style = 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] font-bold';
      label = 'รอดำเนินการ / Pending';
      break;
    case 'Cancelled':
      style = 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] font-bold';
      label = 'ยกเลิก / Cancelled';
      break;
    case 'Normal':
      style = 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] font-bold';
      label = 'ปกติ / Normal';
      break;
    case 'Low Stock':
      style = 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] font-bold';
      label = 'สต็อกต่ำ / Low Stock';
      break;
    case 'Critical':
      style = 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] font-bold';
      label = 'วิกฤต / Critical';
      break;
    case 'VIP':
      style = 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D] font-extrabold';
      label = 'VIP Member';
      break;
    case 'Regular':
      style = 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] font-bold';
      label = 'Regular';
      break;
    case 'New':
      style = 'bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE] font-bold';
      label = 'New Member';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-bold tracking-tight transition-colors',
        size === 'sm' ? 'text-xs' : 'text-sm px-3 py-1',
        style,
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-80 inline-block" />
      {label}
    </span>
  );
}
