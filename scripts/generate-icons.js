import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const svgPath = join(projectRoot, 'public/icons/icon.svg');
const outputDir = join(projectRoot, 'public');

async function generateIcons() {
  console.log('🎨 Generating PWA icons from SVG...');

  const svgBuffer = readFileSync(svgPath);

  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.ico', size: 32 }
  ];

  for (const { name, size } of sizes) {
    const outputPath = join(outputDir, name);

    if (name.endsWith('.ico')) {
      // Generate 32x32 PNG for favicon
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath.replace('.ico', '-temp.png'));

      console.log(`✅ Generated ${name} (as PNG) - ${size}x${size}`);
    } else {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} - ${size}x${size}`);
    }
  }

  // Copy SVG as mask-icon
  const maskIconPath = join(outputDir, 'mask-icon.svg');
  writeFileSync(maskIconPath, readFileSync(svgPath));
  console.log('✅ Generated mask-icon.svg');

  // Generate a simple ICO file (using 32x32 PNG)
  const tempPngPath = join(outputDir, 'favicon-temp.png');
  const icoPath = join(outputDir, 'favicon.ico');

  // For ICO, we'll just use the PNG for now (proper ICO conversion requires additional tools)
  // Most modern browsers accept PNG as favicon anyway
  const faviconBuffer = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  writeFileSync(icoPath, faviconBuffer);
  console.log('✅ Generated favicon.ico');

  console.log('\n✨ All icons generated successfully!');
}

generateIcons().catch(console.error);
