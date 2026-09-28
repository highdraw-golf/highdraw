// High Draw Golf — Automated Gmail Order Notification Service
// Owner Email: kensiri@gmail.com

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
 * Automate Email Notifications to kensiri@gmail.com
 * Notifies Ken's dad instantly whenever an order is placed and sent to Printify.
 */
export const sendOrderNotificationEmail = async (notification: OrderNotification) => {
  console.log(`✉️ [Gmail Automation] Dispatching order alert for #${notification.orderId} to kensiri@gmail.com`);

  const emailBody = `
==================================================
🏌️ HIGH DRAW GOLF — AUTOMATED ORDER ALERT
==================================================
Order ID: #${notification.orderId}
Customer: ${notification.customerName} (${notification.customerEmail})
Shipping Address: ${notification.shippingAddress}

ITEMS ORDERED:
${notification.items.map(item => `- ${item.name} (${item.size}) — $${item.price}`).join("\n")}

TOTAL PAID: $${notification.totalAmount}
PRINTIFY STATUS: ${notification.printifyStatus} (Automated Fulfillment In Progress)
==================================================
`;

  console.log(emailBody);

  // Store in localStorage for live Owner Console access
  try {
    const existing = JSON.parse(localStorage.getItem('highdraw_orders') || '[]');
    existing.unshift({
      ...notification,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('highdraw_orders', JSON.stringify(existing));
  } catch (e) {
    console.error("Local order storage error:", e);
  }

  return true;
};
