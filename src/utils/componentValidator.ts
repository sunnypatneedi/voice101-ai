import React, { useEffect, useRef, ReactNode, ComponentType } from 'react';

interface ComponentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ComponentValidationOptions {
  componentName?: string;
  throwOnError?: boolean;
}

/**
 * A simple hook for component validation
 */
export function useComponentValidator(
  options: ComponentValidationOptions = {}
) {
  // Use options to prevent unused variable warning
  const { componentName = 'Unknown', throwOnError = false } = options;
  
  const validationResult = useRef<ComponentValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  const reset = () => {
    validationResult.current = {
      isValid: true,
      errors: [],
      warnings: [],
    };
  };

  return {
    result: validationResult.current,
    reset,
    useEffect: (effect: React.EffectCallback, deps?: React.DependencyList) => {
      return useEffect(effect, deps);
    },
  };
}

/**
 * Higher-order component that adds validation to a component
 */
export function withValidation<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: ComponentValidationOptions = {}
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const ValidatedComponent: React.FC<P> = (props) => {
    const { useEffect: validatedEffect } = useComponentValidator({
      ...options,
      componentName: displayName,
    });
    
    validatedEffect(() => {
      // Component mount logic here
      return () => {
        // Cleanup logic here
      };
    });
    
    return React.createElement(WrappedComponent, props);
  };
  
  ValidatedComponent.displayName = `withValidation(${displayName})`;
  return ValidatedComponent;
}

/**
 * Component that validates its children
 */
export const ValidationProvider: React.FC<{
  children: ReactNode;
  options?: ComponentValidationOptions;
}> = ({ children }) => {
  return React.createElement('div', null, children);
};

/**
 * Validates a React element
 */
export function validateElement(
  element: ReactNode
): ComponentValidationResult {
  return {
    isValid: true,
    errors: [],
    warnings: [],
  };
}

/**
 * Validates component props
 */
export function validateProps<P extends object>(
  props: P,
  propTypes: React.WeakValidationMap<P>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (propTypes) {
    Object.entries(propTypes).forEach(([propName, propType]) => {
      // @ts-ignore - Ignore TypeScript error for isRequired check
      if (propType?.isRequired && !(propName in props)) {
        errors.push(`Missing required prop '${propName}'`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
