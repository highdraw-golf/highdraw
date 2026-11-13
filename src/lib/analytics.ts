// High Draw Golf - Global Analytics, GA4 & Meta Pixel Ecommerce Event Harness
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: ((...args: any[]) => void) & {
      callMethod?: (...args: any[]) => void;
      queue?: any[];
      loaded?: boolean;
      version?: string;
      push?: (...args: any[]) => void;
    };
    _fbq?: any;
  }
}

const META_PIXEL_STORAGE_KEY = 'highdraw_meta_pixel_id';

export function isValidMetaPixelId(rawId: string | undefined | null): boolean {
  return /^\d{10,20}$/.test(String(rawId || '').trim());
}

export function getConfiguredMetaPixelId(): string {
  const envId = String(import.meta.env?.VITE_META_PIXEL_ID || '').trim();
  if (isValidMetaPixelId(envId)) return envId;
  if (typeof window === 'undefined') return '';
  try {
    const stored = String(localStorage.getItem(META_PIXEL_STORAGE_KEY) || '').trim();
    return isValidMetaPixelId(stored) ? stored : '';
  } catch {
    return '';
  }
}

export function setConfiguredMetaPixelId(rawId: string): string {
  const clean = String(rawId || '').replace(/\D/g, '').trim();
  if (typeof window !== 'undefined') {
    try {
      if (isValidMetaPixelId(clean)) {
        localStorage.setItem(META_PIXEL_STORAGE_KEY, clean);
      } else if (!clean) {
        localStorage.removeItem(META_PIXEL_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }
  if (isValidMetaPixelId(clean)) {
    initMetaPixel(clean);
  }
  return isValidMetaPixelId(clean) ? clean : '';
}

export function initMetaPixel(explicitId?: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const pixelId = String(explicitId || getConfiguredMetaPixelId()).trim();
  if (!isValidMetaPixelId(pixelId)) return false;

  if (!window.fbq) {
    const fbqShim: any = function (...args: any[]) {
      if (fbqShim.callMethod) {
        fbqShim.callMethod.apply(fbqShim, args);
      } else {
        fbqShim.queue.push(args);
      }
    };
    fbqShim.queue = [];
    fbqShim.loaded = true;
    fbqShim.version = '2.0';
    fbqShim.push = fbqShim;
    window.fbq = fbqShim;
    window._fbq = fbqShim;

    const existingScript = document.querySelector('script[data-hd-meta-pixel="true"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.dataset.hdMetaPixel = 'true';
      document.head.appendChild(script);
    }
  }

  try {
    window.fbq?.('init', pixelId);
    window.fbq?.('track', 'PageView');
    return true;
  } catch {
    return false;
  }
}

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    console.error('[Analytics Error]:', err);
  }
};

export const trackViewProduct = (item: { id: string; name: string; price: number; category?: string }) => {
  trackEvent('view_item', {
    currency: 'USD',
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'apparel',
        price: item.price,
        quantity: 1,
      },
    ],
  });
  try {
    window.fbq?.('track', 'ViewContent', {
      content_ids: [item.id],
      content_name: item.name,
      content_type: 'product',
      value: item.price,
      currency: 'USD',
    });
  } catch {
    // ignore pixel errors
  }
};

export const trackAddToCart = (item: { id: string; name: string; price: number; color?: string; size?: string }) => {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        item_variant: `${item.color || ''} / ${item.size || ''}`,
        quantity: 1,
      },
    ],
  });
  try {
    window.fbq?.('track', 'AddToCart', {
      content_ids: [item.id],
      content_name: item.name,
      content_type: 'product',
      value: item.price,
      currency: 'USD',
    });
  } catch {
    // ignore pixel errors
  }
};

export const trackBeginCheckout = (cartItems: Array<{ id: string; name: string; price: number }>, total: number) => {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: total,
    items: cartItems.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: 1,
    })),
  });
  try {
    window.fbq?.('track', 'InitiateCheckout', {
      content_ids: cartItems.map((i) => i.id),
      num_items: cartItems.length,
      value: total,
      currency: 'USD',
    });
  } catch {
    // ignore pixel errors
  }
};

export const trackPurchase = (order: {
  orderId: string;
  value: number;
  items?: Array<{ id?: string; name: string; price: number; quantity?: number }>;
}) => {
  trackEvent('purchase', {
    transaction_id: order.orderId,
    currency: 'USD',
    value: order.value,
    items: (order.items || []).map((i) => ({
      item_id: i.id || i.name,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity || 1,
    })),
  });
  try {
    window.fbq?.('track', 'Purchase', {
      value: order.value,
      currency: 'USD',
      content_type: 'product',
      content_ids: (order.items || []).map((i) => i.id || i.name),
    });
  } catch {
    // ignore pixel errors
  }
};

export const trackReviewSubmit = (author: string, rating: number) => {
  trackEvent('submit_review', {
    author,
    rating,
  });
};
