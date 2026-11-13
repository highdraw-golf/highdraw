// High Draw Golf — Automated Printify Order Fulfillment API Service
// Zero-Knowledge Client Wrapper: All credentials and shop IDs are strictly enforced server-side.

export interface PrintifyOrderItem {
  product_id: string;
  variant_id: number | string;
  quantity: number;
}

export interface AddressTo {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface PrintifyOrderPayload {
  external_id: string;
  label?: string;
  line_items: PrintifyOrderItem[];
  shipping_method: number;
  send_shipping_notification: boolean;
  address_to: AddressTo;
}

/**
 * Automate Printify Order Creation
 * Submits order payload to the secure serverless backend endpoint (/api/printify?action=order).
 * The secret API token is kept strictly on the backend and never exposed to client bundles.
 */
export const createPrintifyOrder = async (order: PrintifyOrderPayload) => {
  const response = await fetch('/api/printify?action=order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    let errMessage = 'Unable to submit order to fulfillment gateway.';
    try {
      const errData = (await response.json()) as { error?: string };
      if (errData?.error) errMessage = errData.error;
    } catch {
      // ignore non-json error bodies
    }
    throw new Error(errMessage);
  }

  return response.json();
};
