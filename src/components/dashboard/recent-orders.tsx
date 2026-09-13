import React from 'react';
import { recentOrders } from '@/data/dashboard';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
        <div>
          <h2 className="text-base font-bold text-[#2B1A12]">
            Recent Orders
          </h2>
          <p className="text-xs font-semibold text-[#75665B] mt-0.5">
            รายการคำสั่งซื้อล่าสุดวันนี้
          </p>
        </div>
        <Link
          href="/orders"
          className="text-xs text-[#5C3D28] hover:text-[#442B1A] font-bold flex items-center gap-1 transition-colors"
        >
          <span>ดูรายการทั้งหมด (142)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-xs font-bold uppercase tracking-wider text-[#75665B]">
              <th className="py-3.5 px-3">Order ID</th>
              <th className="py-3.5 px-3">Customer</th>
              <th className="py-3.5 px-3">Items</th>
              <th className="py-3.5 px-3">Payment</th>
              <th className="py-3.5 px-3">Total</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEBE4] text-xs">
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[#FAF8F5] transition-colors duration-150"
              >
                <td className="py-3.5 px-3 font-bold text-[#5C3D28]">
                  {order.id}
                </td>
                <td className="py-3.5 px-3 font-bold text-[#2B1A12]">
                  {order.customerName}
                </td>
                <td className="py-3.5 px-3 text-[#544439] font-medium">
                  {order.itemCountSummary}
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#FAF4ED] text-[#5C3D28] text-xs font-bold border border-[#EFE3D5]">
                    {order.paymentMethod}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-extrabold text-[#2B1A12]">
                  {order.formattedTotal}
                </td>
                <td className="py-3.5 px-3">
                  <StatusBadge status={order.status} size="sm" />
                </td>
                <td className="py-3.5 px-3 text-right text-[#544439] font-mono text-xs font-semibold">
                  {order.time} น.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
