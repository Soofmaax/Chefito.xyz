interface RateLimitEntry {
  count: number;
  timestamp: number;
}

const requests = new Map<string, RateLimitEntry>();

export function rateLimit(ip: string, limit = 60, duration = 60_000): boolean {
  const now = Date.now();
  const entry = requests.get(ip);

  if (entry && now - entry.timestamp < duration) {
    entry.count += 1;
    if (entry.count > limit) {
      return false;
    }
    requests.set(ip, entry);
  } else {
    requests.set(ip, { count: 1, timestamp: now });
  }

  return true;
}

