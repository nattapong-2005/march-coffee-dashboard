'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, Calendar, Database } from 'lucide-react';
import { MobileSidebar } from './mobile-sidebar';

const pageTitleMap: Record<string, { title: string; titleTh: string }> = {
  '/dashboard': { title: 'Dashboard', titleTh: 'ภาพรวมของร้าน' },
  '/orders': { title: 'Orders', titleTh: 'ประวัติรายการสั่งซื้อ' },
  '/products': { title: 'Products', titleTh: 'ข้อมูลสินค้า' },
  '/reports': { title: 'Reports', titleTh: 'รายงานและสถิติยอดขาย' },
};

export function Header() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentMeta = pageTitleMap[pathname] || {
    title: 'March Coffee',
    titleTh: 'Web App Dashboard',
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E8E2D9] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button & Page Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-[#E8E2D9] bg-white text-[#442B1A] hover:bg-[#F8F4EF] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-[#2B1A12]">
                {currentMeta.title}
              </span>
              <span className="text-xs font-medium text-[#75665B] hidden sm:inline">
                • {currentMeta.titleTh}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Java Sync Tag, Date, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Java Sync Status Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF5EE] border border-[#C8E8D3] text-xs font-bold text-[#1E5E3A]">
            <span className="w-2 h-2 rounded-full bg-[#1E5E3A] animate-pulse" />
            <span>Java POS Synced</span>
          </div>

          {/* Date display */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs font-semibold text-[#544439]">
            <Calendar className="w-4 h-4 text-[#5C3D28]" />
            <span>12 กันยายน 2026</span>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white border border-[#E8E2D9] text-[#544439] hover:bg-[#F8F4EF] hover:border-[#D8CEBE] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#544439]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C28448] ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-[#E8E2D9] shadow-xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE5]">
                  <p className="text-xs font-bold text-[#2B1A12]">การแจ้งเตือน (Notifications)</p>
                  <span className="text-[10px] text-[#5C3D28] font-bold bg-[#FAF6F0] px-2 py-0.5 rounded-full">2 ใหม่</span>
                </div>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#FEF3E2] border border-[#FCDDB5]">
                    <p className="font-bold text-[#8A4B08]">สต็อกเมล็ดกาแฟใกล้หมด</p>
                    <p className="text-[11px] text-[#5C3D28] mt-0.5">House Blend เหลือเพียง 4 กิโลกรัม</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#EAF5EE] border border-[#C8E8D3]">
                    <p className="font-bold text-[#1E5E3A]">ออเดอร์ล่าสุด</p>
                    <p className="text-[11px] text-[#2B1A12] mt-0.5">#MC2401 ชำระเงินผ่าน PromptPay เรียบร้อย</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Store Profile Chip */}
          <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-[#E8E2D9]">
            <div className="w-8 h-8 rounded-full bg-[#5C3D28] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#E8E2D9]">
              MA
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-[#2B1A12] leading-none">March Admin</p>
              <p className="text-[11px] font-medium text-[#75665B] mt-0.5">Store Manager</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
