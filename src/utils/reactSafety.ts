/**
 * React Safety Check
 *
 * This script ensures React is properly loaded and available before the application starts.
 * It should be imported as the first thing in your main entry file.
 */

import React from "react";

// Make React available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Export React to ensure it's included in the bundle
export { React };

// Extend Window interface to include React and devtools
interface ExtendedWindow extends Window {
  React: typeof React;
  __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
    renderers?: Map<any, any>;
    [key: string]: any;
  };
  __reactSafetyCheck?: {
    checkReact: () => boolean;
    isReady: boolean;
  };
}

// Check if React is available
const checkReact = (): boolean => {
  const requiredReactExports = [
    "createElement",
    "Component",
    "Fragment",
    "useState",
    "useEffect",
    "forwardRef",
    "memo",
  ];

  const errors: string[] = [];
  const warnings: string[] = [];

  // Debug information about the loaded React build
  if (typeof React !== "undefined") {
    console.info(
      "[reactSafety] React version detected:",
      (React as any).version,
    );
    console.info(
      "[reactSafety] forwardRef type:",
      typeof (React as any).forwardRef,
    );
  } else {
    console.warn("[reactSafety] React object is undefined");
  }

  // Check if React is available
  const win = window as unknown as ExtendedWindow;
  if (typeof window !== "undefined" && !win.React) {
    errors.push("React is not available on the window object");
  }

  // Check required exports
  if (typeof React === "undefined") {
    errors.push("React is not defined");
  } else {
    requiredReactExports.forEach((exportName) => {
      if (typeof (React as any)[exportName] === "undefined") {
        errors.push(`React.${exportName} is not defined`);
      }
    });
  }

  // Check for multiple versions of React
  if (win.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size > 1) {
    warnings.push("Multiple versions of React detected");
  }

  // Log any issues
  if (errors.length > 0 || warnings.length > 0) {
    console.group("%cReact Safety Check", "font-weight: bold; color: #e74c3c;");

    if (errors.length > 0) {
      console.error("%cErrors:", "font-weight: bold; color: #e74c3c;");
      errors.forEach((error) => console.error(`- ${error}`));
    }

    if (warnings.length > 0) {
      console.warn("%cWarnings:", "font-weight: bold; color: #f39c12;");
      warnings.forEach((warning) => console.warn(`- ${warning}`));
    }

    console.groupEnd();

    if (errors.length > 0) {
      // Show a user-friendly error message in production
      if (process.env.NODE_ENV === "production") {
        document.body.innerHTML = `
          <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            border: 1px solid #e74c3c;
            border-radius: 4px;
            background-color: #fdecea;
            color: #333;
          ">
            <h1 style="color: #c0392b; margin-top: 0;">Application Error</h1>
            <p>There was a problem loading the application. Please try refreshing the page.</p>
            <div style="margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 4px; font-family: monospace; font-size: 0.9em;">
              <p style="margin: 0 0 0.5rem 0; font-weight: bold;">Error Details:</p>
              <ul style="margin: 0; padding-left: 1.2rem;">
                ${errors.map((error) => `<li>${error}</li>`).join("")}
              </ul>
            </div>
          </div>
        `;
      }

      // Return false to indicate failure
      return false;
    }
  }

  // Everything is good
  return true;
};

// Run the check when the script loads
const isReactReady = checkReact();

// Export the check function and result
export { checkReact, isReactReady };

// Make the check available globally for debugging
if (typeof window !== "undefined") {
  const win = window as unknown as ExtendedWindow;
  win.__reactSafetyCheck = { checkReact, isReady: isReactReady };
}