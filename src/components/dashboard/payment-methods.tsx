import React from 'react';
import { paymentMethods } from '@/data/dashboard';
import { QrCode, Banknote, CreditCard } from 'lucide-react';

const paymentIcons: Record<string, React.ElementType> = {
  QrCode,
  Banknote,
  CreditCard,
};

export function PaymentMethods() {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE5DE] p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE4]">
        <div>
          <h2 className="text-base font-bold text-[#1F1916]">
            Payment Methods
          </h2>
          <p className="text-xs text-[#8A7F75] mt-0.5">
            สัดส่วนการชำระเงินวันนี้
          </p>
        </div>
        <span className="text-xs text-[#8C8278]">Total 142 txns</span>
      </div>

      <div className="mt-5 space-y-4">
        {paymentMethods.map((pm) => {
          const Icon = paymentIcons[pm.iconName] || Banknote;
          return (
            <div key={pm.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F1EA] border border-[#EBE5DC] flex items-center justify-center text-[#6B5B4E]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#1F1916]">{pm.name}</span>
                    <span className="text-[#8C8278] ml-1.5 text-[11px]">({pm.nameTh})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1F1916]">{pm.formattedAmount}</span>
                  <span className="font-bold text-[#8B5E34] w-9 text-right">{pm.percentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-[#F5F1EA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5E34] rounded-full transition-all duration-500"
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
