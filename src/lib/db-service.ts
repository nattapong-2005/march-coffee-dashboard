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

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const totalOrders = orders.length;
    const totalItemsSold = orders.reduce(
      (acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const kpis: KpiMetric[] = [
      {
        id: 'revenue',
        title: "Today's Revenue",
        titleTh: 'ยอดขายวันนี้',
        value: `฿${totalRevenue.toLocaleString()}`,
        change: '+100%',
        isPositive: true,
        comparisonText: 'ข้อมูลจริงจาก Java POS',
        iconName: 'CircleDollarSign',
      },
      {
        id: 'orders',
        title: "Today's Orders",
        titleTh: 'จำนวน Order วันนี้',
        value: `${totalOrders}`,
        change: `+${totalOrders}`,
        isPositive: true,
        comparisonText: 'ออเดอร์ในระบบ',
        iconName: 'ShoppingBag',
      },
      {
        id: 'items_sold',
        title: 'Items Sold',
        titleTh: 'จำนวนสินค้าที่ขาย',
        value: `${totalItemsSold} ชิ้น`,
        change: `+${totalItemsSold}`,
        isPositive: true,
        comparisonText: 'รวมทุกเมนู',
        iconName: 'Coffee',
      },
      {
        id: 'aov',
        title: 'Avg Order Value',
        titleTh: 'ยอดเฉลี่ยต่อ Order',
        value: `฿${aov.toFixed(2)}`,
        change: 'เฉลี่ย/บิล',
        isPositive: true,
        comparisonText: 'AOV จริง',
        iconName: 'ReceiptText',
      },
    ];

    // Build Weekly Sales Trend from database orders
    const days = [
      { day: 'Mon', dayTh: 'จันทร์', revenue: 0, orders: 0 },
      { day: 'Tue', dayTh: 'อังคาร', revenue: 0, orders: 0 },
      { day: 'Wed', dayTh: 'พุธ', revenue: 0, orders: 0 },
      { day: 'Thu', dayTh: 'พฤหัสบดี', revenue: 0, orders: 0 },
      { day: 'Fri', dayTh: 'ศุกร์', revenue: 0, orders: 0 },
      { day: 'Sat', dayTh: 'เสาร์', revenue: 0, orders: 0 },
      { day: 'Sun', dayTh: 'อาทิตย์', revenue: 0, orders: 0 },
    ];

    const weeklyRes = await query<{
      day_index: number;
      order_count: number;
      day_revenue: string;
    }>(`
      SELECT 
        EXTRACT(ISODOW FROM created_at AT TIME ZONE 'Asia/Bangkok')::int as day_index,
        COUNT(*)::int as order_count,
        SUM(total_price)::numeric as day_revenue
      FROM orders
      GROUP BY day_index
      ORDER BY day_index ASC
    `);

    for (const row of weeklyRes) {
      const idx = row.day_index - 1;
      if (days[idx]) {
        days[idx].revenue = Number(row.day_revenue);
        days[idx].orders = Number(row.order_count);
      }
    }

    const weeklySalesTrend: DailySalesData[] = days.map((d) => ({
      ...d,
      formattedRevenue: `฿${d.revenue.toLocaleString()}`,
    }));

    const revenuePeriodSummary = {
      today: {
        amount: `฿${totalRevenue.toLocaleString()}`,
        labelTh: 'ยอดขายวันนี้',
        labelEn: 'Today Revenue',
        change: '+100%',
        isPositive: true,
      },
      thisMonth: {
        amount: `฿${totalRevenue.toLocaleString()}`,
        labelTh: 'ยอดขายเดือนนี้',
        labelEn: 'This Month',
        change: '+100%',
        isPositive: true,
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
  const { summary } = await getOrdersData();
  const totalRevenue = dash.kpis.find((k) => k.id === 'revenue')?.value || '฿0';
  const totalRevNum = parseFloat(totalRevenue.replace(/[^0-9.]/g, '')) || 0;

  const currentMonthName = THAI_MONTHS[new Date().getMonth()];
  const monthlyTrend = [
    { label: 'พ.ค.', revenue: 0, orders: 0 },
    { label: 'มิ.ย.', revenue: 0, orders: 0 },
    { label: 'ก.ค.', revenue: 0, orders: 0 },
    { label: 'ส.ค.', revenue: 0, orders: 0 },
    { label: `${currentMonthName} (ปัจจุบัน)`, revenue: totalRevNum, orders: summary.totalToday },
  ];

  return {
    dailySales: totalRevenue,
    monthlySales: totalRevenue,
    avgDailySales: totalRevenue,
    totalOrders: summary.totalToday,
    weeklySalesTrend: dash.weeklySalesTrend,
    monthlyTrend,
    bestSellers: dash.bestSellers,
    categorySales: dash.categorySales,
  };
}
