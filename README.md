# March Coffee Dashboard

ระบบแดชบอร์ดบริหารจัดการร้านกาแฟ พัฒนาด้วย Next.js (App Router), TypeScript และ Tailwind CSS

## คุณสมบัติหลัก

- **ระบบวิเคราะห์ยอดขาย:** สรุปรายได้ ติดตามออเดอร์ และแสดงกราฟประสิทธิภาพการขายแบบเรียลไทม์
- **ระบบจัดการสต็อก:** ติดตามจำนวนสินค้า แจ้งเตือนสินค้าใกล้หมด และจัดการรายการสินค้า
- **ข้อมูลลูกค้า:** ประวัติการสั่งซื้อ สถิติลูกค้า และระบบติดตามสมาชิก
- **ส่วนติดต่อผู้ใช้:** ดีไซน์เรียบง่าย สบายตา รองรับการใช้งานทั้งเดสก์ท็อปและมือถือ

## เทคโนโลยีที่ใช้

- **เฟรมเวิร์ก:** Next.js 16 (App Router)
- **เครื่องมือ UI:** React 19, Lucide Icons, Recharts
- **ภาษา:** TypeScript
- **การจัดสไตล์:** Tailwind CSS v4, PostCSS

## การเริ่มต้นใช้งาน

### สิ่งที่ต้องเตรียม

- Node.js 18.17 ขึ้นไป
- npm, yarn, pnpm หรือ bun

### ขั้นตอนการติดตั้ง

1. คลองน์คลังข้อมูล (Clone Repository):
   ```bash
   git clone https://github.com/nattapong-2005/march-coffee-dashboard.git
   cd march-coffee-dashboard
   ```

2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```

3. รันเซิร์ฟเวอร์สำหรับการพัฒนา:
   ```bash
   npm run dev
   ```

4. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## คำสั่งที่ใช้งานบ่อย

- `npm run dev` — รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Mode)
- `npm run build` — บิลด์โปรเจกต์สำหรับใช้งานจริง (Production)
- `npm run start` — รันเซิร์ฟเวอร์แบบ Production
- `npm run lint` — ตรวจสอบคุณภาพโค้ดด้วย ESLint

## โครงสร้างโปรเจกต์

```text
dashboard-coffee/
├── public/           # ไฟล์สื่อและ Static Assets
├── src/
│   ├── app/          # หน้าเว็บ Layout และ API Routes ของ Next.js
│   └── components/   # คอมโพเนนต์ React ที่นำกลับมาใช้ใหม่ได้
├── next.config.ts    # การตั้งค่า Next.js
└── package.json      # รายการ Dependencies และ Scripts
```

## สิทธิ์การใช้งาน

คลังข้อมูลส่วนตัว สงวนลิขสิทธิ์
