import React from 'react';
import { bestSellers } from '@/data/dashboard';
import { Coffee, Cake, CupSoda } from 'lucide-react';

const categoryIcon = {
  Coffee: Coffee,
  'Non-Coffee': CupSoda,
  Bakery: Cake,
};

const categoryStyles: Record<
  string,
  { badge: string; iconBox: string }
> = {
  Coffee: {
    badge: 'bg-[#FDF4EB] text-[#8B4513] border-[#F2D6BC]',
    iconBox: 'bg-[#FDF4EB] text-[#8B4513] border-[#F2D6BC]',
  },
  'Non-Coffee': {
    badge: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    iconBox: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  },
  Bakery: {
    badge: 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]',
    iconBox: 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]',
  },
};

import { BestSeller } from '@/data/types';

interface BestSellersProps {
  items?: BestSeller[];
}

export function BestSellers({ items = bestSellers }: BestSellersProps) {
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
        {items.map((item) => {
          const Icon = categoryIcon[item.category] || Coffee;
          const style = categoryStyles[item.category] || {
            badge: 'bg-[#FAF8F5] text-[#75665B] border-[#E8E2D9]',
            iconBox: 'bg-[#FAF8F5] text-[#75665B] border-[#E8E2D9]',
          };

          const rankBadge =
            item.rank === 1
              ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
              : item.rank === 2
              ? 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
              : item.rank === 3
              ? 'bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]'
              : 'bg-[#FAF8F5] text-[#75665B] border-[#E8E2D9]';

          return (
            <div
              key={item.name}
              className="py-3.5 flex items-center justify-between group hover:bg-[#FAF8F5] -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div
                  className={`w-6 h-6 rounded-lg text-center text-xs font-extrabold flex items-center justify-center border ${rankBadge}`}
                >
                  {item.rank}
                </div>

                {/* Thumbnail Icon */}
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${style.iconBox}`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#2B1A12]">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-[#75665B] font-medium">{item.nameTh}</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-md font-bold border ${style.badge}`}>
                      {item.category}
                    </span>
                  </div>
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

