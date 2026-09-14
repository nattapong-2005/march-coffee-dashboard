'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Lock,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { setAuthSession } from '@/lib/auth-client';


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
        return;
      }

      // Store authenticated user & JWT token in localStorage and cookies
      setAuthSession(data.user, data.token);

      setSuccessMessage(
        `ยินดีต้อนรับคุณ ${data.user.name} (${data.user.role}) • บันทึก Token เรียบร้อยแล้ว`
      );

      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
      setIsLoading(false);
    }
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
            เชื่อมต่อข้อมูลจริงกับตาราง <code className="bg-black/20 px-1.5 py-0.5 rounded text-white font-mono text-xs">users</code> ในระบบ Java POS
            พร้อมระบบความปลอดภัย JWT Token
          </p>

          <div className="pt-4 flex items-center gap-6 border-t border-white/15 text-xs text-[#E0D1C5]">
            <div>
              <p className="text-xl font-extrabold text-white">3 บัญชี</p>
              <p className="text-xs text-[#C8B6A6] font-medium">ผู้ใช้ในฐานข้อมูล</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-xl font-extrabold text-white">Argon2id</p>
              <p className="text-xs text-[#C8B6A6] font-medium">Password Hashing</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-xl font-extrabold text-white">JWT Token</p>
              <p className="text-xs text-[#C8B6A6] font-medium">Secure Session 24h</p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#C8B6A6] font-semibold">
          <p>© 2026 March Coffee Co. All rights reserved.</p>
          <p className="font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8B6A6]" />
            <span>PostgreSQL & JWT Auth Synced</span>
          </p>
        </div>
      </div>

      {/* Right Column: Clean White Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E2D9] shadow-xl">
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

            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2B1A12]">
                เข้าสู่ระบบ (Sign In)
              </h1>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E8DFC9] text-[10px] font-bold text-[#5C3D28] flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                JWT Auth
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-[#75665B] font-semibold">
              เข้าสู่ระบบ March Coffee Dashboard ด้วยบัญชีพนักงานในฐานข้อมูล
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-semibold text-[#B91C1C] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-semibold text-[#166534] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-bold text-[#442B1A]"
              >
                Username / ชื่อผู้ใช้
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#75665B]" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin หรือ cashier หรือ march"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] text-xs sm:text-sm text-[#2B1A12] placeholder:text-[#8C7E73] focus:outline-none focus:border-[#5C3D28] focus:bg-white transition-all font-medium font-mono"
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
                    alert(
                      'รหัสผ่านเริ่มต้น:\n• admin: admin123\n• cashier: cashier123\n• march: march123'
                    );
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
                className="w-4 h-4 rounded border-[#D8CEBE] text-[#5C3D28] focus:ring-[#5C3D28] accent-[#5C3D28] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-xs text-[#544439] font-medium select-none cursor-pointer"
              >
                Remember Me (จัดเก็บ Token ไว้อย่างปลอดภัย)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#5C3D28] hover:bg-[#442B1A] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <span>กำลังสร้าง Token และเข้าสู่ระบบ...</span>
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
