'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  BarChart3,
  LogOut,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthUser } from '@/lib/auth-client';

interface NavItem {
  name: string;
  nameTh: string;
  href: string;
  icon: React.ElementType;
}

export const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    nameTh: 'ภาพรวมร้าน',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    nameTh: 'ประวัติการสั่งซื้อ',
    href: '/orders',
    icon: ShoppingBag,
  },
  {
    name: 'Products',
    nameTh: 'ข้อมูลสินค้า',
    href: '/products',
    icon: Coffee,
  },
  {
    name: 'Reports',
    nameTh: 'รายงานยอดขาย',
    href: '/reports',
    icon: BarChart3,
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthUser();

  return (
    <aside
      className={cn(
        'w-64 h-screen bg-white border-r border-[#E8E2D9] flex flex-col justify-between py-6 px-4 select-none',
        className
      )}
    >
      {/* Brand Header */}
      <div>
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-2xl group transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#5C3D28] text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-[#442B1A] transition-colors">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#2B1A12]">
                March Coffee
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C28448]" />
            </div>
            <p className="text-xs font-semibold tracking-wide text-[#75665B]">
              Specialty Coffee
            </p>
          </div>
        </Link>

        {/* Java POS Sync Read-Only Badge */}
        <div className="mx-2 mt-4 px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8DFC9] flex items-center gap-2.5">
          <Database className="w-4 h-4 text-[#5C3D28]" />
          <div className="text-xs leading-tight">
            <p className="font-bold text-[#5C3D28]">Java POS Sync</p>
            <p className="text-[#75665B] text-[11px]">ระบบแสดงผลข้อมูล</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="mt-6">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-[#75665B] mb-2">
            Main Menu
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-[#5C3D28] text-white shadow-sm'
                      : 'text-[#544439] hover:bg-[#F8F4EF] hover:text-[#2B1A12]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors stroke-[2]',
                        isActive ? 'text-white' : 'text-[#75665B] group-hover:text-[#5C3D28]'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span
                    className={cn(
                      'text-xs transition-colors',
                      isActive ? 'text-[#FAF4ED] font-normal' : 'text-[#75665B]'
                    )}
                  >
                    {item.nameTh}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Store Profile */}
      <div className="pt-4 border-t border-[#E8E2D9] space-y-2">
        <div className="px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 shrink-0 rounded-full bg-[#EADCCF] text-[#442B1A] flex items-center justify-center text-xs font-bold ring-1 ring-[#D8C4B0]">
              {user.role === 'ADMIN' ? 'AD' : 'CS'}
            </div>
            <div className="leading-tight truncate">
              <p className="text-xs font-bold text-[#2B1A12] truncate">{user.name}</p>
              <p className="text-[11px] text-[#75665B] truncate">
                {user.role === 'ADMIN' ? 'ผู้จัดการร้าน' : 'พนักงานแคชเชียร์'}
              </p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-[#1E5E3A]" title="System Online" />
        </div>

        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-[#75665B] rounded-xl hover:bg-[#F8F4EF] hover:text-[#A82020] transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>ออกจากระบบ (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
}
