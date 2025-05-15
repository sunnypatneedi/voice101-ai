import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const generateOgImage = async () => {
  console.log('🚀 Starting OG image generation...');
  
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'images');
  const outputPath = path.join(outputDir, 'og-image.jpg');
  const htmlPath = path.join(process.cwd(), 'scripts', 'generate-og-image.html');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to match OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2, // For higher quality
    });
    
    // Load the HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });
    
    // Wait for fonts and images to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 90,
      fullPage: true,
    });
    
    console.log(`✅ OG image generated successfully at: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
};

// Run the generation
generateOgImage();
