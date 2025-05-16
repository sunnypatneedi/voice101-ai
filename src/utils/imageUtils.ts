import React from 'react';

interface ImageSourceSet {
  srcSet: string;
  type: string;
  media?: string;
}

export function getOptimizedImage(
  src: string,
  options: {
    widths?: number[];
    formats?: string[];
    quality?: number;
  } = {}
) {
  const {
    widths = [400, 800, 1200],
    formats = ['avif', 'webp', 'original'],
    quality = 85,
  } = options;

  const basePath = src.startsWith('/') ? src : `/${src}`;
  
  const sources = formats.flatMap((format) => {
    const srcSet = widths
      .map((width) => {
        const params = new URLSearchParams({
          w: width.toString(),
          format,
          q: quality.toString(),
        });
        return `${basePath}?${params} ${width}w`;
      })
      .join(', ');

    return {
      srcSet,
      type: `image/${format === 'jpeg' ? 'jpeg' : format}`,
      media: format === 'original' ? undefined : `(max-width: ${Math.max(...widths)}px)`,
    };
  });

  return {
    src: `${basePath}?w=${Math.max(...widths)}&format=webp&q=${quality}`,
    srcSet: sources[0]?.srcSet || '',
    sources,
    width: Math.max(...widths),
    height: 0, // Will be set by the browser
  };
}

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  widths?: number[];
  formats?: string[];
  quality?: number;
}

export const OptimizedImage = React.forwardRef<HTMLPictureElement, OptimizedImageProps>(
  ({
    src,
    alt,
    widths = [400, 800, 1200],
    formats = ['avif', 'webp', 'original'],
    quality = 85,
    className,
    style,
    loading = 'lazy',
    ...props
  }, ref) => {
    const image = getOptimizedImage(src, { widths, formats, quality });

    return (
      <picture ref={ref} className={className} style={style}>
        {image.sources.map((source, index) => (
          <source
            key={`${src}-${index}`}
            srcSet={source.srcSet}
            type={source.type}
            media={source.media}
          />
        ))}
        <img
          {...props}
          src={image.src}
          srcSet={image.srcSet}
          alt={alt}
          loading={loading}
          width={image.width}
          height={image.height}
        />
      </picture>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';
