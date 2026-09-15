import { query } from './db';
import {
  KpiMetric,
  DailySalesData,
  CategorySale,
  BestSeller,
  PaymentMethodStat,
  Order,
  Product,
  ProductCategory,
  OrderStatus,
} from '@/data/types';
import {
  dashboardKpis as fallbackKpis,
  weeklySalesTrend as fallbackWeeklySales,
  revenuePeriodSummary as fallbackPeriodSummary,
  categorySales as fallbackCategorySales,
  bestSellers as fallbackBestSellers,
  paymentMethods as fallbackPaymentMethods,
  recentOrders as fallbackRecentOrders,
} from '@/data/dashboard';
import { mockOrders as fallbackOrders, ordersSummary as fallbackOrdersSummary } from '@/data/orders';
import { mockProducts as fallbackProducts } from '@/data/products';

export const THAI_PRODUCT_NAMES: Record<string, string> = {
  Espresso: 'เอสเพรสโซ่',
  'Iced Americano': 'อเมริกาโน่เย็น',
  'Iced Latte': 'ลาเต้เย็น',
  Cappuccino: 'คาปูชิโน่',
  'Chocolate Cake': 'เค้กช็อกโกแลต',
  'Cheese Cake': 'ชีสเค้ก',
  'Honey Macchiato': 'ฮันนี่ มัคคิอาโต้',
  'Butter Croissant': 'ครัวซองต์เนยสด',
  Croissant: 'ครัวซองต์เนยสด',
};

export const THAI_CATEGORY_NAMES: Record<string, string> = {
  Coffee: 'กาแฟ',
  'Non-Coffee': 'เครื่องดื่มอื่นๆ',
  Bakery: 'เบเกอรี่และของหวาน',
};

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

export function formatThaiDate(date: Date | string): string {
  const d = new Date(date);
  const day = d.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok', day: 'numeric' });
  const monthIdx = parseInt(d.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok', month: 'numeric' }), 10) - 1;
  const year = d.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok', year: 'numeric' });
  return `${day} ${THAI_MONTHS[monthIdx] || ''} ${year}`;
}

export function formatThaiTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' });
}

interface RawOrderRow {
  order_id: string;
  total_price: string | number;
  status: string;
  created_at: string;
  user_id: string | null;
  username: string | null;
  staff_name: string | null;
  staff_role: string | null;
  payment_id: string | null;
  payment_method: string | null;
  amount_paid: string | number | null;
  change_amount: string | number | null;
  payment_date: string | null;
}

interface RawOrderItemRow {
  id: string | number;
  order_id: string;
  item_id: string;
  item_name: string;
  category: string;
  unit_price: string | number;
  quantity: number;
  sweetness_level: string | null;
  extra_shots: number | null;
  warmed: boolean | null;
  subtotal: string | number;
}

interface RawMenuItemRow {
  item_id: string;
  name: string;
  price: string | number;
  category: string;
  extra_shots: number | null;
  warmed: boolean | null;
  created_at: string;
  sold_today: number;
  revenue: string | number;
}

interface RawPaymentRow {
  payment_method: string | null;
  count: number;
  total_amount: string | number;
}

function normalizeCategory(category: string): ProductCategory {
  if (category === 'Coffee') return 'Coffee';
  if (category === 'Bakery') return 'Bakery';
  return 'Non-Coffee';
}

function normalizeStatus(status: string): OrderStatus {
  const upper = (status || '').toUpperCase();
  if (upper === 'PAID' || upper === 'COMPLETED') return 'Completed';
  if (upper === 'PREPARING') return 'Preparing';
  if (upper === 'PENDING') return 'Pending';
  if (upper === 'CANCELLED' || upper === 'CANCELED') return 'Cancelled';
  return 'Completed';
}

function normalizePaymentMethod(method: string | null): 'PromptPay' | 'Cash' | 'Credit Card' {
  const upper = (method || '').toUpperCase();
  if (upper === 'CASH') return 'Cash';
  if (upper.includes('CREDIT') || upper.includes('CARD')) return 'Credit Card';
  return 'PromptPay';
}

