// High Draw Golf — Client-side Stripe Gateway Helper
import { getCheckoutAttributionMetadata } from './attribution';

export interface StripeCheckoutPayload {
  items: Array<{
    id: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity?: number;
    logoStyle?: string;
    logoColor?: string;
    userTypeLabel?: string;
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

export interface StripeFulfillSessionResult {
  ok: boolean;
  fulfilled: boolean;
  alreadyFulfilled?: boolean;
  orderId?: string;
  printifyOrderId?: string;
  printifyStatus?: string;
  recipientFirstName?: string;
  shipSummary?: string;
  amountTotalDollars?: number;
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
        attribution: getCheckoutAttributionMetadata(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        configured: data.configured ?? true,
        error: data.error || 'Failed to initiate Stripe Checkout.',
      };
    }

    if (data.configured && data.checkoutUrl) {
      // Strictly validate redirect destination is an official Stripe Checkout HTTPS domain
      try {
        const parsedUrl = new URL(data.checkoutUrl);
        if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith('.stripe.com')) {
          throw new Error('Untrusted checkout redirect host blocked.');
        }
        window.location.href = parsedUrl.toString();
      } catch (urlErr: any) {
        return {
          success: false,
          configured: true,
          error: urlErr.message || 'Invalid checkout redirect URL.',
        };
      }
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

/**
 * Verifies a paid Stripe Checkout session on the server and dispatches the Printify order idempotently.
 */
export async function fulfillStripeCheckoutSession(
  sessionId: string,
  orderId?: string
): Promise<StripeFulfillSessionResult> {
  try {
    const response = await fetch('/api/stripe?action=fulfill-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, orderId }),
    });

    const data = (await response.json()) as Record<string, any>;
    if (!response.ok || !data.fulfilled) {
      return {
        ok: false,
        fulfilled: false,
        orderId: data.orderId || orderId,
        error: data.error || 'Unable to verify payment and dispatch Printify order.',
      };
    }

    return {
      ok: true,
      fulfilled: true,
      alreadyFulfilled: Boolean(data.alreadyFulfilled),
      orderId: data.orderId || orderId,
      printifyOrderId: data.printifyOrderId,
      printifyStatus: data.printifyStatus,
      recipientFirstName: data.recipientFirstName,
      shipSummary: data.shipSummary,
      amountTotalDollars: data.amountTotalDollars,
    };
  } catch (err: any) {
    return {
      ok: false,
      fulfilled: false,
      orderId,
      error: err?.message || 'Network error verifying order fulfillment.',
    };
  }
}
