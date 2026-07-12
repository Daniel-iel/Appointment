/**
 * Custom image loader for Next.js static export
 * Supports responsive images with width optimization
 */

interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality = 75 }: LoaderProps): string {
  // If src is already a full URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Build optimized URL with query params for responsive sizing
  const params = new URLSearchParams();
  params.set('w', width.toString());
  params.set('q', quality.toString());

  // Construct the URL with basePath
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${src}?${params.toString()}`;
}
