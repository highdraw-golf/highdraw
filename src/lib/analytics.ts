// High Draw Golf - Global Analytics & Ecommerce Event Harness
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    } else {
      console.log(`[Analytics Event] ${eventName}:`, params);
    }
  } catch (err) {
    console.error('[Analytics Error]:', err);
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
};

export const trackReviewSubmit = (author: string, rating: number) => {
  trackEvent('submit_review', {
    author,
    rating,
  });
};
