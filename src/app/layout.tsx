import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const lineSeed = localFont({
  src: '../font/LINESeedSansTH-Regular.ttf',
  variable: '--font-line-seed',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'March Coffee — Store Dashboard & Reports',
  description: 'ระบบ Dashboard แสดงภาพรวมร้านกาแฟ March Coffee เชื่อมโยงข้อมูลยอดขาย ออเดอร์ สินค้า และรายงาน',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${lineSeed.variable} ${lineSeed.className}`}>
      <body className={`${lineSeed.className} antialiased bg-[#FBF9F5] text-[#1F1916] selection:bg-[#E8DDD0] selection:text-[#1F1916]`}>
        {children}
      </body>
    </html>
  );
}
