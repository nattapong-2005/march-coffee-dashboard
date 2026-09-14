'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { weeklySalesTrend, revenuePeriodSummary } from '@/data/dashboard';
import { TrendingUp } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { dayTh: string; orders: number } }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white border-2 border-[#5C3D28] p-3 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-[#2B1A12]">
          {label} ({data.payload.dayTh})
        </p>
        <p className="text-[#5C3D28] font-extrabold text-sm mt-1">
          ฿{data.value.toLocaleString()}
        </p>
        <p className="text-[#75665B] mt-0.5 font-medium">
          {data.payload.orders} ออเดอร์ (Orders)
        </p>
      </div>
    );
  }
  return null;
};

import { DailySalesData } from '@/data/types';

interface SalesChartProps {
  data?: DailySalesData[];
  periodSummary?: {
    today: { amount: string; labelTh: string; labelEn: string; change: string; isPositive: boolean };
    thisMonth: { amount: string; labelTh: string; labelEn: string; change: string; isPositive: boolean };
  };
}

export function SalesChart({
  data = weeklySalesTrend,
  periodSummary = revenuePeriodSummary,
}: SalesChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
      {/* Header & Revenue Summary Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#2B1A12]">
              Sales Overview
            </h2>
            <span className="text-xs text-[#75665B] font-semibold">
              ภาพรวมยอดขายย้อนหลัง 7 วัน
            </span>
          </div>
          <p className="text-xs text-[#75665B] font-medium mt-0.5">
            บันทึกข้อมูลรายได้ประจำวันจากระบบ POS (บาท)
          </p>
        </div>

        {/* Revenue Period Summary */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <div className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
            <p className="text-xs font-bold text-[#75665B]">
              {periodSummary.today.labelTh}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-base sm:text-lg font-extrabold text-[#2B1A12]">
                {periodSummary.today.amount}
              </span>
              <span className="text-xs text-[#1E5E3A] font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {periodSummary.today.change}
              </span>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
            <p className="text-xs font-bold text-[#75665B]">
              {periodSummary.thisMonth.labelTh}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-base sm:text-lg font-extrabold text-[#2B1A12]">
                {periodSummary.thisMonth.amount}
              </span>
              <span className="text-xs text-[#1E5E3A] font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {periodSummary.thisMonth.change}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="warmCoffeeFill" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="day"
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#5C3D28"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#warmCoffeeFill)"
              dot={{ stroke: '#5C3D28', strokeWidth: 2.5, r: 4, fill: '#FFFFFF' }}
              activeDot={{ r: 7, fill: '#5C3D28', stroke: '#FFFFFF', strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
