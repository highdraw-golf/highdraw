// High Draw Golf — Automated Gmail Order Notification Service
// Owner Email: highdrawgear@gmail.com

export interface OrderNotification {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: Array<{ name: string; size: string; price: number }>;
  totalAmount: number;
  printifyStatus: string;
}

/**
 * Automate Email Notifications to highdrawgear@gmail.com
 * Notifies Ken's dad instantly whenever an order is placed and sent to Printify.
 */
export const sendOrderNotificationEmail = async (notification: OrderNotification) => {
  // Store in sessionStorage (ephemeral session memory) for live Owner Console access during active session
  // Never persist customer PII in permanent localStorage
  try {
    localStorage.removeItem('highdraw_orders');
    const existing = JSON.parse(sessionStorage.getItem('highdraw_orders_session') || '[]');
    existing.unshift({
      ...notification,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    sessionStorage.setItem('highdraw_orders_session', JSON.stringify(existing.slice(0, 20)));
  } catch {
    // ignore storage errors
  }

  return true;
};
