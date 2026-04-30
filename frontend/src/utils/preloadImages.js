// Preloads images after the first render so repeat navigation feels instant.
export function preloadImages(urls = []) {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    if (!url) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  });
}

export const CRITICAL_IMAGES = [
  '/assets-fast/Background-Green.png',
  '/assets-fast/Background-Blue.png',
  '/assets-fast/Background-Red.png',
  '/assets-fast/Background-purple.png',
  '/assets-fast/Background-cyan.png',
  '/assets-fast/pixil_dither_overlay_background.png',
  '/assets-fast/logo.png',
  '/assets-fast/heart.png',
  '/assets-fast/Contact.png',
  '/assets-fast/views.png',
];
