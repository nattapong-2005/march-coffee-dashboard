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
      style = 'bg-[#EAF5EE] text-[#1E5E3A] border-[#C8E8D3] font-bold';
      label = 'สำเร็จ / Completed';
      break;
    case 'Preparing':
      style = 'bg-[#FEF3E2] text-[#8A4B08] border-[#FCDDB5] font-bold';
      label = 'กำลังเตรียม / Preparing';
      break;
    case 'Pending':
      style = 'bg-[#F4EFEB] text-[#4E4035] border-[#DFD7CC] font-bold';
      label = 'รอดำเนินการ / Pending';
      break;
    case 'Cancelled':
      style = 'bg-[#FDF1F1] text-[#A82020] border-[#F8D2D2] font-bold';
      label = 'ยกเลิก / Cancelled';
      break;
    case 'Normal':
      style = 'bg-[#EAF5EE] text-[#1E5E3A] border-[#C8E8D3] font-bold';
      label = 'ปกติ / Normal';
      break;
    case 'Low Stock':
      style = 'bg-[#FEF3E2] text-[#8A4B08] border-[#FCDDB5] font-bold';
      label = 'สต็อกต่ำ / Low Stock';
      break;
    case 'Critical':
      style = 'bg-[#FDF1F1] text-[#A82020] border-[#F8D2D2] font-bold';
      label = 'วิกฤต / Critical';
      break;
    case 'VIP':
      style = 'bg-[#FAF4ED] text-[#5C3D28] border-[#EFE3D5] font-extrabold';
      label = 'VIP Member';
      break;
    case 'Regular':
      style = 'bg-[#F4EFEB] text-[#544439] border-[#DFD7CC] font-bold';
      label = 'Regular';
      break;
    case 'New':
      style = 'bg-[#EEF4FB] text-[#1D548C] border-[#CFE1F4] font-bold';
      label = 'New';
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
