import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Import @napi-rs/canvas
import { createCanvas, loadImage } from '@napi-rs/canvas';

async function createFallbackImage() {
  const outputDir = join(process.cwd(), 'public', 'assets', 'images');
  const outputPath = join(outputDir, 'og-fallback.jpg');
  
  // Create output directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  // Skip if already exists
  if (existsSync(outputPath)) {
    console.log(`⏭️  Fallback image already exists at: ${outputPath}`);
    return;
  }
  
  try {
    // Create a canvas
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Add gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f3460');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Title
    ctx.font = 'bold 60px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Voice101 AI', width / 2, height / 2 - 50);
    
    // Subtitle
    ctx.font = '30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText('AI-Powered Voice Cloning Platform', width / 2, height / 2 + 40);
    
    // Save the image
    const buffer = await canvas.encode('jpeg', 90);
    writeFileSync(outputPath, buffer);
    
    console.log(`✅ Created fallback OG image at: ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to create fallback image:', error);
    throw error;
  }
}

// Run the function
createFallbackImage().catch(console.error);
