import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'va_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

type AdminConfig = { email: string; password: string; secret: string };

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

function getConfig(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !password || !secret || secret.length < 32) return null;
  return { email, password, secret };
}

const missingConfigResponse = () =>
  json(
    { error: 'Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the Vercel project.' },
    500,
  );

// Hashing first gives equal-length buffers so timingSafeEqual never leaks length.
function safeEqual(a: string, b: string) {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function createSessionToken(config: AdminConfig) {
  const payload = Buffer.from(
    JSON.stringify({ sub: config.email, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }),
  ).toString('base64url');
  return `${payload}.${sign(payload, config.secret)}`;
}

function isValidSessionToken(token: string | undefined, config: AdminConfig) {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload, config.secret))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.sub === config.email && typeof data.exp === 'number' && data.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
}

function sessionCookie(value: string, maxAge: number) {
  const sameSite = process.env.ADMIN_COOKIE_SAME_SITE === 'none' ? 'None' : 'Lax';
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=${sameSite}; Max-Age=${maxAge}`;
}

export function GET(request: Request) {
  const config = getConfig();
  if (!config) return missingConfigResponse();
  const authenticated = isValidSessionToken(readCookie(request, COOKIE_NAME), config);
  return json({ authenticated }, authenticated ? 200 : 401);
}

export async function POST(request: Request) {
  const config = getConfig();
  if (!config) return missingConfigResponse();

  let email = '';
  let password = '';
  try {
    const body = await request.json();
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';
    password = typeof body?.password === 'string' ? body.password.slice(0, 1024) : '';
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const emailMatches = safeEqual(email, config.email);
  const passwordMatches = safeEqual(password, config.password);
  if (!emailMatches || !passwordMatches) {
    return json({ authenticated: false, error: 'Invalid email or password.' }, 401);
  }

  return json({ authenticated: true }, 200, {
    'Set-Cookie': sessionCookie(createSessionToken(config), SESSION_TTL_SECONDS),
  });
}

export function DELETE() {
  return json({ authenticated: false }, 200, { 'Set-Cookie': sessionCookie('', 0) });
}
