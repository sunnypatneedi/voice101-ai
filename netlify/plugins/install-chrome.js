// Netlify plugin to install Chrome for Puppeteer
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      console.log('🚀 Setting up Chrome for Puppeteer...');
      
      // Install Chrome dependencies
      console.log('📦 Installing Chrome dependencies...');
      execSync('apt-get update && apt-get install -y wget gnupg2', { stdio: 'inherit' });
      
      // Install Chrome
      console.log('⬇️  Downloading Chrome...');
      execSync('wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -', { stdio: 'inherit' });
      execSync('sh -c \'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list\'', { stdio: 'inherit' });
      execSync('apt-get update && apt-get install -y google-chrome-stable', { stdio: 'inherit' });
      
      // Set Chrome path for Puppeteer
      const chromePath = '/usr/bin/google-chrome-stable';
      if (fs.existsSync(chromePath)) {
        console.log(`✅ Chrome installed at: ${chromePath}`);
        process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;
      } else {
        console.warn('⚠️  Chrome not found at expected path, falling back to system Chrome');
      }
      
      // Verify Chrome version
      try {
        const version = execSync(`${chromePath} --version`).toString().trim();
        console.log(`🌐 ${version}`);
      } catch (e) {
        console.warn('⚠️  Could not verify Chrome version:', e.message);
      }
      
    } catch (error) {
      console.error('❌ Failed to set up Chrome:', error);
      // Don't fail the build, as we have fallback mechanisms
      utils.build.failBuild('Chrome setup failed, but continuing with fallback');
    }
  }
};
