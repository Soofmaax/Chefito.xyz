// Custom image loader pour Next.js
export default function imageLoader({ src, width, quality }) {
  if (!src) return '';

  // Si c'est une URL absolue (hébergée ailleurs), on ne touche pas
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Sinon, on traite l'image locale
  const q = quality || 75;
  return `${src}?w=${width}&q=${q}`;
}
