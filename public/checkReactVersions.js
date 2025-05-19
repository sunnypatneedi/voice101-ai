// This script checks for multiple React instances
console.group('[React Version Check]');
console.log('window.React:', window.React);
console.log('window.React.version:', window.React?.version);
console.log('window.ReactDOM:', window.ReactDOM);
console.log('window.ReactDOM.version:', window.ReactDOM?.version);

// Check for multiple React instances
const allElements = document.querySelectorAll('*');
const reactRoots = [];

allElements.forEach(el => {
  if (el._reactRootContainer) {
    reactRoots.push(el);
  }
});

console.log('React root containers found:', reactRoots.length);
console.groupEnd();
