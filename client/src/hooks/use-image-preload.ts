import { useEffect } from 'react';

interface PreloadImage {
  src: string;
  priority?: 'high' | 'medium' | 'low';
}

export function useImagePreload(images: PreloadImage[]) {
  useEffect(() => {
    const preloadImage = (src: string, priority: string = 'low') => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        // Otimizar URL do Imgur
        const optimizedSrc = src.includes('i.imgur.com') 
          ? src.replace(/\.png$|\.jpg$|\.jpeg$/i, 'm.jpg')
          : src;
        
        img.onload = () => resolve(img);
        img.onerror = () => {
          // Tentar URL original se a otimizada falhar
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = reject;
          fallbackImg.src = src;
        };
        
        // Adicionar fetchpriority se suportado
        if ('fetchPriority' in img) {
          (img as any).fetchPriority = priority;
        }
        
        img.src = optimizedSrc;
      });
    };

    // Precarregar imagens por prioridade
    const highPriority = images.filter(img => img.priority === 'high');
    const mediumPriority = images.filter(img => img.priority === 'medium');
    const lowPriority = images.filter(img => !img.priority || img.priority === 'low');

    // Precarregar imagens de alta prioridade primeiro
    Promise.all(highPriority.map(img => preloadImage(img.src, 'high')))
      .then(() => {
        // Depois as de média prioridade
        return Promise.all(mediumPriority.map(img => preloadImage(img.src, 'medium')));
      })
      .then(() => {
        // Por último as de baixa prioridade com delay
        setTimeout(() => {
          lowPriority.forEach(img => preloadImage(img.src, 'low'));
        }, 1000);
      })
      .catch(console.warn);
  }, [images]);
}

export function preloadCriticalImages(imageUrls: string[]) {
  // Precarregar as 6 primeiras imagens imediatamente
  const criticalImages = imageUrls.slice(0, 6);
  
  criticalImages.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url.includes('i.imgur.com') 
      ? url.replace(/\.png$|\.jpg$|\.jpeg$/i, 'm.jpg')
      : url;
    document.head.appendChild(link);
  });
}