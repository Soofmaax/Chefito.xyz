const fs = require('fs');
const path = require('path');

/**
 * Simple favicon generation script that works in WebContainer
 * Since we can't use canvas in WebContainer, this script will create
 * a simple SVG-based favicon and copy existing icons
 */

console.log('🎨 Generating favicon and app icons...');

// Create a simple SVG favicon
const svgFavicon = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#FF6B35"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">C</text>
</svg>
`.trim();

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write SVG favicon
const faviconPath = path.join(publicDir, 'favicon.svg');
fs.writeFileSync(faviconPath, svgFavicon);
console.log('✅ Created favicon.svg');

// Create a simple HTML favicon fallback
const htmlFavicon = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; width: 32px; height: 32px; }
    .favicon { 
      width: 32px; 
      height: 32px; 
      background: #FF6B35; 
      border-radius: 6px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-family: Arial, sans-serif; 
      font-size: 18px; 
      font-weight: bold; 
      color: white; 
    }
  </style>
</head>
<body>
  <div class="favicon">C</div>
</body>
</html>
`.trim();

// Check if favicon.ico already exists, if not create a placeholder
const faviconIcoPath = path.join(publicDir, 'favicon.ico');
if (!fs.existsSync(faviconIcoPath)) {
  // Create a simple text file as placeholder since we can't generate ICO in WebContainer
  fs.writeFileSync(faviconIcoPath + '.html', htmlFavicon);
  console.log('✅ Created favicon.ico.html (placeholder)');
}

// Ensure icons directory exists
const iconsDir = path.join(publicDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create simple SVG icons for different sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svgIcon = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${Math.floor(size * 0.1875)}" fill="#FF6B35"/>
  <text x="${size/2}" y="${size * 0.7}" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" text-anchor="middle" fill="white">C</text>
</svg>
  `.trim();
  
  const iconPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(iconPath, svgIcon);
});

console.log('✅ Created SVG icons for all sizes');

// Create apple-touch-icon
const appleTouchIcon = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="33" fill="#FF6B35"/>
  <text x="90" y="125" font-family="Arial, sans-serif" font-size="90" font-weight="bold" text-anchor="middle" fill="white">C</text>
</svg>
`.trim();

const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.svg');
fs.writeFileSync(appleTouchIconPath, appleTouchIcon);
console.log('✅ Created apple-touch-icon.svg');

console.log('🎉 Favicon generation completed!');
console.log('📝 Note: SVG favicons created. For production, consider converting to ICO/PNG format.');