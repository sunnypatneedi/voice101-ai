import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const setupSimStudio = async () => {
  console.log('🚀 Setting up Simulator Studio...');
  
  const rootDir = process.cwd();
  const simStudioDir = path.join(rootDir, 'sim-studio');
  const publicDir = path.join(rootDir, 'public', 'sim-studio');
  
  try {
    // Check if sim-studio directory exists
    if (!fs.existsSync(simStudioDir)) {
      console.log('🔍 Simulator Studio not found. Cloning repository...');
      execSync('git clone https://github.com/sunnypatneedi/voiceai-sim-studio.git sim-studio', { stdio: 'inherit' });
    }
    
    console.log('📦 Installing dependencies...');
    process.chdir(simStudioDir);
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('🏗️  Building Simulator Studio...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Create public directory if it doesn't exist
    if (!fs.existsSync(path.join(rootDir, 'public'))) {
      fs.mkdirSync(path.join(rootDir, 'public'));
    }
    
    // Remove existing sim-studio directory in public if it exists
    if (fs.existsSync(publicDir)) {
      console.log('🗑️  Removing existing Simulator Studio build...');
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
    
    console.log('📂 Copying build files to public directory...');
    fs.mkdirSync(publicDir, { recursive: true });
    
    // Copy all files from sim-studio/dist to public/sim-studio
    const copyRecursiveSync = (src: string, dest: string) => {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyRecursiveSync(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    
    copyRecursiveSync(path.join(simStudioDir, 'dist'), publicDir);
    
    console.log('✅ Simulator Studio setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up Simulator Studio:', error);
    process.exit(1);
  }
};

// Run the setup
setupSimStudio();
