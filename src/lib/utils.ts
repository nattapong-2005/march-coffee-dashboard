import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTHB(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount).replace('THB', '฿').trim();
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num);
}
