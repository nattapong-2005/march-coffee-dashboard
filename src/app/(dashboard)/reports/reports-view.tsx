'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { BestSeller, CategorySale, DailySalesData } from '@/data/types';
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
  DollarSign,
  CupSoda,
  Cake,
  RefreshCw,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  Coffee: Coffee,
  'Non-Coffee': CupSoda,
  Bakery: Cake,
};

export interface ReportsData {
  dailySales: string;
  todayOrders: number;
  monthlySales: string;
  monthOrders: number;
  avgDailySales: string;
  avgDailyNote?: string;
  totalOrders: number;
  totalRevenue?: string;
  weeklySalesTrend: DailySalesData[];
  monthlyTrend: Array<{ label: string; revenue: number; orders: number }>;
  bestSellers: BestSeller[];
  categorySales: CategorySale[];
}

interface ReportsViewProps {
  initialData: ReportsData;
}

export function ReportsView({ initialData }: ReportsViewProps) {
  const [data, setData] = useState<ReportsData>(initialData);
  const [chartMode, setChartMode] = useState<'daily' | 'monthly'>('daily');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/reports', { cache: 'no-store' });
      if (res.ok) {
        const fresh = await res.json();
        setData(fresh);
      }
    } catch (err) {
      console.error('Failed to refresh reports:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentChartData =
    chartMode === 'daily'
      ? data.weeklySalesTrend.map((d) => ({
          label: d.day,
          fullDate: d.dayTh,
          revenue: d.revenue,
          orders: d.orders,
        }))
      : data.monthlyTrend.map((m) => ({
          label: m.label,
          fullDate: `เดือน ${m.label}`,
          revenue: m.revenue,
          orders: m.orders,
        }));

  const coffeeCat = data.categorySales.find((c) => c.category === 'Coffee');
  const bakeryCat = data.categorySales.find((c) => c.category === 'Bakery');
  const nonCoffeeCat = data.categorySales.find((c) => c.category === 'Non-Coffee');

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Reports"
        subtitle="รายงานและสถิติยอดขาย • สรุปยอดขายจริงจากฐานข้อมูล PostgreSQL, สินค้าขายดี และสัดส่วนหมวดหมู่"
      >
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5C3D28] text-white text-xs font-bold hover:bg-[#442B1A] disabled:opacity-75 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล'}</span>
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
            {data.dailySales}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {data.todayOrders > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-[#1E5E3A]" />
                <span className="text-[#1E5E3A]">ข้อมูลจริงจากระบบ Java POS</span>
                <span className="text-[#75665B] font-medium ml-1">• {data.todayOrders} ออเดอร์</span>
              </>
            ) : (
              <span className="text-[#8C7E73] font-medium">
                ข้อมูลจริงจากระบบ Java POS • 0 ออเดอร์ (ยังไม่มียอดขายวันนี้)
              </span>
            )}
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
            {data.monthlySales}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#1E5E3A] font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>เดือนปัจจุบัน</span>
            <span className="text-[#75665B] font-medium ml-1">
              • รวม {data.monthOrders ?? data.totalOrders} ออเดอร์
            </span>
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
            {data.avgDailySales}
          </div>
          <p className="text-xs font-medium text-[#75665B]">
            {data.avgDailyNote || 'ประเมินจากข้อมูลการขายจริงในฐานข้อมูล'}
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
              แสดงการเติบโตของรายได้ (บาท) จากระบบบันทึกคำสั่งซื้อจริง
            </p>
          </div>

          {/* Toggle Daily / Monthly */}
          <div className="flex items-center p-1 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs">
            <button
              onClick={() => setChartMode('daily')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'daily'
                  ? 'bg-[#5C3D28] text-white shadow-sm'
                  : 'text-[#75665B] hover:bg-[#EFE3D5]'
              }`}
            >
              รายวัน (7 วันล่าสุด)
            </button>
            <button
              onClick={() => setChartMode('monthly')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
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
                tickFormatter={(val) => `฿${Number(val).toLocaleString()}`}
                tick={{ fill: '#544439', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                formatter={(val: unknown) => [`฿${Number(val).toLocaleString()}`, 'ยอดขาย']}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]?.payload) {
                    const item = payload[0].payload as { fullDate?: string; orders?: number };
                    const orderText = item.orders !== undefined ? ` (${item.orders} ออเดอร์)` : '';
                    return `${item.fullDate || label}${orderText}`;
                  }
                  return String(label);
                }}
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
                <p className="text-xs font-semibold text-[#75665B]">อันดับสินค้าที่มียอดสั่งซื้อสูงสุดจาก Database</p>
              </div>
            </div>
            <span className="text-xs text-[#5C3D28] font-bold bg-[#FAF4ED] px-3 py-1 rounded-full border border-[#EFE3D5]">
              ยอดขายสูงสุด
            </span>
          </div>

          <div className="mt-4 divide-y divide-[#EFEBE4]">
            {data.bestSellers.map((item) => {
              const Icon = categoryIcons[item.category] || Coffee;
              const rankBadge =
                item.rank === 1
                  ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                  : item.rank === 2
                  ? 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
                  : item.rank === 3
                  ? 'bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]'
                  : 'bg-[#FAF8F5] text-[#75665B] border-[#E8E2D9]';

              const categoryBadge =
                item.category === 'Coffee'
                  ? 'bg-[#FDF4EB] text-[#8B4513] border-[#F2D6BC]'
                  : item.category === 'Non-Coffee'
                  ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                  : 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]';

              return (
                <div
                  key={item.name}
                  className="py-3.5 flex items-center justify-between group hover:bg-[#FAF8F5] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg text-center text-xs font-extrabold flex items-center justify-center border ${rankBadge}`}
                    >
                      {item.rank}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28]">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#2B1A12]">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#75665B] font-medium">{item.nameTh}</span>
                        <span className={`text-[10px] px-2 py-0.2 rounded-md font-bold border ${categoryBadge}`}>
                          {item.category}
                        </span>
                      </div>
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
                <p className="text-xs font-semibold text-[#75665B]">สัดส่วนรายได้จากข้อมูลใน Database</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#5C3D28]">รวม 100%</span>
          </div>

          <div className="mt-6 space-y-5">
            {data.categorySales.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cat.colorClass}`} />
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

                <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8E2D9]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cat.colorClass}`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-[#FAF4ED] border border-[#EFE3D5] text-xs text-[#544439] leading-relaxed font-medium">
            {bakeryCat && coffeeCat ? (
              <>
                หมวดหมู่ <strong className="text-[#EA580C] font-bold">เบเกอรี่ (Bakery)</strong> คิดเป็น {bakeryCat.percentage}% ({bakeryCat.formattedRevenue})
                และหมวดหมู่ <strong className="text-[#8B4513] font-bold">กาแฟ (Coffee)</strong> คิดเป็น {coffeeCat.percentage}% ({coffeeCat.formattedRevenue})
                {nonCoffeeCat && nonCoffeeCat.percentage > 0 ? ` และ Non-Coffee ${nonCoffeeCat.percentage}%` : ''}
              </>
            ) : (
              'กำลังคำนวณสัดส่วนหมวดหมู่จากข้อมูลคำสั่งซื้อในระบบ...'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
