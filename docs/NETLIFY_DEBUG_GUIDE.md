# Netlify Deployment Troubleshooting

This guide documents potential reasons why the production build on Netlify fails with `TypeError: Cannot read properties of undefined (reading 'forwardRef')`.

## Possible root causes
1. **React not included in final bundle** – tree shaking or misconfigured externalization can strip React from the build.
2. **Incompatible React version** – using an outdated version may lead to missing APIs.
3. **Incorrect bundler configuration** – Vite or other tools might alias or remove React imports.
4. **`window.React` undefined** – some libraries rely on this global which may be removed in production.
5. **Minification stripping properties** – aggressive minifiers can rename or remove `forwardRef`.
6. **Third‑party script conflicts** – other scripts may override the `React` global.
7. **Runtime environment differences** – CDN or caching issues may serve stale files.

## Most likely causes
- React being tree‑shaken or omitted from the production bundle.
- `forwardRef` being mangled during minification or bundling.

## Current logging strategy
The application now logs the React version, type of `React.forwardRef`, and any existing `window.React` reference during startup. The global error handler also reports the user agent and page location to help verify where the failure occurs.
