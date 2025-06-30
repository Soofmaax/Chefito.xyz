// src/lib/imageLoader.js
function imageLoader({ src, width, quality }) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  const q = quality || 75;
  return `${src}?w=${width}&q=${q}`;
}

export default imageLoader;
