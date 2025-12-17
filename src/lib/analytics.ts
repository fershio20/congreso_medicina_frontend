// Configuración temporal de Analytics
// TODO: Mover estos valores a Strapi cuando esté configurado

export const ANALYTICS_CONFIG = {
  // Google Analytics ID actual
  GOOGLE_ANALYTICS_ID: 'G-8P9EPJ3EWD',
  
  // Google Tag Manager ID real
  GOOGLE_TAG_MANAGER_ID: 'GTM-584RMZLB',
  
  // Facebook Pixel ID (si lo tienes)
  FACEBOOK_PIXEL_ID: undefined,
};

// Función para obtener el ID de Google Analytics
export const getGoogleAnalyticsId = (): string | undefined => {
  // Si tienes el ID en Strapi, úsalo; si no, usa el temporal
  return ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID;
};

// Función para obtener el ID de Google Tag Manager
export const getGoogleTagManagerId = (): string | undefined => {
  return ANALYTICS_CONFIG.GOOGLE_TAG_MANAGER_ID;
};

// Función para obtener el ID de Facebook Pixel
export const getFacebookPixelId = (): string | undefined => {
  return ANALYTICS_CONFIG.FACEBOOK_PIXEL_ID;
};
