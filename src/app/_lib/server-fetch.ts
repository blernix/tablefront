import 'server-only';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function getServerToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value ?? null;
}

export async function serverFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number | false }
): Promise<T | null> {
  const token = getServerToken();
  if (!token) return null;

  const { revalidate = 30, ...fetchOptions } = options || {};

  const url = `${API_URL}/api/v1${endpoint}`;

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
      next: revalidate ? { revalidate } : undefined,
      cache: revalidate === false ? 'no-store' : undefined,
    });

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return res.json();
    }

    return null;
  } catch {
    return null;
  }
}