export async function getOrdersData(): Promise<{
  orders: Order[];
  summary: {
    totalToday: number;
    completed: number;
    preparing: number;
    pending: number;
    cancelled: number;
  };
}> {
  try {
    const ordersRes = await query<RawOrderRow>(`
      SELECT 
        o.order_id,
        o.total_price,
        o.status,
        o.created_at,
        o.user_id,
        u.username,
        u.name as staff_name,
        u.role as staff_role,
        p.payment_id,
        p.payment_method,
        p.amount_paid,
        p.change_amount,
        p.payment_date
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN (
        SELECT DISTINCT ON (order_id) order_id, payment_id, payment_method, amount_paid, change_amount, payment_date 
        FROM payments 
        ORDER BY order_id, payment_date DESC
      ) p ON o.order_id = p.order_id
      ORDER BY o.created_at DESC
    `);

    if (!ordersRes || ordersRes.length === 0) {
      return {
        orders: fallbackOrders,
        summary: fallbackOrdersSummary,
      };
    }

    const orderIds = ordersRes.map((o) => o.order_id);
    const itemsRes = await query<RawOrderItemRow>(
      `
      SELECT 
        id,
        order_id,
        item_id,
        item_name,
        category,
        unit_price,
        quantity,
        sweetness_level,
        extra_shots,
        warmed,
        subtotal
      FROM order_items
      WHERE order_id = ANY($1)
      ORDER BY order_id, id
      `,
      [orderIds]
    );

    const itemsByOrder: Record<string, RawOrderItemRow[]> = {};
    for (const item of itemsRes) {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push(item);
    }

    const mappedOrders: Order[] = ordersRes.map((o) => {
      const items = itemsByOrder[o.order_id] || [];
      const totalQty = items.reduce((acc, i) => acc + Number(i.quantity), 0);
      const totalNum = Number(o.total_price);
      const status = normalizeStatus(o.status);

      return {
        id: o.order_id,
        userId: o.user_id,
        staffName: o.staff_name,
        staffRole: o.staff_role,
        customerName: o.staff_name
          ? `${o.staff_name} (${o.staff_role || 'Staff'})`
          : 'ลูกค้าหน้าร้าน (Walk-in)',
        customerType: 'Regular',
        payment: o.payment_id
          ? {
              paymentId: o.payment_id,
              orderId: o.order_id,
              paymentMethod: o.payment_method || 'QR',
              amountPaid: Number(o.amount_paid || totalNum),
              changeAmount: Number(o.change_amount || 0),
              paymentDate: o.payment_date ? formatThaiDate(o.payment_date) + ' ' + formatThaiTime(o.payment_date) : undefined,
            }
          : null,
        items: items.map((i) => ({
          id: i.id,
          orderId: i.order_id,
          itemId: i.item_id,
          name: i.item_name,
          category: normalizeCategory(i.category),
          price: Number(i.unit_price),
          quantity: Number(i.quantity),
          sweetnessLevel: i.sweetness_level || undefined,
          extraShots: i.extra_shots ? Number(i.extra_shots) : 0,
          warmed: Boolean(i.warmed),
          subtotal: Number(i.subtotal),
        })),
        itemCountSummary: `${totalQty} ชิ้น`,
        paymentMethod: normalizePaymentMethod(o.payment_method),
        total: totalNum,
        formattedTotal: `฿${totalNum.toLocaleString()}`,
        status,
        time: formatThaiTime(o.created_at),
        date: formatThaiDate(o.created_at),
      };
    });

    const summary = {
      totalToday: mappedOrders.length,
      completed: mappedOrders.filter((o) => o.status === 'Completed').length,
      preparing: mappedOrders.filter((o) => o.status === 'Preparing').length,
      pending: mappedOrders.filter((o) => o.status === 'Pending').length,
      cancelled: mappedOrders.filter((o) => o.status === 'Cancelled').length,
    };

    return { orders: mappedOrders, summary };
  } catch (error) {
    console.error('Failed to get orders data from database, using fallback:', error);
    return {
      orders: fallbackOrders,
      summary: fallbackOrdersSummary,
    };
  }
}

