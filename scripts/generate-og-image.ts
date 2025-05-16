import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

// Fallback OG image path
const FALLBACK_OG_IMAGE = path.join(process.cwd(), 'public', 'assets', 'images', 'og-fallback.jpg');

const generateOgImage = async () => {
  console.log('🚀 Starting OG image generation...');
  
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'images');
  const outputPath = path.join(outputDir, 'og-image.jpg');
  const htmlPath = path.join(process.cwd(), 'scripts', 'generate-og-image.html');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Skip if fallback exists and we're in CI
  if (process.env.CI && fs.existsSync(FALLBACK_OG_IMAGE)) {
    console.log('⏭️  CI environment detected and fallback exists, skipping OG image generation');
    // Ensure we have the fallback image in place
    if (!fs.existsSync(outputPath) && fs.existsSync(FALLBACK_OG_IMAGE)) {
      fs.copyFileSync(FALLBACK_OG_IMAGE, outputPath);
      console.log(`✅ Copied fallback OG image to: ${outputPath}`);
    }
    return;
  }
  
  // Use fallback if HTML template doesn't exist
  if (!fs.existsSync(htmlPath)) {
    console.warn(`⚠️  HTML template not found at ${htmlPath}`);
    if (fs.existsSync(FALLBACK_OG_IMAGE)) {
      fs.copyFileSync(FALLBACK_OG_IMAGE, outputPath);
      console.log(`✅ Copied fallback OG image to: ${outputPath}`);
      return;
    }
    throw new Error('HTML template not found and no fallback image available');
  }
  
  let browser;
  try {
    // Try to launch browser with production settings first
    const launchOptions: any = {
      headless: 'shell',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-software-rasterizer',
      ]
    };
    
    // Add executable path if provided
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    
    console.log('Launching browser with options:', JSON.stringify({
      ...launchOptions,
      // Don't log the full path in CI logs for security
      executablePath: launchOptions.executablePath ? '***' : undefined
    }, null, 2));
    
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    
    // Set viewport to match OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2, // For higher quality
    });
    
    console.log(`📄 Loading HTML from: ${htmlPath}`);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Set content and wait for network to be idle
    console.log('🔄 Setting page content...');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000 // 30 seconds timeout
    });
    
    // Wait for fonts to load
    console.log('⏳ Waiting for fonts to load...');
    await page.evaluateHandle('document.fonts.ready');
    
    // Add a small delay to ensure everything is rendered
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    
    // Try to use fallback image if available
    if (fs.existsSync(FALLBACK_OG_IMAGE) && !fs.existsSync(outputPath)) {
      console.log('⚠️  Using fallback OG image');
      fs.copyFileSync(FALLBACK_OG_IMAGE, outputPath);
      return;
    }
    
    // If we get here, we couldn't generate or use a fallback
    if (!fs.existsSync(FALLBACK_OG_IMAGE)) {
      console.error('❌ No fallback OG image available');
    }
    
    // Don't fail the build in CI, but do in development
    if (!process.env.CI) {
      process.exit(1);
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
};

// Run the generation
generateOgImage();
