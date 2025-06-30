const assert = require('assert');

function isValidUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return !url.includes('your_supabase_url_here') &&
           !url.includes('your-project.supabase.co') &&
           !url.includes('demo.supabase.co');
  } catch {
    return false;
  }
}

function isValidKey(key) {
  return !!(key && key !== 'your_supabase_anon_key_here' && key !== 'your_supabase_anon_key' && key !== 'demo-key' && key.length > 10);
}

function isSupabaseConfigured(url, key) {
  return isValidUrl(url) && isValidKey(key);
}

assert.strictEqual(isSupabaseConfigured('https://your-project.supabase.co', 'somekey123456789'), false);
assert.strictEqual(isSupabaseConfigured('https://valid.supabase.co', 'your_supabase_anon_key'), false);
assert.strictEqual(isSupabaseConfigured('https://valid.supabase.co', 'validKey1234567890'), true);

console.log('Tests passed');
