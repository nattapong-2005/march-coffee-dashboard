'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { mockProducts } from '@/data/products';
import { Coffee, Search, Package, DollarSign } from 'lucide-react';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const productsWithRevenue = useMemo(() => {
    return mockProducts.map((p) => {
      const revenue = p.price * p.soldToday;
      return {
        ...p,
        revenue,
        formattedRevenue: `฿${revenue.toLocaleString()}`,
      };
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return productsWithRevenue.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nameTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [productsWithRevenue, searchTerm, selectedCategory]);

  const totalSold = productsWithRevenue.reduce((acc, p) => acc + p.soldToday, 0);
  const totalProductRevenue = productsWithRevenue.reduce((acc, p) => acc + p.revenue, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Products"
        subtitle="แสดงข้อมูลสินค้าเพื่อดูภาพรวม • ซิงค์ข้อมูลกับระบบ Java POS เพื่อดูยอดขายและปริมาณที่ขายได้ของแต่ละรายการ"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#75665B]">จำนวนสินค้าทั้งหมด</p>
            <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] flex items-center justify-center text-[#5C3D28]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {mockProducts.length} รายการ
          </p>
          <p className="text-xs font-semibold text-[#75665B] mt-1">3 หมวดหมู่ (Coffee, Non-Coffee, Bakery)</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#5C3D28]">จำนวนที่ขายได้รวม</p>
            <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] flex items-center justify-center text-[#5C3D28]">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            {totalSold} ชิ้น/แก้ว
          </p>
          <p className="text-xs font-bold text-[#5C3D28] mt-1">ยอดจำหน่ายรวมของวัน</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#1E5E3A]">ยอดขายของสินค้ารวม</p>
            <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] flex items-center justify-center text-[#1E5E3A]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B1A12] mt-2">
            ฿{totalProductRevenue.toLocaleString()}
          </p>
          <p className="text-xs font-bold text-[#1E5E3A] mt-1">รายได้รวมจากการจำหน่ายเมนู</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 sm:p-5 space-y-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#75665B]" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-[#2B1A12] placeholder:text-[#8C7E73] focus:outline-none focus:border-[#5C3D28] focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'All', label: 'ทั้งหมด (All)', activeColor: 'bg-[#5C3D28] text-white' },
              { id: 'Coffee', label: 'Coffee (กาแฟ)', activeColor: 'bg-[#8B4513] text-white' },
              { id: 'Non-Coffee', label: 'Non-Coffee (เครื่องดื่ม)', activeColor: 'bg-[#059669] text-white' },
              { id: 'Bakery', label: 'Bakery (เบเกอรี่)', activeColor: 'bg-[#EA580C] text-white' },
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? `${tab.activeColor} shadow-sm`
                      : 'bg-[#FAF8F5] text-[#75665B] hover:bg-[#F2ECE4] border border-[#E8E2D9]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-xs font-bold uppercase tracking-wider text-[#75665B]">
                <th className="py-3.5 px-4">ชื่อสินค้า</th>
                <th className="py-3.5 px-4">หมวดหมู่</th>
                <th className="py-3.5 px-4">ราคา</th>
                <th className="py-3.5 px-4 text-center">คงเหลือ (Stock)</th>
                <th className="py-3.5 px-4 text-center">ขายได้วันนี้</th>
                <th className="py-3.5 px-4 text-right">ยอดขายรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE4] text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#75665B] font-semibold">
                    ไม่พบสินค้าที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const categoryBadge =
                    p.category === 'Coffee'
                      ? 'bg-[#FDF4EB] text-[#8B4513] border-[#F2D6BC]'
                      : p.category === 'Non-Coffee'
                      ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                      : 'bg-[#FFF7ED] text-[#C2410C] border-[#FDBA74]';

                  const isLowStock = p.stock <= 8;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#FAF8F5] transition-colors duration-150"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#2B1A12]">{p.name}</div>
                        <div className="text-xs text-[#75665B] font-medium">{p.nameTh}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${categoryBadge}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#2B1A12]">
                        ฿{p.price}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${
                            isLowStock
                              ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                              : 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                          }`}
                        >
                          {p.stock} ชิ้น
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#2B1A12]">
                        {p.soldToday} แก้ว/ชิ้น
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-[#5C3D28] text-sm">
                        {p.formattedRevenue}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
