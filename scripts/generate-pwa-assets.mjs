import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const SIZES = [192, 512];
const ASSETS_DIR = path.join(process.cwd(), 'public/assets/images');

async function generatePwaAssets() {
  try {
    // Create assets directory if it doesn't exist
    await fs.mkdir(ASSETS_DIR, { recursive: true });

    // Process logo
    const logoPath = path.join(ASSETS_DIR, 'logo.png');
    
    for (const size of SIZES) {
      const outputPath = path.join(ASSETS_DIR, `logo-${size}x${size}.png`);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 13, g: 17, b: 23, alpha: 1 } // Match theme color
        })
        .toFile(outputPath);
      
      console.log(`Generated: ${outputPath}`);
    }
    
    console.log('✅ PWA assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating PWA assets:', error);
    process.exit(1);
  }
}

generatePwaAssets();
