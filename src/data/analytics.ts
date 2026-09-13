import { PeakTimeSlot, CategorySale, PaymentMethodStat } from './types';

export type AnalyticsPeriod = '7d' | '30d' | 'month' | 'last_month';

export interface PeriodOverview {
  revenue: number;
  formattedRevenue: string;
  revenueGrowth: string;
  orders: number;
  ordersGrowth: string;
  customers: number;
  customersGrowth: string;
  aov: number;
  formattedAov: string;
  aovGrowth: string;
  trend: { label: string; revenue: number; orders: number }[];
}

export const analyticsPeriodData: Record<AnalyticsPeriod, PeriodOverview> = {
  '7d': {
    revenue: 121400,
    formattedRevenue: '฿121,400',
    revenueGrowth: '+9.4%',
    orders: 941,
    ordersGrowth: '+7.8%',
    customers: 785,
    customersGrowth: '+5.1%',
    aov: 129.01,
    formattedAov: '฿129.01',
    aovGrowth: '+2.4%',
    trend: [
      { label: '6 ก.ย. (จันทร์)', revenue: 12400, orders: 98 },
      { label: '7 ก.ย. (อังคาร)', revenue: 14800, orders: 114 },
      { label: '8 ก.ย. (พุธ)', revenue: 13900, orders: 108 },
      { label: '9 ก.ย. (พฤหัส)', revenue: 16200, orders: 126 },
      { label: '10 ก.ย. (ศุกร์)', revenue: 18900, orders: 145 },
      { label: '11 ก.ย. (เสาร์)', revenue: 23400, orders: 182 },
      { label: '12 ก.ย. (อาทิตย์)', revenue: 21800, orders: 168 },
    ],
  },
  '30d': {
    revenue: 498200,
    formattedRevenue: '฿498,200',
    revenueGrowth: '+14.6%',
    orders: 3840,
    ordersGrowth: '+11.2%',
    customers: 2410,
    customersGrowth: '+9.8%',
    aov: 129.74,
    formattedAov: '฿129.74',
    aovGrowth: '+3.1%',
    trend: [
      { label: 'สัปดาห์ 1', revenue: 115000, orders: 890 },
      { label: 'สัปดาห์ 2', revenue: 122400, orders: 945 },
      { label: 'สัปดาห์ 3', revenue: 129800, orders: 995 },
      { label: 'สัปดาห์ 4', revenue: 131000, orders: 1010 },
    ],
  },
  'month': {
    revenue: 428950,
    formattedRevenue: '฿428,950',
    revenueGrowth: '+14.2%',
    orders: 3290,
    ordersGrowth: '+10.5%',
    customers: 2150,
    customersGrowth: '+8.4%',
    aov: 130.38,
    formattedAov: '฿130.38',
    aovGrowth: '+3.3%',
    trend: [
      { label: '1-7 ก.ย.', revenue: 112000, orders: 860 },
      { label: '8-14 ก.ย.', revenue: 128400, orders: 980 },
      { label: '15-21 ก.ย.', revenue: 98550, orders: 750 },
      { label: '22-30 ก.ย. (คาดการณ์)', revenue: 90000, orders: 700 },
    ],
  },
  'last_month': {
    revenue: 375600,
    formattedRevenue: '฿375,600',
    revenueGrowth: '+8.1%',
    orders: 2980,
    ordersGrowth: '+6.4%',
    customers: 1980,
    customersGrowth: '+4.9%',
    aov: 126.04,
    formattedAov: '฿126.04',
    aovGrowth: '+1.6%',
    trend: [
      { label: 'สัปดาห์ 1', revenue: 88000, orders: 700 },
      { label: 'สัปดาห์ 2', revenue: 92400, orders: 730 },
      { label: 'สัปดาห์ 3', revenue: 96800, orders: 770 },
      { label: 'สัปดาห์ 4', revenue: 98400, orders: 780 },
    ],
  },
};

export const peakOrderTimes: PeakTimeSlot[] = [
  { timeSlot: '08:00–10:00', orders: 38, volumePercent: 27 },
  { timeSlot: '10:00–12:00', orders: 42, volumePercent: 30 },
  { timeSlot: '12:00–14:00', orders: 29, volumePercent: 20 },
  { timeSlot: '14:00–16:00', orders: 18, volumePercent: 13 },
  { timeSlot: '16:00–18:00', orders: 11, volumePercent: 8 },
  { timeSlot: '18:00–20:00', orders: 4, volumePercent: 2 },
];

export const analyticsCategorySales: CategorySale[] = [
  {
    category: 'Coffee',
    categoryTh: 'กาแฟ',
    revenue: 251950,
    formattedRevenue: '฿251,950',
    percentage: 58.7,
    colorClass: 'bg-[#8B4513]',
  },
  {
    category: 'Non-Coffee',
    categoryTh: 'เครื่องดื่มอื่นๆ',
    revenue: 101230,
    formattedRevenue: '฿101,230',
    percentage: 23.6,
    colorClass: 'bg-[#059669]',
  },
  {
    category: 'Bakery',
    categoryTh: 'เบเกอรี่',
    revenue: 75770,
    formattedRevenue: '฿75,770',
    percentage: 17.7,
    colorClass: 'bg-[#EA580C]',
  },
];

export const analyticsPaymentBreakdown: PaymentMethodStat[] = [
  {
    id: 'promptpay',
    name: 'PromptPay QR',
    nameTh: 'พร้อมเพย์ QR',
    percentage: 63.4,
    amount: 271954,
    formattedAmount: '฿271,954',
    iconName: 'QrCode',
  },
  {
    id: 'cash',
    name: 'Cash',
    nameTh: 'เงินสด',
    percentage: 22.1,
    amount: 94798,
    formattedAmount: '฿94,798',
    iconName: 'Banknote',
  },
  {
    id: 'credit_card',
    name: 'Credit Card',
    nameTh: 'บัตรเครดิต',
    percentage: 14.5,
    amount: 62198,
    formattedAmount: '฿62,198',
    iconName: 'CreditCard',
  },
];
