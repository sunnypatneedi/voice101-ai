import { cn } from "@/lib/utils"
import { forwardRef } from "react"

type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'card' | 'line'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  lines?: number
  shimmer?: boolean
  height?: number | string
  width?: number | string
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    variant = 'rectangle',
    lines = 1,
    shimmer = true,
    height,
    width,
    style,
    ...props
  }, ref) => {
    const baseStyles = {
      '--skeleton-height': typeof height === 'number' ? `${height}px` : height,
      '--skeleton-width': typeof width === 'number' ? `${width}px` : width,
    } as React.CSSProperties

    const variants = {
      text: 'h-4 w-full',
      circle: 'rounded-full aspect-square',
      rectangle: 'rounded-md',
      card: 'rounded-lg',
      line: 'h-1 w-full',
    }

    if (variant === 'text' && lines > 1) {
      return (
        <div className="space-y-2 w-full" style={baseStyles}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              ref={i === 0 ? ref : undefined}
              className={cn(
                'animate-pulse bg-muted relative overflow-hidden',
                variants[variant],
                shimmer && 'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
                className
              )}
              style={{
                ...baseStyles,
                ...style,
              }}
              {...props}
            />
          ))}
        </div>
      )
    }


    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-muted relative overflow-hidden',
          variants[variant],
          shimmer && 'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
          className
        )}
        style={{
          ...baseStyles,
          ...style,
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export { Skeleton }
