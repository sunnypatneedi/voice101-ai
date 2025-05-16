import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

const QUALITY = 80;
const IMAGE_DIRS = ['public/assets/images', 'public/lovable-uploads'];
const EXCLUDE_DIRS = ['**/node_modules/**', '**/.git/**', '**/dist/**'];

async function convertToWebP(inputPath, outputPath, quality = QUALITY) {
  try {
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });
    
    await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
    
    const originalStats = await fs.stat(inputPath);
    const webpStats = await fs.stat(outputPath);
    const savings = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(2);
    
    console.log(`Converted ${inputPath} -> ${outputPath} (${savings}% smaller)`);
    return { success: true, savings };
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message);
    return { success: false, error };
  }
}

async function processImages() {
  const patterns = IMAGE_DIRS.map(dir => `${dir}/**/*.{jpg,jpeg,png}`);
  const imageFiles = await glob(patterns, { ignore: EXCLUDE_DIRS });
  
  console.log(`Found ${imageFiles.length} images to process`);
  
  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let convertedCount = 0;
  
  for (const filePath of imageFiles) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.webp') continue; // Skip already converted files
    
    const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Skip if WebP version already exists and is newer
    try {
      const webpStats = await fs.stat(webpPath);
      const originalStats = await fs.stat(filePath);
      
      if (webpStats.mtimeMs > originalStats.mtimeMs) {
        console.log(`Skipping ${filePath} - WebP version is up to date`);
        continue;
      }
    } catch (error) {
      // WebP file doesn't exist yet, continue with conversion
    }
    
    const result = await convertToWebP(filePath, webpPath);
    
    if (result.success) {
      const originalStats = await fs.stat(filePath);
      const webpStats = await fs.stat(webpPath);
      
      totalOriginalSize += originalStats.size;
      totalWebpSize += webpStats.size;
      convertedCount++;
    }
  }
  
  if (convertedCount > 0) {
    const totalSavings = ((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(2);
    console.log(`\nConversion complete!`);
    console.log(`Converted ${convertedCount} images to WebP`);
    console.log(`Total size before: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total size after: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total savings: ${totalSavings}%`);
  } else {
    console.log('No images needed conversion');
  }
}

processImages().catch(console.error);
