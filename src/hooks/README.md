# React Hooks Utilities

This directory contains custom React hooks and utilities for building robust React applications with proper performance monitoring, validation, and debugging capabilities.

## Available Hooks

### 1. usePerformanceMetrics

A hook for tracking component performance metrics including render times, effect counts, and time to interactive.

```typescript
import { usePerformanceMetrics } from './usePerformanceMetrics';

function MyComponent() {
  const { measureRender, markInteractive } = usePerformanceMetrics('MyComponent');
  const endRenderMeasure = measureRender();
  
  // Your component code
  
  // Mark when component becomes interactive
  useEffect(() => {
    markInteractive();
  }, []);
  
  // End render measurement
  return (
    <div>
      {/* Component content */}
      {endRenderMeasure()}
    </div>
  );
}
```

### 2. useHookValidator

Validates hook usage and execution order to catch common React hook mistakes.

```typescript
import { useHookValidator } from './useHookValidator';

function ValidatedComponent() {
  useHookValidator({
    componentName: 'ValidatedComponent',
    logCalls: true,
    throwOnError: process.env.NODE_ENV === 'development',
  });
  
  // Your component code with hooks
}
```

### 3. useHookDebug

Debug hook usage and track performance.

```typescript
import { useHookDebug } from './useHookDebug';

function DebugComponent() {
  const { getHookCalls } = useHookDebug({
    componentName: 'DebugComponent',
    logCalls: true,
  });
  
  // Your component code
}
```

### 4. Component Validation

Validate component structure and patterns.

```typescript
import { useComponentValidator } from '../utils/componentValidator';

function ValidatedComponent() {
  const { validateAccessibility } = useComponentValidator({
    componentName: 'ValidatedComponent',
    rules: {
      maxRenderTime: 16, // 16ms for 60fps
      maxEffects: 5,
    },
  });
  
  // Your component code
}
```

## Best Practices

1. **Consistent Hook Order**: Always call hooks in the same order on every render.
2. **Performance Monitoring**: Use `usePerformanceMetrics` to track and optimize component performance.
3. **Validation**: Use `useHookValidator` in development to catch hook-related issues early.
4. **Accessibility**: Use the accessibility validation features to ensure your components are accessible.
5. **Testing**: Test your components with different states and props to ensure consistent behavior.

## Development

### Adding New Hooks

1. Create a new file in this directory with the naming convention `use*.ts`.
2. Export your hook as the default export.
3. Add TypeScript types for all parameters and return values.
4. Include JSDoc comments for better IDE support.
5. Add tests in the `__tests__` directory.

### Testing

Run the test suite:

```bash
npm test
```

### Linting

Ensure your code follows the project's coding standards:

```bash
npm run lint
```

## License

MIT
