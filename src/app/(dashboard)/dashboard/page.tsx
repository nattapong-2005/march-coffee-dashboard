import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/dashboard/metric-card';
import { dashboardKpis } from '@/data/dashboard';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { BestSellers } from '@/components/dashboard/best-sellers';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { Database, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Header */}
      <PageHeader
        title="Dashboard"
        subtitle="ภาพรวมของร้าน • อ่านข้อมูลจากระบบเดียวกับ Java POS เพื่อแสดงผลให้ดูง่าย ชัดเจน และสวยงาม"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF5EE] border border-[#C8E8D3] text-xs font-bold text-[#1E5E3A]">
            <Database className="w-4 h-4" />
            <span>Java POS Synced</span>
          </div>
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5C3D28] text-white text-xs font-bold hover:bg-[#442B1A] transition-colors shadow-sm"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>รีเฟรช</span>
          </button>
        </div>
      </PageHeader>

      {/* 4 Primary KPI Summary Cards:
          1. ยอดขายวันนี้
          2. จำนวน Order วันนี้
          3. จำนวนสินค้าที่ขาย
          4. ยอดเฉลี่ยต่อ Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {dashboardKpis.map((kpi) => (
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

      {/* กราฟยอดขายย้อนหลัง & สินค้าขายดี */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <BestSellers />
        </div>
      </div>

      {/* Order ล่าสุด */}
      <div>
        <RecentOrders />
      </div>
    </div>
  );
}
