import OptimizedImage from '@/components/OptimizedImage';

export function OptimizedLogo({ className = '' }: { className?: string }) {
  return (
    <OptimizedImage
      src="/assets/images/logo.png"
      alt="Voice101 Logo"
      className={className}
      widths={[80, 120, 160]}
      quality={90}
      loading="eager"
    />
  );
}
