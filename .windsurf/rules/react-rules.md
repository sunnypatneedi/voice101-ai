---
trigger: manual
---

# React Best Practices: Hooks, Performance, and Accessibility

## Table of Contents

1. [React Hooks Rules](#react-hooks-rules)
2. [Performance Optimization](#performance-optimization)
3. [Mobile First & Accessibility](#mobile-first--accessibility)
4. [Component Structure](#component-structure)
5. [Error Handling](#error-handling)
6. [Testing Strategy](#testing-strategy)
7. [Case Study: Index Component Refactoring](#case-study-index-component-refactoring)
8. [Hook Execution Order Validation](#hook-execution-order-validation)

## React Hooks Rules

### Consistent Hook Execution Order

The most critical rule for React hooks is maintaining a consistent execution order across renders. This means:

✅ **DO**:
- Place all hooks at the top level of your component
- Ensure hooks execute in the same order on every render
- Use conditional rendering with ternary operators instead of early returns
- Always maintain the same component tree structure
- Test hook execution order across different component states

❌ **DON'T**:
- Use hooks in conditionals, loops, or nested functions
- Use early returns before all hooks have executed
- Create inconsistent component trees between renders
- Use Immediately Invoked Function Expressions (IIFEs) containing hooks
- Conditionally render Suspense components that might contain hooks

```tsx
// INCORRECT - Early return creates inconsistent hook execution
function BadComponent() {
  const [isLoading, setIsLoading] = useState(true);
  
  // This early return creates an inconsistent execution path
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // This hook won't run when loading is true!
  useEffect(() => {
    fetchData();
  }, []);
  
  return <MainContent />;
}

// CORRECT - Consistent hook execution with conditional rendering
function GoodComponent() {
  const [isLoading, setIsLoading] = useState(true);
  
  // All hooks run in consistent order on every render
  useEffect(() => {
    fetchData();
  }, []);
  
  // Use conditional rendering instead of early return
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <MainContent />
      )}
    </>
  );
}
```

### Advanced Hook Execution Patterns

We've found several subtle patterns that can break hook execution order:

1. **Console Logging**: Excessive console.log statements in development can create inconsistent execution paths, especially when performance timing.

2. **Conditional Suspense**: Unlike standard React components, dynamically rendering Suspense boundaries can disrupt component trees.

```tsx
// PROBLEMATIC: Inconsistent Suspense boundary may affect child hooks
function ProblemComponent() {
  // Hooks defined here
  
  return (
    <div>
      {shouldShowFeature ? (
        <Suspense fallback={<Spinner />}>
          <LazyComponent /> {/* Hooks in LazyComponent may execute inconsistently */}
        </Suspense>
      ) : null}
    </div>
  );
}

// BETTER: Consistent Suspense boundary with conditional child components
function BetterComponent() {
  // Hooks defined here
  
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        {shouldShowFeature ? <LazyComponent /> : null}
      </Suspense>
    </div>
  );
}
```

3. **Performance Measurement**: Performance monitoring hooks and code should be carefully implemented to avoid affecting component behavior.

### Hook Dependency Arrays

Properly managing hook dependencies is essential for preventing infinite loops and ensuring optimal performance:

- Always specify all variables used within the hook that might change between renders
- Use ESLint's `exhaustive-deps` rule to catch missing dependencies
- Consider using `useCallback` and `useMemo` to stabilize function and object references

```tsx
// Example: Proper useEffect dependency management
useEffect(() => {
  // This effect depends on userId and filters
  fetchUserData(userId, filters);
  
  // Cleanup function to cancel requests on unmount or deps change
  return () => cancelPendingRequests();
}, [userId, filters]); // All dependencies explicitly listed
```

## Performance Optimization

### Measuring Component Performance

We've implemented a comprehensive performance measurement strategy in Meduler:

1. **Custom Performance Hooks**: `usePerformanceMetrics` provides detailed timing for:
   - Component mount time
   - Render cycles
   - Effect execution time 
   - Time to interactive
   - DOM node count

2. **Non-Intrusive Measurement**: Performance metrics are collected without affecting component behavior:
   - No conditional execution paths are created by the measurement code
   - Metrics are reported through a dedicated performance service rather than console logs
   - Hooks consistent execution is strictly maintained

3. **Implementation Guidelines**:
   - Place performance measurement hooks at the top of the component
   - Call `measureRender()` as early as possible in the component
   - Call the returned function (e.g., `endRenderMeasure()`) at the end of the component
   - Avoid creating conditional logging paths

```tsx
// Correct performance measurement implementation
function OptimizedComponent() {
  // 1. Initialize performance hook first
  const { measureRender, markInteractive } = usePerformanceMetrics('ComponentName');
  
  // 2. Start measuring render immediately
  const endRenderMeasure = measureRender();
  
  // 3. Normal component code and hooks
  const [state, setState] = useState(initialState);
  
  // 4. Mark interactive point if needed
  if (someCondition) {
    markInteractive();
  }
  
  // 5. Return component JSX
  return (
    <div>
      {/* Component content */}
      {/* End the render measurement at the very end */}
      {endRenderMeasure()}
    </div>
  );
}
```

4. **Key Performance Indicators**:
   - First Contentful Paint (FCP) should be under 1.8 seconds
   - Time To Interactive (TTI) should be under 3.5 seconds
   - Total Blocking Time (TBT) should be under 300ms
   - Component render time should be under 1