import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  widths?: number[];
  quality?: number;
  loading?: 'eager' | 'lazy';
  style?: React.CSSProperties;
  [key: string]: any;
}

import React, { ForwardedRef } from 'react';

const OptimizedImage = React.forwardRef(({
  src,
  alt,
  className = '',
  widths = [400, 800, 1200],
  quality = 85,
  loading = 'lazy',
  style = {},
  ...props
}: OptimizedImageProps, ref: ForwardedRef<HTMLImageElement>) => {
  // If it's an external URL, use a regular img tag
  if (src.startsWith('http') || src.startsWith('//')) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        style={style}
        {...props}
      />
    );
  }

  // For local images, use the Vite image optimization
  const basePath = src.startsWith('/') ? src : `/${src}`;
  const srcSet = widths
    .map((width) => {
      const params = new URLSearchParams({
        w: width.toString(),
        q: quality.toString(),
        format: 'webp',
      });
      return `${basePath}?${params} ${width}w`;
    })
    .join(',');

  const defaultSrc = `${basePath}?w=${Math.max(...widths)}&q=${quality}&format=webp`;
  const imgExtension = src.split('.').pop()?.toLowerCase() || 'jpeg';

  return (
    <picture>
      {/* WebP source */}
      <source
        srcSet={srcSet}
        type="image/webp"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
      {/* Fallback to original format */}
      <source
        srcSet={`${basePath}?w=${Math.max(...widths)}&q=${quality}`}
        type={`image/${imgExtension}`}
      />
      {/* Fallback img element */}
      <img
        ref={ref}
        src={defaultSrc}
        srcSet={srcSet}
        alt={alt}
        className={className}
        loading={loading}
        style={style}
        {...props}
      />
    </picture>
  );
};

const ForwardedOptimizedImage = forwardRef(OptimizedImage);
ForwardedOptimizedImage.displayName = 'OptimizedImage';

export default ForwardedOptimizedImage;
