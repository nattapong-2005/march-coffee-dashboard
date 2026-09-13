'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { weeklySalesTrend, bestSellers, categorySales } from '@/data/dashboard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Calendar,
  CalendarDays,
  TrendingUp,
  Award,
  PieChart,
  Coffee,
  Download,
  DollarSign,
  CupSoda,
  Cake,
} from 'lucide-react';

const categoryIcons = {
  Coffee: Coffee,
  'Non-Coffee': CupSoda,
  Bakery: Cake,
};

export default function ReportsPage() {
  const [chartMode, setChartMode] = useState<'daily' | 'monthly'>('daily');

  const monthlyTrend = [
    { label: 'พ.ค.', revenue: 382000, orders: 2950 },
    { label: 'มิ.ย.', revenue: 395400, orders: 3040 },
    { label: 'ก.ค.', revenue: 412000, orders: 3180 },
    { label: 'ส.ค.', revenue: 375600, orders: 2980 },
    { label: 'ก.ย. (ปัจจุบัน)', revenue: 428950, orders: 3290 },
  ];

  const currentChartData =
    chartMode === 'daily'
      ? weeklySalesTrend.map((d) => ({
          label: `${d.day} (${d.dayTh})`,
          revenue: d.revenue,
          orders: d.orders,
        }))
      : monthlyTrend;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Reports"
        subtitle="รายงานและสถิติยอดขาย • สรุปยอดขายรายวัน รายเดือน สินค้าขายดี และสัดส่วนหมวดหมู่"
      >
        <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5C3D28] text-white text-xs font-bold hover:bg-[#442B1A] transition-colors shadow-sm">
          <Download className="w-3.5 h-3.5" />
          <span>ดาวน์โหลดรายงานสรุป (PDF/Excel)</span>
        </button>
      </PageHeader>

      {/* 1) ยอดขายรายวัน & 2) ยอดขายรายเดือน Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: ยอดขายรายวัน (Daily Sales) */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 space-y-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#75665B]">
              ยอดขายรายวัน (Daily Sales)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#2B1A12]">
            ฿18,450
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#1E5E3A] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% จากเมื่อวาน</span>
            <span className="text-[#75665B] font-medium ml-1">• 142 ออเดอร์ (284 ชิ้น)</span>
          </div>
        </div>

        {/* Card 2: ยอดขายรายเดือน (Monthly Sales) */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 space-y-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#75665B]">
              ยอดขายรายเดือน (Monthly Sales)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EAF5EE] border border-[#C8E8D3] flex items-center justify-center text-[#1E5E3A]">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#2B1A12]">
            ฿428,950
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#1E5E3A] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>+14.2% เทียบเดือนก่อน</span>
            <span className="text-[#75665B] font-medium ml-1">• รวม 3,290 ออเดอร์</span>
          </div>
        </div>

        {/* Card 3: ยอดขายเฉลี่ยรายวัน */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 space-y-3 sm:col-span-2 lg:col-span-1 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#75665B]">
              ยอดขายเฉลี่ยต่อวัน (Avg Daily)
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#2B1A12]">
            ฿14,298
          </div>
          <p className="text-xs font-medium text-[#75665B]">
            ประเมินจากยอดขาย 30 วันที่ผ่านมาในระบบ POS
          </p>
        </div>
      </div>

      {/* 5) กราฟยอดขาย (Sales Revenue Chart) */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#2B1A12]">
              กราฟยอดขาย (Sales Revenue Chart)
            </h2>
            <p className="text-xs font-semibold text-[#75665B] mt-0.5">
              แสดงการเติบโตของรายได้ (บาท) จากระบบบันทึกคำสั่งซื้อ
            </p>
          </div>

          {/* Toggle Daily / Monthly */}
          <div className="flex items-center p-1 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs">
            <button
              onClick={() => setChartMode('daily')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                chartMode === 'daily'
                  ? 'bg-[#5C3D28] text-white shadow-sm'
                  : 'text-[#75665B] hover:bg-[#EFE3D5]'
              }`}
            >
              รายวัน (7 วันล่าสุด)
            </button>
            <button
              onClick={() => setChartMode('monthly')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                chartMode === 'monthly'
                  ? 'bg-[#5C3D28] text-white shadow-sm'
                  : 'text-[#75665B] hover:bg-[#EFE3D5]'
              }`}
            >
              รายเดือน (5 เดือนย้อนหลัง)
            </button>
          </div>
        </div>

        <div className="mt-6 h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentChartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="reportAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5C3D28" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5C3D28" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#EFEBE4"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: '#E8E2D9' }}
                tick={{ fill: '#544439', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `฿${val / 1000}K`}
                tick={{ fill: '#544439', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, 'ยอดขาย']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#5C3D28"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#reportAreaGradient)"
                dot={{ stroke: '#5C3D28', strokeWidth: 2.5, r: 4, fill: '#FFFFFF' }}
                activeDot={{ r: 7, fill: '#5C3D28', stroke: '#FFFFFF', strokeWidth: 2.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: 3) Top 5 สินค้าขายดี & 4) ยอดขายแยกตามหมวดหมู่ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3) Top 5 สินค้าขายดี */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#5C3D28]" />
              <div>
                <h2 className="text-base font-bold text-[#2B1A12]">
                  Top 5 สินค้าขายดี
                </h2>
                <p className="text-xs font-semibold text-[#75665B]">อันดับสินค้าที่มียอดสั่งซื้อสูงสุด</p>
              </div>
            </div>
            <span className="text-xs text-[#5C3D28] font-bold bg-[#FAF4ED] px-3 py-1 rounded-full border border-[#EFE3D5]">
              ยอดขายสูงสุด
            </span>
          </div>

          <div className="mt-4 divide-y divide-[#EFEBE4]">
            {bestSellers.map((item) => {
              const Icon = categoryIcons[item.category] || Coffee;
              return (
                <div
                  key={item.name}
                  className="py-3.5 flex items-center justify-between group hover:bg-[#FAF8F5] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center text-xs font-extrabold text-[#75665B] group-hover:text-[#5C3D28]">
                      0{item.rank}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28]">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#2B1A12]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#75665B] font-medium">
                        {item.nameTh} ({item.category})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-extrabold text-[#2B1A12]">
                      {item.formattedRevenue}
                    </p>
                    <p className="text-xs font-semibold text-[#75665B]">
                      ขายได้ {item.sold} แก้ว/ชิ้น
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4) ยอดขายแยกตามหมวดหมู่ */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#5C3D28]" />
              <div>
                <h2 className="text-base font-bold text-[#2B1A12]">
                  ยอดขายแยกตามหมวดหมู่
                </h2>
                <p className="text-xs font-semibold text-[#75665B]">สัดส่วนรายได้ 3 หมวดสินค้าหลัก</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#5C3D28]">รวม 100%</span>
          </div>

          <div className="mt-6 space-y-5">
            {categorySales.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#5C3D28]" />
                    <span className="font-bold text-[#2B1A12]">
                      {cat.category} ({cat.categoryTh})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#2B1A12]">
                      {cat.formattedRevenue}
                    </span>
                    <span className="text-[#75665B] font-bold w-12 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-[#FAF4ED] rounded-full overflow-hidden border border-[#EFE3D5]">
                  <div
                    className="h-full rounded-full bg-[#5C3D28]"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-[#FAF4ED] border border-[#EFE3D5] text-xs text-[#544439] leading-relaxed font-medium">
            หมวดหมู่ <strong className="text-[#5C3D28] font-bold">กาแฟ (Coffee)</strong> สร้างรายได้หลักให้ร้านคิดเป็น 58.8%
            ตามด้วยเครื่องดื่ม Non-Coffee 23.6% และขนมอบ Bakery 17.6%
          </div>
        </div>
      </div>
    </div>
  );
}
