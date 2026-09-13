import React from 'react';
import { categorySales } from '@/data/dashboard';

export function CategorySales() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 flex flex-col justify-between shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
          <div>
            <h2 className="text-base font-bold text-[#2B1A12]">
              Sales by Category
            </h2>
            <p className="text-xs font-semibold text-[#75665B] mt-0.5">
              ยอดขายแยกตามหมวดสินค้า
            </p>
          </div>
          <span className="text-xs font-semibold text-[#75665B] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E2D9]">
            วันนี้ (Today)
          </span>
        </div>

        {/* Horizontal Stacked Bar */}
        <div className="mt-5">
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#FAF8F5] border border-[#E8E2D9]">
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
                    <span className="font-bold text-[#2B1A12]">
                      {cat.category}
                    </span>
                    <span className="text-[#75665B] font-medium">({cat.categoryTh})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#2B1A12]">
                      {cat.formattedRevenue}
                    </span>
                    <span className="font-bold text-[#75665B] w-12 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                {/* Subtle individual track */}
                <div className="h-1.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8E2D9]">
                  <div
                    className={`h-full rounded-full ${cat.colorClass} transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-[#E8E2D9] text-xs text-[#75665B] flex justify-between font-medium">
        <span>รวมทุกหมวดหมู่วันนี้</span>
        <span className="font-extrabold text-[#2B1A12]">฿18,450 (100%)</span>
      </div>
    </div>
  );
}

