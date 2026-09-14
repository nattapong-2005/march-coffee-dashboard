export type OrderStatus = 'Completed' | 'Preparing' | 'Pending' | 'Cancelled';
export type StockStatus = 'Normal' | 'Low Stock' | 'Critical';
export type ProductCategory = 'Coffee' | 'Non-Coffee' | 'Bakery';
export type CustomerType = 'Regular' | 'New' | 'VIP';

export interface KpiMetric {
  id: string;
  title: string;
  titleTh: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparisonText: string;
  iconName: string;
}

export interface DailySalesData {
  day: string;
  dayTh: string;
  revenue: number;
  formattedRevenue: string;
  orders: number;
}

export interface CategorySale {
  category: ProductCategory;
  categoryTh: string;
  revenue: number;
  formattedRevenue: string;
  percentage: number;
  colorClass: string;
}

export interface BestSeller {
  rank: number;
  name: string;
  nameTh?: string;
  category: ProductCategory;
  categoryTh: string;
  sold: number;
  revenue: number;
  formattedRevenue: string;
  growth: string;
}

export interface PaymentMethodStat {
  id: string;
  name: string;
  nameTh: string;
  percentage: number;
  amount: number;
  formattedAmount: string;
  iconName: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameTh: string;
  remaining: number;
  unit: string;
  status: StockStatus;
  threshold: number;
}

export interface OrderItem {
  id?: number | string;
  orderId?: string;
  itemId?: string;
  name: string;
  category?: ProductCategory | string;
  quantity: number;
  price: number;
  sweetnessLevel?: string;
  extraShots?: number;
  warmed?: boolean;
  subtotal?: number;
}

export interface PaymentDetail {
  paymentId: string;
  orderId: string;
  paymentMethod: string;
  amountPaid: number;
  changeAmount: number;
  paymentDate?: string;
}

export interface UserDetail {
  id: string;
  username: string;
  name: string;
  role: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerType?: CustomerType;
  userId?: string | null;
  staffName?: string | null;
  staffRole?: string | null;
  payment?: PaymentDetail | null;
  items: OrderItem[];
  itemCountSummary: string;
  paymentMethod: 'PromptPay' | 'Cash' | 'Credit Card';
  total: number;
  formattedTotal: string;
  status: OrderStatus;
  time: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  nameTh: string;
  category: ProductCategory;
  categoryTh: string;
  price: number;
  extraShots?: number;
  warmed?: boolean;
  soldToday: number;
  revenue?: number;
  formattedRevenue?: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  badgeType: StockStatus;
}

export interface Customer {
  id: string;
  name: string;
  initials: string;
  phone: string;
  ordersCount: number;
  totalSpend: number;
  formattedTotalSpend: string;
  lastOrder: string;
  customerType: CustomerType;
}

export interface PeakTimeSlot {
  timeSlot: string;
  orders: number;
  volumePercent: number;
}

export interface AnalyticsSummary {
  revenue: number;
  formattedRevenue: string;
  revenueChange: string;
  orders: number;
  ordersChange: string;
  customers: number;
  customersChange: string;
  aov: number;
  formattedAov: string;
  aovChange: string;
}
