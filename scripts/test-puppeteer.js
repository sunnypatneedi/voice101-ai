import puppeteer from 'puppeteer';

async function testPuppeteer() {
  console.log('🚀 Testing Puppeteer...');
  
  const browser = await puppeteer.launch({
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
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    console.log(`✅ Successfully loaded page with title: ${title}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'puppeteer-test.png' });
    console.log('📸 Took a screenshot: puppeteer-test.png');
    
  } catch (error) {
    console.error('❌ Puppeteer test failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testPuppeteer().catch(console.error);
