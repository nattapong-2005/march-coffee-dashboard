'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Sparkles, Coffee } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@marchcoffee.com');
  const [password, setPassword] = useState('marchcoffee');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  const handleFillMock = () => {
    setEmail('admin@marchcoffee.com');
    setPassword('marchcoffee');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF8F5]">
      {/* Left Column: Brand Visual in Rich Warm Coffee Brown */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#5C3D28] to-[#442B1A] text-[#FAF4ED] p-12 flex-col justify-between overflow-hidden">
        {/* Subtle Decorative Shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#755037] blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#362113] blur-3xl opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/10 rounded-full pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#5C3D28] flex items-center justify-center font-bold text-2xl shadow-md">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                March Coffee
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C28448]" />
            </div>
            <p className="text-xs text-[#E8D9CC] font-semibold tracking-wide">
              Specialty Coffee & POS Dashboard
            </p>
          </div>
        </div>

        {/* Center Inspiration & Mood Statement */}
        <div className="relative z-10 max-w-md my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-[#FAF4ED]">
            <Sparkles className="w-3.5 h-3.5 text-[#C28448]" />
            <span>Contemporary Store Operations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Crafting Exceptional Moments, Cup by Cup.
          </h2>

          <p className="text-sm text-[#E0D1C5] leading-relaxed font-medium">
            ระบบบริหารจัดการร้านกาแฟสเปเชียลตี้ระดับพรีเมียม
            เชื่อมต่อข้อมูลกับ Java POS แสดงยอดขาย ออเดอร์ และสถิติอย่างง่ายดาย
          </p>

          <div className="pt-4 flex items-center gap-6 border-t border-white/15 text-xs text-[#E0D1C5]">
            <div>
              <p className="text-xl font-extrabold text-white">100%</p>
              <p className="text-xs text-[#C8B6A6] font-medium">Single Origin Beans</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-xl font-extrabold text-white">4.9 ★</p>
              <p className="text-xs text-[#C8B6A6] font-medium">Customer Rating</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-xl font-extrabold text-white">140+</p>
              <p className="text-xs text-[#C8B6A6] font-medium">Daily Cups Served</p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#C8B6A6] font-semibold">
          <p>© 2026 March Coffee Co. All rights reserved.</p>
          <p className="font-mono">Java POS Sync v2.4</p>
        </div>
      </div>

      {/* Right Column: Clean White Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E2D9] shadow-xl">
          {/* Form Header */}
          <div>
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#5C3D28] text-white flex items-center justify-center font-bold text-lg">
                M
              </div>
              <span className="font-bold text-xl text-[#2B1A12]">
                March Coffee
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2B1A12]">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#75665B] font-semibold">
              เข้าสู่ระบบเพื่อดู March Coffee Web Dashboard
            </p>
          </div>

          {/* Quick Mock Account Helper Box */}
          <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#EFE3D5] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#5C3D28]">
                ข้อมูลบัญชีทดสอบ (Mock Account):
              </span>
              <button
                type="button"
                onClick={handleFillMock}
                className="text-xs text-[#5C3D28] underline hover:text-[#442B1A] font-bold"
              >
                กรอกอัตโนมัติ
              </button>
            </div>
            <p className="text-[#544439] font-medium">
              อีเมล: <code className="font-mono text-[#2B1A12] font-bold">admin@marchcoffee.com</code>
            </p>
            <p className="text-[#544439] font-medium">
              รหัสผ่าน: <code className="font-mono text-[#2B1A12] font-bold">marchcoffee</code>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-[#442B1A]"
              >
                Email Address / อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#75665B]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@marchcoffee.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-xs sm:text-sm text-[#2B1A12] placeholder:text-[#8C7E73] focus:outline-none focus:border-[#5C3D28] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-[#442B1A]"
                >
                  Password / รหัสผ่าน
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Mock: บัญชีทดสอบใช้รหัส marchcoffee');
                  }}
                  className="text-xs text-[#5C3D28] font-bold hover:underline"
                >
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#75665B]" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-xs sm:text-sm text-[#2B1A12] placeholder:text-[#8C7E73] focus:outline-none focus:border-[#5C3D28] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#D8CEBE] text-[#5C3D28] focus:ring-[#5C3D28] accent-[#5C3D28]"
              />
              <label
                htmlFor="remember"
                className="text-xs text-[#544439] font-medium select-none cursor-pointer"
              >
                Remember Me (จดจำการเข้าสู่ระบบ)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#5C3D28] hover:bg-[#442B1A] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 disabled:opacity-75"
            >
              {isLoading ? (
                <span>กำลังเข้าสู่ระบบ...</span>
              ) : (
                <>
                  <span>Sign In เข้าสู่ระบบ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
