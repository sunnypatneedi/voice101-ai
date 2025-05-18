import React from 'react';

/**
 * Performs a shallow comparison between two arrays.
 * Returns true if both arrays have the same elements in the same order.
 */
export function shallowEqualArrays<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

/**
 * Creates a stable version of an array that maintains referential equality
 * when the contents haven't changed.
 */
export function useStableArray<T>(array: T[]): T[] {
  const ref = React.useRef<T[]>(array);
  
  // Only update the ref if the array contents have changed
  if (!shallowEqualArrays(ref.current, array)) {
    ref.current = array;
  }
  
  return ref.current;
}
