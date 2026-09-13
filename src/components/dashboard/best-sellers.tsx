import React from 'react';
import { bestSellers } from '@/data/dashboard';
import { Coffee, Cake, CupSoda } from 'lucide-react';

const categoryIcon = {
  Coffee: Coffee,
  'Non-Coffee': CupSoda,
  Bakery: Cake,
};

export function BestSellers() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
        <div>
          <h2 className="text-base font-bold text-[#2B1A12]">
            Best Selling Menu
          </h2>
          <p className="text-xs font-semibold text-[#75665B] mt-0.5">
            5 อันดับเมนูขายดีประจำวัน
          </p>
        </div>
        <span className="text-xs text-[#5C3D28] font-bold bg-[#FAF4ED] px-3 py-1 rounded-full border border-[#EFE3D5]">
          Top 5 Today
        </span>
      </div>

      <div className="mt-4 divide-y divide-[#EFEBE4]">
        {bestSellers.map((item) => {
          const Icon = categoryIcon[item.category] || Coffee;
          return (
            <div
              key={item.name}
              className="py-3.5 flex items-center justify-between group hover:bg-[#FAF8F5] -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className="w-6 text-center text-xs font-extrabold text-[#75665B] group-hover:text-[#5C3D28] transition-colors">
                  0{item.rank}
                </div>

                {/* Thumbnail Icon */}
                <div className="w-9 h-9 rounded-xl bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28]">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#2B1A12]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#75665B] font-medium">
                    {item.nameTh} • <span className="font-semibold text-[#544439]">{item.category}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs sm:text-sm font-extrabold text-[#2B1A12]">
                  {item.formattedRevenue}
                </p>
                <div className="flex items-center justify-end gap-1.5 text-xs text-[#75665B]">
                  <span className="font-semibold">{item.sold} แก้ว/ชิ้น</span>
                  <span className="text-[#1E5E3A] font-bold text-[11px]">
                    {item.growth}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
