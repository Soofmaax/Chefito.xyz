const requests = new Map();

function rateLimit(ip, limit = 60, duration = 60_000) {
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

module.exports = { rateLimit };