export async function getProductsData(): Promise<{
  products: Product[];
  summary: {
    total: number;
    coffee: number;
    nonCoffee: number;
    bakery: number;
    totalSold: number;
    totalRevenue: number;
  };
}> {
  try {
    const rows = await query<RawMenuItemRow>(`
      SELECT 
        m.item_id,
        m.name,
        m.price,
        m.category,
        m.extra_shots,
        m.warmed,
        m.created_at,
        COALESCE(SUM(oi.quantity), 0)::int as sold_today,
        COALESCE(SUM(oi.subtotal), 0)::numeric as revenue
      FROM menu_items m
      LEFT JOIN order_items oi ON m.item_id = oi.item_id OR m.name = oi.item_name
      GROUP BY m.item_id, m.name, m.price, m.category, m.extra_shots, m.warmed, m.created_at
      ORDER BY sold_today DESC, m.name ASC
    `);

    if (!rows || rows.length === 0) {
      const totalSold = fallbackProducts.reduce((a, p) => a + p.soldToday, 0);
      const totalRev = fallbackProducts.reduce((a, p) => a + p.price * p.soldToday, 0);
      return {
        products: fallbackProducts,
        summary: {
          total: fallbackProducts.length,
          coffee: fallbackProducts.filter((p) => p.category === 'Coffee').length,
          nonCoffee: fallbackProducts.filter((p) => p.category === 'Non-Coffee').length,
          bakery: fallbackProducts.filter((p) => p.category === 'Bakery').length,
          totalSold,
          totalRevenue: totalRev,
        },
      };
    }

    const mappedProducts: Product[] = rows.map((r) => {
      const cat = normalizeCategory(r.category);
      const sold = Number(r.sold_today);
      const price = Number(r.price);
      const revenue = Number(r.revenue);
      const stock = Math.max(15, 60 - sold);
      const isLowStock = stock <= 8;

      return {
        id: r.item_id,
        name: r.name,
        nameTh: THAI_PRODUCT_NAMES[r.name] || r.name,
        category: cat,
        categoryTh: THAI_CATEGORY_NAMES[cat] || cat,
        price,
        extraShots: r.extra_shots ? Number(r.extra_shots) : 0,
        warmed: Boolean(r.warmed),
        soldToday: sold,
        revenue,
        formattedRevenue: `฿${revenue.toLocaleString()}`,
        stock,
        status: isLowStock ? 'Low Stock' : 'In Stock',
        badgeType: isLowStock ? 'Low Stock' : 'Normal',
      };
    });

    const totalSold = mappedProducts.reduce((a, p) => a + p.soldToday, 0);
    const totalRev = mappedProducts.reduce((a, p) => a + p.price * p.soldToday, 0);

    return {
      products: mappedProducts,
      summary: {
        total: mappedProducts.length,
        coffee: mappedProducts.filter((p) => p.category === 'Coffee').length,
        nonCoffee: mappedProducts.filter((p) => p.category === 'Non-Coffee').length,
        bakery: mappedProducts.filter((p) => p.category === 'Bakery').length,
        totalSold,
        totalRevenue: totalRev,
      },
    };
  } catch (error) {
    console.error('Failed to get products data from database, using fallback:', error);
    const totalSold = fallbackProducts.reduce((a, p) => a + p.soldToday, 0);
    const totalRev = fallbackProducts.reduce((a, p) => a + p.price * p.soldToday, 0);
    return {
      products: fallbackProducts,
      summary: {
        total: fallbackProducts.length,
        coffee: fallbackProducts.filter((p) => p.category === 'Coffee').length,
        nonCoffee: fallbackProducts.filter((p) => p.category === 'Non-Coffee').length,
        bakery: fallbackProducts.filter((p) => p.category === 'Bakery').length,
        totalSold,
        totalRevenue: totalRev,
      },
    };
  }
}

