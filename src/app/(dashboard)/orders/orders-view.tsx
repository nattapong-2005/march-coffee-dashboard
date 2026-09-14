'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
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
  RefreshCw,
} from 'lucide-react';

interface OrdersSummary {
  totalToday: number;
  completed: number;
  preparing: number;
  pending: number;
  cancelled: number;
}

interface OrdersViewProps {
  initialOrders: Order[];
  initialSummary: OrdersSummary;
}

export function OrdersView({ initialOrders, initialSummary }: OrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [summary, setSummary] = useState<OrdersSummary>(initialSummary);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to refresh orders:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
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
  }, [orders, searchTerm, selectedStatus]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Orders"
        subtitle="ประวัติรายการสั่งซื้อ • แสดงข้อมูลคำสั่งซื้อจริงจากระบบ Java POS / PostgreSQL"
      >
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E8E2D9] text-xs font-bold text-[#5C3D28] hover:bg-[#FAF4ED] transition-colors cursor-pointer"
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('All');
            }}
          >
            <span>ล้างตัวกรอง (Reset)</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5C3D28] text-white text-xs font-bold hover:bg-[#442B1A] disabled:opacity-75 transition-all shadow-sm cursor-pointer"
            title="รีเฟรชออเดอร์จาก Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรช'}</span>
          </button>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#75665B]">Total Orders</p>
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {summary.totalToday}
          </p>
          <p className="text-xs font-semibold text-[#75665B] mt-1">ออเดอร์ทั้งหมด</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#047857]">Completed</p>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#047857]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {summary.completed}
          </p>
          <p className="text-xs font-bold text-[#047857] mt-1">ชำระเงินแล้ว (PAID)</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#B45309]">Preparing</p>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#B45309]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {summary.preparing}
          </p>
          <p className="text-xs font-bold text-[#B45309] mt-1">กำลังเตรียม</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#B91C1C]">Cancelled</p>
            <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#B91C1C]">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {summary.cancelled}
          </p>
          <p className="text-xs font-bold text-[#B91C1C] mt-1">ยกเลิก</p>
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
            {[
              { id: 'All', label: 'ทั้งหมด (All)', activeColor: 'bg-[#5C3D28] text-white' },
              { id: 'Completed', label: 'Completed (สำเร็จ)', activeColor: 'bg-[#047857] text-white' },
              { id: 'Preparing', label: 'Preparing (กำลังทำ)', activeColor: 'bg-[#B45309] text-white' },
              { id: 'Pending', label: 'Pending (รอดำเนินการ)', activeColor: 'bg-[#1D4ED8] text-white' },
              { id: 'Cancelled', label: 'Cancelled (ยกเลิก)', activeColor: 'bg-[#B91C1C] text-white' },
            ].map((statusTab) => {
              const isActive = selectedStatus === statusTab.id;
              return (
                <button
                  key={statusTab.id}
                  onClick={() => setSelectedStatus(statusTab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? `${statusTab.activeColor} shadow-sm`
                      : 'bg-[#FAF8F5] text-[#75665B] hover:bg-[#F2ECE4] border border-[#E8E2D9]'
                  }`}
                >
                  {statusTab.label}
                </button>
              );
            })}
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
                <th className="py-3.5 px-4">ลูกค้า / แคชเชียร์</th>
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
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FAF4ED] text-[#5C3D28] hover:bg-[#F0E6D8] border border-[#EFE3D5] font-bold text-xs transition-colors cursor-pointer"
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
            className="bg-white rounded-3xl border border-[#E8E2D9] shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
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
                className="p-1.5 rounded-xl border border-[#E8E2D9] text-[#544439] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer & Staff Info + Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs">
              <div className="space-y-1">
                <p className="text-[#75665B] flex items-center gap-1 font-semibold text-[11px]">
                  <User className="w-3.5 h-3.5 text-[#5C3D28]" /> พนักงาน / แคชเชียร์ (Staff)
                </p>
                <div>
                  <p className="font-bold text-[#2B1A12] flex items-center gap-1.5">
                    <span>{selectedOrder.staffName || selectedOrder.customerName}</span>
                    {selectedOrder.staffRole && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-[#5C3D28] text-white">
                        {selectedOrder.staffRole}
                      </span>
                    )}
                  </p>
                  {selectedOrder.userId && (
                    <p className="text-[10px] text-[#75665B] font-mono mt-0.5">
                      User ID: {selectedOrder.userId}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[#75665B] flex items-center gap-1 font-semibold text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-[#5C3D28]" /> การชำระเงิน (Payment)
                </p>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs border ${
                        selectedOrder.paymentMethod === 'PromptPay'
                          ? 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]'
                          : selectedOrder.paymentMethod === 'Cash'
                          ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                          : 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]'
                      }`}
                    >
                      {selectedOrder.paymentMethod}
                    </span>
                    {selectedOrder.payment?.paymentId && (
                      <span className="text-[10px] font-mono text-[#75665B]">
                        {selectedOrder.payment.paymentId}
                      </span>
                    )}
                  </div>
                  {selectedOrder.payment && (
                    <div className="text-[11px] text-[#75665B] mt-1 space-y-0.5">
                      <p>รับเงิน: <strong className="text-[#2B1A12]">฿{selectedOrder.payment.amountPaid}</strong> • ทอน: ฿{selectedOrder.payment.changeAmount}</p>
                    </div>
                  )}
                </div>
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
                    className="p-3.5 flex items-start justify-between text-xs hover:bg-[#FAF8F5] transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] border border-[#EFE3D5] flex items-center justify-center text-[#5C3D28] shrink-0 mt-0.5">
                        <Coffee className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-[#2B1A12]">{item.name}</p>
                          {item.itemId && (
                            <span className="text-[10px] font-mono bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-[#E8E2D9] text-[#75665B]">
                              {item.itemId}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#75665B] mt-0.5">
                          ราคา ฿{item.price} × {item.quantity}
                        </p>

                        {/* Customization Badges from ER Diagram */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {item.sweetnessLevel && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF6F0] text-[#8C5D35] border border-[#EFE3D5]">
                              หวาน: {item.sweetnessLevel}
                            </span>
                          )}
                          {item.extraShots ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                              +{item.extraShots} ช็อต
                            </span>
                          ) : null}
                          {item.warmed ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]">
                              🔥 อุ่นร้อน (Warmed)
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-extrabold text-[#2B1A12]">
                      ฿{item.subtotal !== undefined ? item.subtotal : item.price * item.quantity}
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
              className="w-full py-3 rounded-xl bg-[#5C3D28] text-white text-xs font-bold hover:bg-[#442B1A] transition-colors shadow-sm cursor-pointer"
            >
              ปิดหน้าต่าง (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
