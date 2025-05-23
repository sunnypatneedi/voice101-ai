import { Workbox } from 'workbox-window';

declare global {
  interface Window {
    workbox?: Workbox;
  }
}

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onWaiting?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  const wb = new Workbox(swUrl);
  window.workbox = wb;

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      // An update to the service worker is available
      console.log('New content is available and will be used when all tabs are closed.');
      
      // Execute callback
      if (config && config.onUpdate) {
        config.onUpdate(wb.registration);
      }
    } else {
      // Service worker installed for the first time
      console.log('Content is cached for offline use.');
      
      // Execute callback
      if (config && config.onSuccess) {
        config.onSuccess(wb.registration);
      }
    }
  });

  wb.addEventListener('waiting', (event) => {
    // A new service worker has installed, but it can't activate until all tabs are closed
    console.log('A new service worker is waiting to activate.');
    
    // Execute callback
    if (config && config.onWaiting) {
      config.onWaiting(wb.registration);
    }
  });

  wb.addEventListener('controlling', (event) => {
    // This event is fired when this service worker becomes the active service worker
    console.log('Service worker now controls this page.');
    window.location.reload();
  });

  // Register the service worker
  wb.register()
    .then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Check for updates every hour
      const updateInterval = setInterval(() => {
        registration.update().catch(console.error);
      }, 60 * 60 * 1000);
      
      // Return cleanup function
      return () => clearInterval(updateInterval);
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

export async function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  }
}
