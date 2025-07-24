import { useState } from "react";

interface ImageSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageSkeleton({ src, alt, className, style, onLoad, onError }: ImageSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // URLs já estão otimizadas no servidor, mas garantimos aqui também
  const optimizedSrc = src.includes('i.imgur.com') && !src.includes('m.jpg')
    ? src.replace(/\.png$|\.jpg$|\.jpeg$/i, 'm.jpg')
    : src;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError) {
      // Primeira tentativa de erro - tentar URL original
      setHasError(true);
    }
    onError?.();
  };

  return (
    <div className="relative">
      {/* Skeleton loading */}
      {!isLoaded && (
        <div 
          className={`animate-pulse bg-gray-200 ${className}`}
          style={style}
        >
          <div className="flex items-center justify-center h-full">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Imagem real */}
      <img
        src={hasError ? src : optimizedSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{
          ...style,
          position: isLoaded ? 'static' : 'absolute',
          top: 0,  
          left: 0,
          width: '100%',
          height: '100%'
        }}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}