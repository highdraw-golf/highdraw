// High Draw Golf — Client-side Stripe Gateway Helper

export interface StripeCheckoutPayload {
  items: Array<{
    id: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity?: number;
  }>;
  customerEmail?: string;
  orderId?: string;
}

export interface StripeCheckoutResult {
  success: boolean;
  configured: boolean;
  checkoutUrl?: string;
  message?: string;
  error?: string;
}

/**
 * Initiates Stripe Checkout Session
 * If Stripe keys are configured in Vercel, redirects user directly to Stripe Hosted Checkout (Apple Pay, Credit Card, Google Pay).
 * If keys are pending, notifies frontend gracefully.
 */
export async function createStripeCheckoutSession(payload: StripeCheckoutPayload): Promise<StripeCheckoutResult> {
  try {
    const response = await fetch('/api/stripe?action=checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        returnUrl: window.location.origin,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        configured: data.configured ?? false,
        error: data.error || 'Failed to initiate Stripe Checkout.',
      };
    }

    if (data.configured && data.checkoutUrl) {
      // Direct redirect to Stripe Hosted Checkout
      window.location.href = data.checkoutUrl;
      return {
        success: true,
        configured: true,
        checkoutUrl: data.checkoutUrl,
      };
    }

    return {
      success: true,
      configured: false,
      message: data.message,
    };
  } catch (err: any) {
    console.warn('Stripe checkout fetch error:', err);
    return {
      success: false,
      configured: false,
      error: err.message || 'Network error connecting to Stripe gateway.',
    };
  }
}