export async function getDashboardData(): Promise<{
  kpis: KpiMetric[];
  weeklySalesTrend: DailySalesData[];
  revenuePeriodSummary: {
    today: { amount: string; labelTh: string; labelEn: string; change: string; isPositive: boolean };
    thisMonth: { amount: string; labelTh: string; labelEn: string; change: string; isPositive: boolean };
  };
  bestSellers: BestSeller[];
  recentOrders: Order[];
  categorySales: CategorySale[];
  paymentMethods: PaymentMethodStat[];
}> {
  try {
    const { orders } = await getOrdersData();
    if (!orders || orders.length === 0) {
      return {
        kpis: fallbackKpis,
        weeklySalesTrend: fallbackWeeklySales,
        revenuePeriodSummary: fallbackPeriodSummary,
        bestSellers: fallbackBestSellers,
        recentOrders: fallbackRecentOrders,
        categorySales: fallbackCategorySales,
        paymentMethods: fallbackPaymentMethods,
      };
    }

    // Query stats broken down by Today (Asia/Bangkok) and Month (Asia/Bangkok)
    const statsRes = await query<{
      today_revenue: string;
      today_orders: number;
      month_revenue: string;
      month_orders: number;
      total_revenue: string;
      total_orders: number;
      active_days: number;
    }>(`
      SELECT 
        COALESCE(SUM(total_price) FILTER (WHERE (created_at AT TIME ZONE 'Asia/Bangkok')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date), 0)::numeric as today_revenue,
        COUNT(*) FILTER (WHERE (created_at AT TIME ZONE 'Asia/Bangkok')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date)::int as today_orders,
        COALESCE(SUM(total_price) FILTER (WHERE DATE_TRUNC('month', created_at AT TIME ZONE 'Asia/Bangkok') = DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')), 0)::numeric as month_revenue,
        COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at AT TIME ZONE 'Asia/Bangkok') = DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok'))::int as month_orders,
        COALESCE(SUM(total_price), 0)::numeric as total_revenue,
        COUNT(*)::int as total_orders,
        COUNT(DISTINCT (created_at AT TIME ZONE 'Asia/Bangkok')::date)::int as active_days
      FROM orders
    `);

    const itemStatsRes = await query<{
      today_items: number;
      month_items: number;
      total_items: number;
    }>(`
      SELECT 
        COALESCE(SUM(oi.quantity) FILTER (WHERE (o.created_at AT TIME ZONE 'Asia/Bangkok')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date), 0)::int as today_items,
        COALESCE(SUM(oi.quantity) FILTER (WHERE DATE_TRUNC('month', o.created_at AT TIME ZONE 'Asia/Bangkok') = DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')), 0)::int as month_items,
        COALESCE(SUM(oi.quantity), 0)::int as total_items
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
    `);

    const orderStats = statsRes[0] || {
      today_revenue: '0',
      today_orders: 0,
      month_revenue: '0',
      month_orders: 0,
      total_revenue: '0',
      total_orders: orders.length,
      active_days: 0,
    };

    const itemStats = itemStatsRes[0] || {
      today_items: 0,
      month_items: 0,
      total_items: 0,
    };

    const todayRevenue = Number(orderStats.today_revenue);
    const todayOrders = Number(orderStats.today_orders);
    const todayItemsSold = Number(itemStats.today_items);
    const todayAov = todayOrders > 0 ? todayRevenue / todayOrders : 0;

    const monthRevenue = Number(orderStats.month_revenue);

    const kpis: KpiMetric[] = [
      {
        id: 'revenue',
        title: "Today's Revenue",
        titleTh: 'ยอดขายวันนี้',
        value: `฿${todayRevenue.toLocaleString()}`,
        change: todayRevenue > 0 ? '+100%' : '0%',
        isPositive: todayRevenue > 0,
        comparisonText: todayRevenue > 0 ? 'ข้อมูลจริงจาก Java POS' : 'ยังไม่มียอดขายวันนี้',
        iconName: 'CircleDollarSign',
      },
      {
        id: 'orders',
        title: "Today's Orders",
        titleTh: 'จำนวน Order วันนี้',
        value: `${todayOrders}`,
        change: todayOrders > 0 ? `+${todayOrders}` : '0',
        isPositive: todayOrders > 0,
        comparisonText: todayOrders > 0 ? 'ออเดอร์ในระบบวันนี้' : 'ยังไม่มีออเดอร์วันนี้',
        iconName: 'ShoppingBag',
      },
      {
        id: 'items_sold',
        title: 'Items Sold',
        titleTh: 'สินค้าขายวันนี้',
        value: `${todayItemsSold} ชิ้น`,
        change: todayItemsSold > 0 ? `+${todayItemsSold}` : '0',
        isPositive: todayItemsSold > 0,
        comparisonText: todayItemsSold > 0 ? 'รวมทุกเมนูวันนี้' : 'ยังไม่มีการจำหน่ายวันนี้',
        iconName: 'Coffee',
      },
      {
        id: 'aov',
        title: 'Avg Order Value',
        titleTh: 'ยอดเฉลี่ยต่อ Order',
        value: `฿${todayAov.toFixed(2)}`,
        change: 'เฉลี่ย/บิล',
        isPositive: todayOrders > 0,
        comparisonText: todayOrders > 0 ? 'AOV วันนี้' : 'ยังไม่มีออเดอร์',
        iconName: 'ReceiptText',
      },
    ];

    // Build Weekly Sales Trend (Rolling Last 7 Days ending Today in Bangkok Time)
    const THAI_DAYS_SHORT: Record<number, string> = {
      1: 'จ.',
      2: 'อ.',
      3: 'พ.',
      4: 'พฤ.',
      5: 'ศ.',
      6: 'ส.',
      7: 'อา.',
    };

    const THAI_DAYS_FULL: Record<number, string> = {
      1: 'จันทร์',
      2: 'อังคาร',
      3: 'พุธ',
      4: 'พฤหัสบดี',
      5: 'ศุกร์',
      6: 'เสาร์',
      7: 'อาทิตย์',
    };

    const weeklyRes = await query<{
      day_date: Date;
      date_str: string;
      day_index: number;
      day_num: number;
      month_num: number;
      order_count: number;
      day_revenue: string;
    }>(`
      WITH date_series AS (
        SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date - i AS day_date
        FROM generate_series(6, 0, -1) AS i
      )
      SELECT 
        ds.day_date,
        TO_CHAR(ds.day_date, 'YYYY-MM-DD') as date_str,
        EXTRACT(ISODOW FROM ds.day_date)::int as day_index,
        EXTRACT(DAY FROM ds.day_date)::int as day_num,
        EXTRACT(MONTH FROM ds.day_date)::int as month_num,
        COUNT(o.order_id)::int as order_count,
        COALESCE(SUM(o.total_price), 0)::numeric as day_revenue
      FROM date_series ds
      LEFT JOIN orders o 
        ON (o.created_at AT TIME ZONE 'Asia/Bangkok')::date = ds.day_date
      GROUP BY ds.day_date
      ORDER BY ds.day_date ASC
    `);

    const nowBkkStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date());

    const weeklySalesTrend: DailySalesData[] = weeklyRes.map((r) => {
      const isToday = r.date_str === nowBkkStr;
      const dayShortName = THAI_DAYS_SHORT[r.day_index] || '';
      const dayFullName = THAI_DAYS_FULL[r.day_index] || '';
      const monthShort = THAI_MONTHS[r.month_num - 1] || '';
      const revNum = Number(r.day_revenue);

      // Label for chart X-axis: e.g. "15/09 (วันนี้)" or "13/09 (อา.)"
      const dayLabel = isToday
        ? `${String(r.day_num).padStart(2, '0')}/${String(r.month_num).padStart(2, '0')} (วันนี้)`
        : `${String(r.day_num).padStart(2, '0')}/${String(r.month_num).padStart(2, '0')} (${dayShortName})`;

      // Full descriptive label for tooltips: e.g. "13 ก.ย. (อาทิตย์)" or "15 ก.ย. (อังคาร - วันนี้)"
      const dayThLabel = isToday
        ? `${r.day_num} ${monthShort} (${dayFullName} - วันนี้)`
        : `${r.day_num} ${monthShort} (${dayFullName})`;

      return {
        day: dayLabel,
        dayTh: dayThLabel,
        revenue: revNum,
        formattedRevenue: `฿${revNum.toLocaleString()}`,
        orders: Number(r.order_count),
      };
    });

    const revenuePeriodSummary = {
      today: {
        amount: `฿${todayRevenue.toLocaleString()}`,
        labelTh: 'ยอดขายวันนี้',
        labelEn: 'Today Revenue',
        change: todayRevenue > 0 ? '+100%' : '0%',
        isPositive: todayRevenue > 0,
      },
      thisMonth: {
        amount: `฿${monthRevenue.toLocaleString()}`,
        labelTh: 'ยอดขายเดือนนี้',
        labelEn: 'This Month',
        change: monthRevenue > 0 ? '+100%' : '0%',
        isPositive: monthRevenue > 0,
      },
    };

    // Best Sellers from order_items
    const bestSellersRes = await query<{
      item_name: string;
      category: string;
      sold: number;
      revenue: string;
    }>(`
      SELECT 
        oi.item_name,
        oi.category,
        SUM(oi.quantity)::int as sold,
        SUM(oi.subtotal)::numeric as revenue
      FROM order_items oi
      GROUP BY oi.item_name, oi.category
      ORDER BY sold DESC, revenue DESC
      LIMIT 5
    `);

    const bestSellers: BestSeller[] = bestSellersRes.map((r, idx) => {
      const cat = normalizeCategory(r.category);
      const revNum = Number(r.revenue);
      return {
        rank: idx + 1,
        name: r.item_name,
        nameTh: THAI_PRODUCT_NAMES[r.item_name] || r.item_name,
        category: cat,
        categoryTh: THAI_CATEGORY_NAMES[cat] || cat,
        sold: Number(r.sold),
        revenue: revNum,
        formattedRevenue: `฿${revNum.toLocaleString()}`,
        growth: '+100%',
      };
    });

    // Category sales
    const catSalesRes = await query<{
      category: string;
      revenue: string;
    }>(`
      SELECT 
        category,
        SUM(subtotal)::numeric as revenue
      FROM order_items
      GROUP BY category
      ORDER BY revenue DESC
    `);

    const totalCatRevenue = catSalesRes.reduce((acc, c) => acc + Number(c.revenue), 0);
    const categoryColorMap: Record<string, string> = {
      Coffee: 'bg-[#8B4513]',
      'Non-Coffee': 'bg-[#059669]',
      Bakery: 'bg-[#EA580C]',
    };

    const categorySales: CategorySale[] = catSalesRes.map((c) => {
      const cat = normalizeCategory(c.category);
      const rev = Number(c.revenue);
      const percentage = totalCatRevenue > 0 ? Number(((rev / totalCatRevenue) * 100).toFixed(1)) : 0;
      return {
        category: cat,
        categoryTh: THAI_CATEGORY_NAMES[cat] || cat,
        revenue: rev,
        formattedRevenue: `฿${rev.toLocaleString()}`,
        percentage,
        colorClass: categoryColorMap[cat] || 'bg-[#75665B]',
      };
    });

    // Payment methods
    const payRes = await query<RawPaymentRow>(`
      SELECT 
        payment_method,
        COUNT(*)::int as count,
        SUM(amount_paid)::numeric as total_amount
      FROM payments
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `);

    const totalPaymentAmount = payRes.reduce((acc, p) => acc + Number(p.total_amount), 0);
    const paymentMethods: PaymentMethodStat[] = payRes.map((p) => {
      const methodNorm = normalizePaymentMethod(p.payment_method);
      const amt = Number(p.total_amount);
      const pct = totalPaymentAmount > 0 ? Math.round((amt / totalPaymentAmount) * 100) : 0;

      let id = 'promptpay';
      let name = 'QR PromptPay';
      let nameTh = 'พร้อมเพย์';
      let iconName = 'QrCode';

      if (methodNorm === 'Cash') {
        id = 'cash';
        name = 'Cash';
        nameTh = 'เงินสด';
        iconName = 'Banknote';
      } else if (methodNorm === 'Credit Card') {
        id = 'credit_card';
        name = 'Credit Card';
        nameTh = 'บัตรเครดิต';
        iconName = 'CreditCard';
      }

      return {
        id,
        name,
        nameTh,
        percentage: pct,
        amount: amt,
        formattedAmount: `฿${amt.toLocaleString()}`,
        iconName,
      };
    });

    return {
      kpis,
      weeklySalesTrend,
      revenuePeriodSummary,
      bestSellers,
      recentOrders: orders.slice(0, 8),
      categorySales: categorySales.length > 0 ? categorySales : fallbackCategorySales,
      paymentMethods: paymentMethods.length > 0 ? paymentMethods : fallbackPaymentMethods,
    };
  } catch (error) {
    console.error('Failed to get dashboard data from database, using fallback:', error);
    return {
      kpis: fallbackKpis,
      weeklySalesTrend: fallbackWeeklySales,
      revenuePeriodSummary: fallbackPeriodSummary,
      bestSellers: fallbackBestSellers,
      recentOrders: fallbackRecentOrders,
      categorySales: fallbackCategorySales,
      paymentMethods: fallbackPaymentMethods,
    };
  }
}

