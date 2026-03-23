const requests = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_SUMMARIZE = 10;          // 10 summaries per hour per IP
const MAX_QA = 30;                 // 30 questions per hour per IP

export function checkRateLimit(
  ip: string,
  type: 'summarize' | 'qa'
): { allowed: boolean; remaining: number } {
  const limit = type === 'summarize' ? MAX_SUMMARIZE : MAX_QA;
  const key = `${type}:${ip}`;
  const now = Date.now();

  const entry = requests.get(key);

  if (!entry || now > entry.resetTime) {
    requests.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
