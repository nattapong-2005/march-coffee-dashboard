import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySync } from '@node-rs/argon2';
import { createAuthToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

function verifyArgon2(storedHash: string, plain: string): boolean {
  try {
    if (verifySync(storedHash, plain)) return true;
  } catch {}

  try {
    const parts = storedHash.split('$');
    if (parts.length >= 6) {
      parts[4] = parts[4].replace(/-/g, '+').replace(/_/g, '/');
      parts[5] = parts[5].replace(/-/g, '+').replace(/_/g, '/');
      return verifySync(parts.join('$'), plain);
    }
  } catch {}

  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
        { status: 400 }
      );
    }

    const trimmedUser = String(username).trim().toLowerCase();
    const rows = await query<{
      id: string;
      username: string;
      password: string;
      name: string;
      role: string;
    }>(
      'SELECT id, username, password, name, role FROM users WHERE LOWER(username) = $1',
      [trimmedUser]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' },
        { status: 401 }
      );
    }

    const user = rows[0];
    const isValid = verifyArgon2(user.password, String(password));

    if (!isValid) {
      return NextResponse.json(
        { error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' },
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    const token = await createAuthToken(safeUser);

    const response = NextResponse.json({
      success: true,
      token,
      user: safeUser,
    });

    // Set HTTP cookie for proxy middleware verification
    response.cookies.set('march_token', token, {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // allow client-side reading if needed
    });

    response.cookies.set('march_user', JSON.stringify(safeUser), {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    });

    return response;
  } catch (err) {
    console.error('API /api/auth/login error:', err);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล' },
      { status: 500 }
    );
  }
}

// GET endpoint to return list of active users (without passwords) for quick login selection
export async function GET() {
  try {
    const rows = await query<{
      id: string;
      username: string;
      name: string;
      role: string;
    }>('SELECT id, username, name, role FROM users ORDER BY role, username');

    return NextResponse.json({ users: rows });
  } catch (err) {
    console.error('API /api/auth/login GET error:', err);
    return NextResponse.json(
      {
        users: [
          { id: 'USR-ADMIN', username: 'admin', name: 'แอดมินสุดเท่', role: 'ADMIN' },
          { id: 'USR-CASHIER', username: 'cashier', name: 'นายมาด', role: 'CASHIER' },
          { id: 'USR-E170CC', username: 'march', name: 'มาด คุง', role: 'CASHIER' },
        ],
      }
    );
  }
}
