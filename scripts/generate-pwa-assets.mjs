import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

// Define sizes for various icons (in pixels)
const SIZES = [192, 512];
const APPLE_TOUCH_SIZES = [180]; // Standard size for apple-touch-icon
const MASKABLE_SIZES = [192, 512]; // Sizes for maskable icons
const ASSETS_DIR = path.join(process.cwd(), 'public/assets/images');

/**
 * Generate all PWA assets including standard, Apple touch, and maskable icons
 * This ensures the app works properly on all devices and platforms
 */
async function generatePwaAssets() {
  try {
    // Create assets directory if it doesn't exist
    await fs.mkdir(ASSETS_DIR, { recursive: true });

    // Get the source logo path
    const logoPath = path.join(ASSETS_DIR, 'logo.png');
    
    // Generate standard app icons
    for (const size of SIZES) {
      const outputPath = path.join(ASSETS_DIR, `logo-${size}x${size}.png`);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 13, g: 17, b: 23, alpha: 1 } // Match theme color
        })
        .toFile(outputPath);
      
      console.log(`Generated standard icon: ${outputPath}`);
    }
    
    // Generate Apple touch icons (for iOS devices)
    for (const size of APPLE_TOUCH_SIZES) {
      const outputPath = path.join(ASSETS_DIR, `apple-touch-icon-${size}x${size}.png`);
      const appleIconPath = path.join(process.cwd(), 'public', `apple-touch-icon.png`); // Root-level icon
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 13, g: 17, b: 23, alpha: 1 }
        })
        .toFile(outputPath);
      
      // Also create the standard apple-touch-icon at the root level (required by iOS)
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 13, g: 17, b: 23, alpha: 1 }
        })
        .toFile(appleIconPath);
      
      console.log(`Generated Apple touch icon: ${outputPath}`);
      console.log(`Generated root Apple touch icon: ${appleIconPath}`);
    }
    
    // Generate maskable icons (for Android adaptive icons)
    // These have padding to ensure the important parts of the icon are visible
    // in the safe area of adaptive icon shapes
    for (const size of MASKABLE_SIZES) {
      const outputPath = path.join(ASSETS_DIR, `maskable-icon-${size}x${size}.png`);
      
      // Create a maskable icon with proper padding (safe zone is 40% of the icon)
      // See: https://web.dev/articles/maskable-icon
      const padding = Math.floor(size * 0.1); // 10% padding
      const innerSize = size - (padding * 2);
      
      await sharp(logoPath)
        .resize(innerSize, innerSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 13, g: 17, b: 23, alpha: 1 } // Match theme color
        })
        .toFile(outputPath);
      
      console.log(`Generated maskable icon: ${outputPath}`);
    }
    
    console.log('✅ All PWA assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating PWA assets:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

generatePwaAssets();
