import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, extractTokenFromHeader } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Check Authorization header first, then check cookie
    const authHeader = req.headers.get('authorization');
    let token = extractTokenFromHeader(authHeader);

    if (!token) {
      token = req.cookies.get('march_token')?.value || null;
    }

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'ไม่พบ Token ยืนยันตัวตน' },
        { status: 401 }
      );
    }

    const payload = await verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, error: 'Token หมดอายุหรือไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        username: payload.username,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (err) {
    console.error('API /api/auth/me error:', err);
    return NextResponse.json(
      { authenticated: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบ Token' },
      { status: 500 }
    );
  }
}
