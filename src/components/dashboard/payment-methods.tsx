import React from 'react';
import { paymentMethods } from '@/data/dashboard';
import { QrCode, Banknote, CreditCard } from 'lucide-react';

const paymentIcons: Record<string, React.ElementType> = {
  QrCode,
  Banknote,
  CreditCard,
};

const paymentConfig: Record<
  string,
  {
    iconBox: string;
    progressBar: string;
    percentText: string;
  }
> = {
  promptpay: {
    iconBox: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0284C7]',
    progressBar: 'bg-[#0284C7]',
    percentText: 'text-[#0284C7]',
  },
  cash: {
    iconBox: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]',
    progressBar: 'bg-[#16A34A]',
    percentText: 'text-[#16A34A]',
  },
  credit_card: {
    iconBox: 'bg-[#F5F3FF] border-[#DDD6FE] text-[#7C3AED]',
    progressBar: 'bg-[#7C3AED]',
    percentText: 'text-[#7C3AED]',
  },
};

export function PaymentMethods() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
        <div>
          <h2 className="text-base font-bold text-[#2B1A12]">
            Payment Methods
          </h2>
          <p className="text-xs font-semibold text-[#75665B] mt-0.5">
            สัดส่วนการชำระเงินวันนี้
          </p>
        </div>
        <span className="text-xs font-semibold text-[#75665B] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E2D9]">
          142 รายการ
        </span>
      </div>

      {/* Mini Proportion Stacked Bar */}
      <div className="mt-4 h-2.5 w-full rounded-full overflow-hidden flex bg-[#FAF8F5] border border-[#E8E2D9]">
        {paymentMethods.map((pm) => {
          const config = paymentConfig[pm.id] || { progressBar: 'bg-[#75665B]' };
          return (
            <div
              key={pm.id}
              style={{ width: `${pm.percentage}%` }}
              className={`${config.progressBar} transition-all duration-500`}
              title={`${pm.name}: ${pm.percentage}%`}
            />
          );
        })}
      </div>

      <div className="mt-5 space-y-4">
        {paymentMethods.map((pm) => {
          const Icon = paymentIcons[pm.iconName] || Banknote;
          const config = paymentConfig[pm.id] || {
            iconBox: 'bg-[#FAF8F5] border-[#E8E2D9] text-[#75665B]',
            progressBar: 'bg-[#75665B]',
            percentText: 'text-[#75665B]',
          };

          return (
            <div key={pm.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center ${config.iconBox}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#2B1A12]">{pm.name}</span>
                    <span className="text-[#75665B] ml-1.5 text-[11px] font-medium">
                      ({pm.nameTh})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#2B1A12]">
                    {pm.formattedAmount}
                  </span>
                  <span className={`font-extrabold w-10 text-right ${config.percentText}`}>
                    {pm.percentage}%
                  </span>
                </div>
              </div>

              {/* Individual Track */}
              <div className="h-1.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8E2D9]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.progressBar}`}
                  style={{ width: `${pm.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

