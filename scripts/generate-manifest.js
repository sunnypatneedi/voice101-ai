const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const manifest = {
  name: 'Voice101 AI',
  short_name: 'Voice101',
  description: packageJson.description || 'Voice101 AI Application',
  start_url: '/',
  display: 'standalone',
  theme_color: '#2563eb',
  background_color: '#ffffff',
  icons: [
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-256x256.png',
      sizes: '256x256',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
  screenshots: [
    // Add screenshots for app store listings
  ],
  categories: ['productivity', 'utilities'],
  shortcuts: [
    // Add app shortcuts
  ],
  // Add any additional PWA features
  related_applications: [],
  prefer_related_applications: false,
};

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the manifest file
fs.writeFileSync(
  path.join(publicDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Generated web app manifest');
