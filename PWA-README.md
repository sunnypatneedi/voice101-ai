# Voice101 AI - Progressive Web App (PWA) Setup

This document outlines the PWA configuration and setup for the Voice101 AI application.

## PWA Features

- **Offline Support**: Service worker caches assets for offline use
- **Installable**: Can be installed on the user's device
- **App-like Experience**: Full-screen, standalone mode
- **Push Notifications**: Support for web push notifications
- **Background Sync**: Sync data when connection is restored
- **File Handling**: Open audio files directly in the app
- **Share Target**: Share audio files to the app

## Service Worker

The service worker is located at `public/sw.js` and is configured to:

- Cache core assets for offline use
- Handle fetch events with network-first strategy
- Clean up old caches
- Support precaching of assets

## Configuration

### Vite PWA Plugin

The app uses `vite-plugin-pwa` with the following key configurations:

- **Strategy**: `injectManifest` for custom service worker logic
- **Register Type**: `autoUpdate` for automatic updates
- **Workbox**: Custom runtime caching strategies
- **Manifest**: Comprehensive web app manifest for PWA installation

### Environment Variables

- `VITE_PWA_DEV`: Set to `true` to enable PWA in development mode
- `VITE_APP_NAME`: Application name
- `VITE_APP_DESCRIPTION`: Application description

## Development

### Testing the PWA

1. Build the app for production:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npx serve -s dist
   ```

3. Open Chrome DevTools > Application > Service Workers to verify the service worker is registered

### Testing Offline Mode

1. In Chrome DevTools, go to the Application tab
2. Check the "Offline" checkbox
3. Refresh the page to test offline functionality

## Deployment

The PWA is configured to work with most static hosting providers. Ensure the following:

1. The server serves the `sw.js` file with the correct MIME type: `application/javascript`
2. The `manifest.json` is served with the correct MIME type: `application/manifest+json`
3. HTTPS is enabled for service worker registration

## Troubleshooting

### Service Worker Not Registering

1. Check the console for any errors
2. Verify the service worker file is being served with the correct MIME type
3. Ensure the service worker scope is correct

### Manifest Issues

1. Use the [Web App Manifest Validator](https://www.stefanjudis.com/today-i-learned/the-chrome-devtools-application-tab-helps-you-to-validate-your-web-app-manifest/)
2. Check for any validation errors in the Application tab of Chrome DevTools

### Cache Issues

1. Clear the site data in Chrome DevTools > Application > Clear storage
2. Unregister the service worker in Chrome DevTools > Application > Service Workers

## Resources

- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://github.com/antfu/vite-plugin-pwa)
