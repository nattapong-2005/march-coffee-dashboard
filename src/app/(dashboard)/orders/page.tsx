'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockOrders, ordersSummary } from '@/data/orders';
import { Order } from '@/data/types';
import {
  Search,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
  CreditCard,
  User,
  Coffee,
} from 'lucide-react';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((i) =>
          i.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        selectedStatus === 'All' || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Orders"
        subtitle="ประวัติรายการสั่งซื้อ • แสดงข้อมูลคำสั่งซื้อจากระบบ Java POS พร้อมดูรายละเอียดรายการสินค้า"
      >
        <button
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs font-bold text-[#5C3D28] hover:bg-[#FAF4ED] transition-colors"
          onClick={() => {
            setSearchTerm('');
            setSelectedStatus('All');
          }}
        >
          <span>ล้างตัวกรอง (Reset)</span>
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#75665B]">Total Orders</p>
            <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] flex items-center justify-center text-[#5C3D28]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {ordersSummary.totalToday}
          </p>
          <p className="text-xs font-semibold text-[#75665B] mt-1">ออเดอร์ทั้งหมดวันนี้</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#1E5E3A]">Completed</p>
            <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] flex items-center justify-center text-[#1E5E3A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {ordersSummary.completed}
          </p>
          <p className="text-xs font-bold text-[#1E5E3A] mt-1">เสร็จสิ้นแล้ว</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#8A4B08]">Preparing</p>
            <div className="w-8 h-8 rounded-lg bg-[#FEF3E2] flex items-center justify-center text-[#8A4B08]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {ordersSummary.preparing}
          </p>
          <p className="text-xs font-bold text-[#8A4B08] mt-1">กำลังเตรียม</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#A82020]">Cancelled</p>
            <div className="w-8 h-8 rounded-lg bg-[#FDF1F1] flex items-center justify-center text-[#A82020]">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {ordersSummary.cancelled}
          </p>
          <p className="text-xs font-semibold text-[#75665B] mt-1">ยกเลิก</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 space-y-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#75665B]" />
            <input
              type="text"
              placeholder="ค้นหา Order ID หรือชื่อลูกค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-[#2B1A12] placeholder:text-[#8C7E73] focus:outline-none focus:border-[#5C3D28] focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Completed', 'Preparing', 'Pending', 'Cancelled'].map(
              (status) => {
                const isActive = selectedStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#5C3D28] text-white shadow-sm'
                        : 'bg-[#FAF4ED] text-[#5C3D28] hover:bg-[#F0E6D8] border border-[#EFE3D5]'
                    }`}
                  >
                    {status === 'All' ? 'ทั้งหมด (All)' : status}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-xs font-bold uppercase tracking-wider text-[#75665B]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">วันที่ / เวลา</th>
                <th className="py-3.5 px-4">ลูกค้า</th>
                <th className="py-3.5 px-4 text-center">จำนวนสินค้า</th>
                <th className="py-3.5 px-4">ยอดรวม</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 text-right">รายละเอียดสินค้า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE4] text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#75665B] font-semibold">
                    ไม่พบรายการคำสั่งซื้อที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FAF8F5] transition-colors duration-150 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-3.5 px-4 font-extrabold text-[#5C3D28]">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 text-[#544439]">
                      <div className="font-semibold">{order.date}</div>
                      <div className="text-[11px] text-[#75665B] font-mono">
                        {order.time} น.
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2B1A12]">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#2B1A12]">
                      {order.itemCountSummary}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#2B1A12]">
                      {order.formattedTotal}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FAF4ED] text-[#5C3D28] hover:bg-[#F0E6D8] border border-[#EFE3D5] font-bold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูสินค้า</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl border border-[#E8E2D9] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D9]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-[#2B1A12]">
                    {selectedOrder.id}
                  </span>
                  <StatusBadge status={selectedOrder.status} size="sm" />
                </div>
                <p className="text-xs font-semibold text-[#75665B] mt-1">
                  {selectedOrder.date} • {selectedOrder.time} น.
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl border border-[#E8E2D9] text-[#544439] hover:bg-[#FAF8F5] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer & Payment Info */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs">
              <div className="space-y-0.5">
                <p className="text-[#75665B] flex items-center gap-1 font-semibold text-[11px]">
                  <User className="w-3.5 h-3.5 text-[#5C3D28]" /> ลูกค้า
                </p>
                <p className="font-bold text-[#2B1A12]">
                  {selectedOrder.customerName}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[#75665B] flex items-center gap-1 font-semibold text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-[#5C3D28]" /> ช่องทางชำระเงิน
                </p>
                <p className="font-bold text-[#2B1A12]">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            {/* Item Details List */}
            <div>
              <p className="text-xs font-bold text-[#442B1A] uppercase tracking-wider mb-2.5">
                รายการสินค้าใน Order ({selectedOrder.items.length} รายการ)
              </p>
              <div className="divide-y divide-[#EFEBE4] border border-[#E8E2D9] rounded-2xl overflow-hidden bg-white">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-[#FAF8F5] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28]">
                        <Coffee className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#2B1A12]">{item.name}</p>
                        <p className="text-xs font-semibold text-[#75665B]">
                          ราคา ฿{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-extrabold text-[#2B1A12]">
                      ฿{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#75665B]">ยอดรวมทั้งสิ้น (Net Total)</span>
                <p className="text-xs text-[#1E5E3A] font-bold">รวมภาษีมูลค่าเพิ่มแล้ว (VAT Included)</p>
              </div>
              <div className="text-2xl font-extrabold text-[#2B1A12]">
                {selectedOrder.formattedTotal}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 rounded-xl bg-[#5C3D28] text-white text-xs font-bold hover:bg-[#442B1A] transition-colors shadow-sm"
            >
              ปิดหน้าต่าง (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
