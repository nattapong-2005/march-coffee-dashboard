import React from 'react';
import { categorySales } from '@/data/dashboard';

export function CategorySales() {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE5DE] p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE4]">
          <div>
            <h2 className="text-base font-bold text-[#1F1916]">
              Sales by Category
            </h2>
            <p className="text-xs text-[#8A7F75] mt-0.5">
              ยอดขายแยกตามหมวดสินค้า
            </p>
          </div>
          <span className="text-xs text-[#9E948C]">วันนี้ (Today)</span>
        </div>

        {/* Horizontal Stacked Bar */}
        <div className="mt-5">
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#F2ECE4]">
            {categorySales.map((item) => (
              <div
                key={item.category}
                style={{ width: `${item.percentage}%` }}
                className={`${item.colorClass} transition-all duration-500`}
                title={`${item.category}: ${item.percentage}%`}
              />
            ))}
          </div>

          {/* Detailed Progress Breakdown */}
          <div className="mt-6 space-y-4">
            {categorySales.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${cat.colorClass}`}
                    />
                    <span className="font-medium text-[#2C2420]">
                      {cat.category}
                    </span>
                    <span className="text-[#8C8278]">({cat.categoryTh})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1F1916]">
                      {cat.formattedRevenue}
                    </span>
                    <span className="text-[#8C8278] w-11 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                {/* Subtle individual track */}
                <div className="h-1.5 w-full bg-[#F5F1EA] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.colorClass}`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-[#F2ECE4] text-[11px] text-[#8C8278] flex justify-between">
        <span>รวมทุกหมวดหมู่วันนี้</span>
        <span className="font-semibold text-[#1F1916]">฿18,450 (100%)</span>
      </div>
    </div>
  );
}
