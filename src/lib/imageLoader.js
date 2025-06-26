// Custom image loader pour Next.js export
export default function imageLoader({ src, width, quality }) {
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (src.startsWith('http')) {
    return src;
  }
  
  // Pour les images locales, ajouter le préfixe approprié
  return `${src}?w=${width}&q=${quality || 75}`;
}