export async function getReportsData() {
  const dash = await getDashboardData();
  const { orders } = await getOrdersData();

  const statsRes = await query<{
    today_revenue: string;
    today_orders: number;
    month_revenue: string;
    month_orders: number;
    total_revenue: string;
    total_orders: number;
    active_days: number;
  }>(`
    SELECT 
      COALESCE(SUM(total_price) FILTER (WHERE (created_at AT TIME ZONE 'Asia/Bangkok')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date), 0)::numeric as today_revenue,
      COUNT(*) FILTER (WHERE (created_at AT TIME ZONE 'Asia/Bangkok')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date)::int as today_orders,
      COALESCE(SUM(total_price) FILTER (WHERE DATE_TRUNC('month', created_at AT TIME ZONE 'Asia/Bangkok') = DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')), 0)::numeric as month_revenue,
      COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at AT TIME ZONE 'Asia/Bangkok') = DATE_TRUNC('month', CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok'))::int as month_orders,
      COALESCE(SUM(total_price), 0)::numeric as total_revenue,
      COUNT(*)::int as total_orders,
      COUNT(DISTINCT (created_at AT TIME ZONE 'Asia/Bangkok')::date)::int as active_days
    FROM orders
  `);

  const orderStats = statsRes[0] || {
    today_revenue: '0',
    today_orders: 0,
    month_revenue: '0',
    month_orders: 0,
    total_revenue: '0',
    total_orders: orders.length,
    active_days: 0,
  };

  const todayRevenueNum = Number(orderStats.today_revenue);
  const todayOrdersNum = Number(orderStats.today_orders);
  const monthRevenueNum = Number(orderStats.month_revenue);
  const monthOrdersNum = Number(orderStats.month_orders);
  const totalRevenueNum = Number(orderStats.total_revenue);
  const totalOrdersNum = Number(orderStats.total_orders);
  const activeDays = Number(orderStats.active_days);

  const nowBkk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  const dayOfMonth = nowBkk.getDate();

  // Average daily sales in current month
  const avgDailyRunRate = dayOfMonth > 0 ? monthRevenueNum / dayOfMonth : 0;
  const avgDailyFormatted = avgDailyRunRate > 0 ? `฿${avgDailyRunRate.toFixed(2)}` : '฿0.00';
  const avgDailyNote =
    monthRevenueNum > 0
      ? `เฉลี่ยจาก ${dayOfMonth} วันในเดือนนี้ (มียอดขายจริง ${activeDays} วัน รวม ฿${monthRevenueNum.toLocaleString()})`
      : 'ยังไม่มียอดขายในเดือนนี้';

  const monthlyRes = await query<{
    month_date: Date;
    month_num: number;
    year_num: number;
    orders: number;
    revenue: string;
  }>(`
    WITH month_series AS (
      SELECT DATE_TRUNC('month', (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok') - (i || ' month')::interval) AS month_date
      FROM generate_series(4, 0, -1) AS i
    )
    SELECT 
      ms.month_date,
      EXTRACT(MONTH FROM ms.month_date)::int as month_num,
      EXTRACT(YEAR FROM ms.month_date)::int as year_num,
      COUNT(o.order_id)::int as orders,
      COALESCE(SUM(o.total_price), 0)::numeric as revenue
    FROM month_series ms
    LEFT JOIN orders o 
      ON DATE_TRUNC('month', o.created_at AT TIME ZONE 'Asia/Bangkok') = ms.month_date
    GROUP BY ms.month_date
    ORDER BY ms.month_date ASC
  `);

  const currentMonthNum = nowBkk.getMonth() + 1;
  const monthlyTrend = monthlyRes.map((m) => {
    const isCurrent = m.month_num === currentMonthNum;
    const mName = THAI_MONTHS[m.month_num - 1] || '';
    const label = isCurrent ? `${mName} (ปัจจุบัน)` : mName;
    return {
      label,
      revenue: Number(m.revenue),
      orders: Number(m.orders),
    };
  });

  return {
    dailySales: `฿${todayRevenueNum.toLocaleString()}`,
    todayOrders: todayOrdersNum,
    monthlySales: `฿${monthRevenueNum.toLocaleString()}`,
    monthOrders: monthOrdersNum,
    avgDailySales: avgDailyFormatted,
    avgDailyNote,
    totalOrders: totalOrdersNum,
    totalRevenue: `฿${totalRevenueNum.toLocaleString()}`,
    weeklySalesTrend: dash.weeklySalesTrend,
    monthlyTrend,
    bestSellers: dash.bestSellers,
    categorySales: dash.categorySales,
  };
}
