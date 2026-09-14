import { SignJWT, jwtVerify } from 'jose';

export interface TokenPayload {
  id: string;
  username: string;
  name: string;
  role: string;
  [key: string]: unknown;
}

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'march_coffee_jwt_secret_key_2026_super_secure_auth_token';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

/**
 * Generate a signed JWT token valid for 24 hours
 */
export async function createAuthToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer('march-coffee-pos')
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

/**
 * Verify and decode an existing JWT token
 */
export async function verifyAuthToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      issuer: 'march-coffee-pos',
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Helper to extract Bearer token from an Authorization header
 */
export function extractTokenFromHeader(authHeader?: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}
