'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/dashboard/metric-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { BestSellers } from '@/components/dashboard/best-sellers';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { CategorySales } from '@/components/dashboard/category-sales';
import { PaymentMethods } from '@/components/dashboard/payment-methods';
import { Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import {
  KpiMetric,
  DailySalesData,
  BestSeller,
  Order,
  CategorySale,
  PaymentMethodStat,
} from '@/data/types';

export interface DashboardData {
  kpis: KpiMetric[];
  weeklySalesTrend: DailySalesData[];
  revenuePeriodSummary: {
    today: { amount: string; labelTh: string; labelEn: string; change: string; isPositive: boolean };
    thisMonth: { amount: string; labelTh: string; labelEn: string; change: string; isPositive: boolean };
  };
  bestSellers: BestSeller[];
  recentOrders: Order[];
  categorySales: CategorySale[];
  paymentMethods: PaymentMethodStat[];
}

interface DashboardViewProps {
  initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      if (res.ok) {
        const fresh = await res.json();
        setData(fresh);
        const now = new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLastRefreshedTime(now);
      }
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <PageHeader
        title="Dashboard"
        subtitle="ภาพรวมของร้าน • อ่านข้อมูลจริงจากฐานข้อมูล PostgreSQL (เชื่อมต่อกับระบบ Java POS)"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF5EE] border border-[#C8E8D3] text-xs font-bold text-[#1E5E3A]">
            <Database className="w-4 h-4 text-[#1E5E3A]" />
            <span>Java POS Synced (Live DB)</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5C3D28] text-white text-xs font-bold hover:bg-[#442B1A] disabled:opacity-75 transition-all shadow-sm cursor-pointer"
            title="ดึงข้อมูลล่าสุดจาก Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรช'}</span>
          </button>
        </div>
      </PageHeader>

      {lastRefreshedTime && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-semibold text-[#166534]">
          <CheckCircle2 className="w-4 h-4" />
          <span>อัปเดตข้อมูลล่าสุดเมื่อ {lastRefreshedTime} น. จากฐานข้อมูล Supabase PostgreSQL</span>
        </div>
      )}

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {data.kpis.map((kpi) => (
          <MetricCard
            key={kpi.id}
            title={kpi.title}
            titleTh={kpi.titleTh}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            comparisonText={kpi.comparisonText}
            iconName={kpi.iconName}
          />
        ))}
      </div>

      {/* กราฟยอดขาย & สินค้าขายดี */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart
            data={data.weeklySalesTrend}
            periodSummary={data.revenuePeriodSummary}
          />
        </div>
        <div className="lg:col-span-1">
          <BestSellers items={data.bestSellers} />
        </div>
      </div>

      {/* สัดส่วนหมวดหมู่ & ช่องทางการชำระเงิน */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySales
          items={data.categorySales}
          totalRevenue={data.kpis.find((k) => k.id === 'revenue')?.value}
        />
        <PaymentMethods
          items={data.paymentMethods}
          totalCount={data.recentOrders.length}
        />
      </div>

      {/* Order ล่าสุด */}
      <div>
        <RecentOrders
          orders={data.recentOrders}
          totalCount={data.recentOrders.length}
        />
      </div>
    </div>
  );
}
