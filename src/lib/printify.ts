// High Draw Golf — Automated Printify Order Fulfillment API Service

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

const PRINTIFY_SHOP_ID = import.meta.env.VITE_PRINTIFY_SHOP_ID || "1234567";
const PRINTIFY_API_TOKEN = import.meta.env.VITE_PRINTIFY_API_TOKEN || "";

/**
 * Automate Printify Order Creation
 * Submits order payload directly to Printify REST API.
 * Printify automatically prints, packages, and ships order to customer.
 */
export const createPrintifyOrder = async (order: PrintifyOrderPayload) => {
  console.log("⚡ [Printify Automation] Submitting order to Printify API...", order.external_id);
  
  if (!PRINTIFY_API_TOKEN) {
    console.warn("ℹ️ Printify API Token not detected. Operating in simulated auto-fulfillment mode.");
    // Return simulated success payload for testing
    return {
      id: `printify_${Date.now()}`,
      status: "pending",
      external_id: order.external_id,
      shipment_status: "created",
      message: "Order queued for automated printing and shipping."
    };
  }

  try {
    const response = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PRINTIFY_API_TOKEN}`
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Printify API Error: ${err.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [Printify Automation] Order submitted successfully:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Printify Auto-Fulfillment Failure:", error);
    throw error;
  }
};

/**
 * Fetch Order Status & Tracking Numbers automatically from Printify
 */
export const getPrintifyOrderStatus = async (orderId: string) => {
  if (!PRINTIFY_API_TOKEN) {
    return { status: "fulfilled", tracking_number: "1Z9999999999999999", carrier: "USPS" };
  }

  try {
    const response = await fetch(`https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders/${orderId}.json`, {
      headers: {
        "Authorization": `Bearer ${PRINTIFY_API_TOKEN}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching Printify order status:", error);
    return null;
  }
};

/**
 * Fetch all Shops associated with the Printify API Token
 */
export const getPrintifyShops = async (token?: string) => {
  const authToken = token || PRINTIFY_API_TOKEN;
  if (!authToken) {
    throw new Error("Printify API Token is required to fetch shops.");
  }

  const response = await fetch("https://api.printify.com/v1/shops.json", {
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch shops: HTTP ${response.status}`);
  }

  return await response.json();
};

/**
 * Fetch all Products from a Printify Shop
 */
export const getPrintifyProducts = async (shopId?: string, token?: string) => {
  const authToken = token || PRINTIFY_API_TOKEN;
  const targetShopId = shopId || PRINTIFY_SHOP_ID;

  if (!authToken || !targetShopId) {
    throw new Error("Both Printify API Token and Shop ID are required to fetch products.");
  }

  const response = await fetch(`https://api.printify.com/v1/shops/${targetShopId}/products.json`, {
    headers: {
      "Authorization": `Bearer ${authToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch products: HTTP ${response.status}`);
  }

  const result = await response.json();
  return result.data || result;
};

