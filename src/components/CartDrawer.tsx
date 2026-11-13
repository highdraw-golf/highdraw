import React, { useState, useId, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  Check,
  ArrowLeft,
  Mail,
  CreditCard,
  Lock,
  Truck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createPrintifyOrder } from '../lib/printify';
import { sendOrderNotificationEmail } from '../lib/emailService';
import { createStripeCheckoutSession } from '../lib/stripe';
import { trackBeginCheckout } from '../lib/analytics';
import { recordLocalFunnelStep } from '../lib/attribution';
import { resolvePrintifyOrderLineItems } from '../lib/fulfillmentResolver';
import {
  calculateCartPricing,
  FREE_SHIPPING_THRESHOLD_DOLLARS,
  isPairEligiblePoloItem,
} from '../lib/bundlePricing';
import type { LogoStyle, LogoVariant } from './brand/HighDrawLogo';
import { StripeSecurityBeacon } from './motion/HighDrawBespokeMotion';
import { DURATION, EASE_ACCENT } from '../lib/motion/tokens';
import { useMotionPreference } from './motion/MotionProvider';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  color: string;
  size: string;
  image: string;
  logoStyle?: string;
  logoColor?: string;
  userTypeLabel?: string;
  sovereignSku?: string;
  printifyProductId?: string;
  printifyVariantId?: number;
}

export interface ExternalFulfillmentConfirmation {
  status: 'verifying' | 'confirmed' | 'error';
  orderId: string;
  printifyOrderId?: string;
  recipientFirstName?: string;
  shipSummary?: string;
  errorMessage?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity?: (index: number, delta: number) => void;
  onClearCart?: () => void;
  onAddUpsellHat: () => void;
  externalConfirmation?: ExternalFulfillmentConfirmation | null;
  onClearExternalConfirmation?: () => void;
  onRetryExternalFulfillment?: () => void;
}

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

const FREE_SHIPPING_THRESHOLD = FREE_SHIPPING_THRESHOLD_DOLLARS;

function generateOrderId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HD-2026-${rand}`;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || 'Golfer';
  const lastName = parts.slice(1).join(' ') || 'Member';
  return { firstName, lastName };
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onAddUpsellHat,
  externalConfirmation = null,
  onClearExternalConfirmation,
  onRetryExternalFulfillment,
}) => {
  const { isReduced } = useMotionPreference();
  const baseId = useId();
  const [step, setStep] = useState<'bag' | 'shipping' | 'confirmed'>('bag');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  const [lastPrintifyOrderId, setLastPrintifyOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (externalConfirmation) {
          onClearExternalConfirmation?.();
        }
        setStep('bag');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, externalConfirmation, onClearExternalConfirmation, onClose]);

  const pricing = calculateCartPricing(cartItems);
  const totalUnits = pricing.totalUnits;
  const rawSubtotal = pricing.rawSubtotal;
  const pairEligibleUnits = pricing.pairEligibleUnits;
  const pairDiscountDollars = pricing.pairDiscountDollars;
  const subtotal = pricing.discountedSubtotal;
  const shipping = pricing.shippingDollars;
  const total = pricing.totalDollars;
  const remainingForFreeShipping = pricing.remainingForFreeShipping;
  const freeShippingProgress = pricing.freeShippingProgress;

  const hasCapInBag = cartItems.some(item => item.id.startsWith('headwear-flexfit-mesh'));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  /**
   * 1-Click Express Stripe Checkout directly from the Bag view:
   * If Stripe Hosted Checkout is active on the deployment, redirects immediately to Stripe
   * (where Apple Pay, Google Pay, Link, and native address collection live).
   * If Stripe env keys are not yet configured, transitions smoothly to the shipping form.
   */
  const handleExpressStripeFromBag = async () => {
    if (cartItems.length === 0) return;
    trackBeginCheckout(cartItems, subtotal);
    recordLocalFunnelStep('begin_checkout');
    setIsCheckingOut(true);
    setErrorMessage('');
    const orderNum = generateOrderId();

    try {
      const res = await createStripeCheckoutSession({
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          color: item.color,
          size: item.size,
          quantity: item.quantity || 1,
          logoStyle: item.logoStyle,
          logoColor: item.logoColor,
          userTypeLabel: item.userTypeLabel,
        })),
        customerEmail: shippingForm.email || undefined,
        orderId: orderNum,
      });

      if (res.configured && res.checkoutUrl) {
        return; // Browser redirects to Stripe Hosted Checkout
      }
      setIsCheckingOut(false);
      if (res.configured && res.error) {
        setErrorMessage(res.error);
        return;
      }
      setStep('shipping');
    } catch {
      setIsCheckingOut(false);
      setStep('shipping');
    }
  };

  const handleProceedToShipping = () => {
    if (cartItems.length === 0) return;
    trackBeginCheckout(cartItems, subtotal);
    recordLocalFunnelStep('begin_checkout');
    setErrorMessage('');
    setStep('shipping');
  };

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingForm.fullName.trim() ||
      !shippingForm.email.trim() ||
      !shippingForm.address1.trim() ||
      !shippingForm.city.trim() ||
      !shippingForm.state.trim() ||
      !shippingForm.zip.trim()
    ) {
      setErrorMessage('Please complete all required shipping fields.');
      return;
    }

    setIsCheckingOut(true);
    setErrorMessage('');
    const orderNum = generateOrderId();

    try {
      const res = await createStripeCheckoutSession({
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          color: item.color,
          size: item.size,
          quantity: item.quantity || 1,
          logoStyle: item.logoStyle,
          logoColor: item.logoColor,
          userTypeLabel: item.userTypeLabel,
        })),
        customerEmail: shippingForm.email.trim(),
        orderId: orderNum,
      });

      if (res.configured && res.checkoutUrl) {
        return;
      }

      if (res.configured === false) {
        await handleSubmitOrder(e);
        return;
      }

      setIsCheckingOut(false);
      setErrorMessage(res.error || 'Unable to start Stripe Checkout. Please verify your cart.');
    } catch (err: any) {
      setIsCheckingOut(false);
      setErrorMessage(err?.message || 'Unable to connect to Stripe Checkout.');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shippingForm.fullName.trim() ||
      !shippingForm.email.trim() ||
      !shippingForm.address1.trim() ||
      !shippingForm.city.trim() ||
      !shippingForm.state.trim() ||
      !shippingForm.zip.trim()
    ) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }

    setIsCheckingOut(true);
    setErrorMessage('');
    const orderNum = generateOrderId();
    setLastOrderId(orderNum);

    const { firstName, lastName } = splitFullName(shippingForm.fullName);
    const formattedAddress = `${shippingForm.address1}${
      shippingForm.address2 ? ` ${shippingForm.address2}` : ''
    }, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}`;

    const mergedLineItems = new Map<string, { product_id: string; variant_id: number; quantity: number }>();
    for (const item of cartItems) {
      const expanded = resolvePrintifyOrderLineItems({
        id: item.id,
        color: item.color,
        size: item.size,
        logoStyle: (item.logoStyle as LogoStyle) || 'mark_monogram',
        logoColor: (item.logoColor as LogoVariant) || 'white',
        userTypeLabel: item.userTypeLabel,
        quantity: item.quantity || 1,
      });
      for (const line of expanded) {
        const key = `${line.product_id}:${line.variant_id}`;
        const existing = mergedLineItems.get(key);
        if (existing) {
          existing.quantity += line.quantity;
        } else {
          mergedLineItems.set(key, { ...line });
        }
      }
    }

    try {
      const printifyRes = await createPrintifyOrder({
        external_id: orderNum,
        label: orderNum,
        line_items: Array.from(mergedLineItems.values()),
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: {
          first_name: firstName,
          last_name: lastName,
          email: shippingForm.email.trim(),
          phone: shippingForm.phone.trim(),
          country: 'US',
          region: shippingForm.state.trim().toUpperCase(),
          address1: shippingForm.address1.trim(),
          address2: shippingForm.address2.trim(),
          city: shippingForm.city.trim(),
          zip: shippingForm.zip.trim(),
        },
      });

      setLastPrintifyOrderId(printifyRes?.id || '');

      await sendOrderNotificationEmail({
        orderId: orderNum,
        customerName: shippingForm.fullName.trim(),
        customerEmail: shippingForm.email.trim(),
        shippingAddress: formattedAddress,
        items: cartItems,
        totalAmount: total,
        printifyStatus: 'Queued for Printify Production & Embroidery',
      });

      setIsCheckingOut(false);
      setStep('confirmed');
      if (onClearCart) onClearCart();
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
    } catch (err: any) {
      setIsCheckingOut(false);
      setErrorMessage(
        err?.message || 'Unable to dispatch order to Printify fulfillment. Please try again.'
      );
    }
  };

  const handleResetAndClose = () => {
    if (externalConfirmation) {
      onClearExternalConfirmation?.();
    }
    setErrorMessage('');
    setStep('bag');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden overscroll-contain">
          {/* Backdrop */}
          <m.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_ACCENT }}
            onClick={handleResetAndClose}
            className="fixed inset-0 modal-overlay"
            aria-hidden="true"
          />

          {/* Slide-Out Drawer Panel */}
          <m.div
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
            initial={isReduced ? { opacity: 0 } : { x: '100%' }}
            animate={isReduced ? { opacity: 1 } : { x: 0 }}
            exit={isReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: DURATION.slow, ease: EASE_ACCENT }}
            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overscroll-contain"
          >
            {/* Cart Header */}
            <div>
              <div className="p-5 sm:p-6 bg-[#090C10] text-white border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!externalConfirmation && step === 'shipping' && (
                    <button
                      type="button"
                      onClick={() => setStep('bag')}
                      className="p-1 mr-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Back to Bag"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <span className="font-serif text-xl tracking-wider">
                    {externalConfirmation
                      ? externalConfirmation.status === 'verifying'
                        ? 'VERIFYING ORDER'
                        : externalConfirmation.status === 'confirmed'
                        ? 'ORDER CONFIRMED'
                        : 'FULFILLMENT SYNC'
                      : (
                        <>
                          {step === 'bag' && 'YOUR BAG'}
                          {step === 'shipping' && 'SHIPPING & PAYMENT'}
                          {step === 'confirmed' && 'ORDER CONFIRMED'}
                        </>
                      )}
                  </span>
                  {!externalConfirmation && step === 'bag' && (
                    <span className="font-mono text-xs px-2 py-0.5 bg-white/10 rounded-full text-slate-300">
                      {totalUnits} {totalUnits === 1 ? 'ITEM' : 'ITEMS'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close bag"
                >
                  <X size={20} />
                </button>
              </div>

              {/* GPU-Safe $75 Free US Shipping Progress Bar (`scaleX` transform, zero width reflow) */}
              {!externalConfirmation && step !== 'confirmed' && cartItems.length > 0 && (
                <div className="px-5 py-3 bg-[#1C2C24] text-white border-b border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Truck size={13} className="text-[#38BDF8] shrink-0" />
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-emerald-300">
                          Unlocked Complimentary US Shipping!
                        </span>
                      ) : (
                        <span>
                          Add <strong className="text-[#38BDF8]">${remainingForFreeShipping}</strong> more for{' '}
                          <strong>FREE US Shipping</strong>
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      ${Math.min(subtotal, FREE_SHIPPING_THRESHOLD)} / ${FREE_SHIPPING_THRESHOLD}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
                    <m.div
                      initial={false}
                      animate={{ scaleX: freeShippingProgress }}
                      transition={{ duration: DURATION.slow, ease: EASE_ACCENT }}
                      style={{ transformOrigin: 'left center' }}
                      className={`h-full w-full rounded-full ${
                        remainingForFreeShipping === 0 ? 'bg-emerald-400' : 'bg-[#38BDF8]'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* EXTERNAL STRIPE CHECKOUT RETURN STATES */}
            {externalConfirmation && externalConfirmation.status === 'verifying' && (
              <div className="p-8 my-auto space-y-6 text-center">
                <div className="w-16 h-16 bg-[#1C2C24] text-[#38BDF8] rounded-full flex items-center justify-center mx-auto shadow-md">
                  <RefreshCw size={28} className="animate-spin" />
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1C2C24] font-bold">
                    STRIPE PAYMENT RECEIVED // DISPATCHING PRINTIFY
                  </div>
                  <h3 className="font-serif text-2xl text-[#090C10]">
                    Confirming Embroidery Specs
                  </h3>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    Verifying payment session and queueing order{' '}
                    <strong>#{externalConfirmation.orderId}</strong> for direct Printify production.
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-label="Verifying payment and dispatching order"
                  className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"
                >
                  <div className="h-full w-2/3 bg-[#1C2C24] rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {externalConfirmation && externalConfirmation.status === 'confirmed' && (
              <div className="p-8 text-center my-auto space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B12535]">
                    ORDER CONFIRMED // EDITION 2026
                  </div>
                  <h3 className="font-serif text-2xl text-[#090C10]">Welcome to High Draw</h3>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    Your Stripe payment cleared and order <strong>#{externalConfirmation.orderId}</strong>{' '}
                    is queued for precision embroidery and direct fulfillment.
                  </p>
                </div>
                <div className="bg-[#FBFBFA] p-4 font-mono text-[11px] text-slate-600 border border-slate-200 rounded-xs text-left space-y-1.5">
                  <div>ORDER ID: #{externalConfirmation.orderId}</div>
                  {externalConfirmation.printifyOrderId && (
                    <div>PRINTIFY ID: {externalConfirmation.printifyOrderId}</div>
                  )}
                  {externalConfirmation.recipientFirstName && (
                    <div>GOLFER: {externalConfirmation.recipientFirstName}</div>
                  )}
                  {externalConfirmation.shipSummary && (
                    <div>DESTINATION: {externalConfirmation.shipSummary}</div>
                  )}
                  <div>EST. DISPATCH: 2–4 BUSINESS DAYS</div>
                </div>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 bg-[#090C10] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xs cursor-pointer t-press"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}

            {externalConfirmation && externalConfirmation.status === 'error' && (
              <div role="alert" className="p-8 my-auto space-y-5 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle size={30} />
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-rose-700 font-bold">
                    FULFILLMENT HANDOFF ATTENTION
                  </div>
                  <h3 className="font-serif text-2xl text-[#090C10]">
                    Payment Recorded — Retry Sync
                  </h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    {externalConfirmation.errorMessage ||
                      'We could not confirm the Printify dispatch yet.'}{' '}
                    Reference order <strong>#{externalConfirmation.orderId}</strong> or reach{' '}
                    <span className="font-mono text-[#1C2C24]">highdrawgear@gmail.com</span>.
                  </p>
                </div>
                <div className="space-y-2">
                  {onRetryExternalFulfillment && (
                    <button
                      type="button"
                      onClick={onRetryExternalFulfillment}
                      className="w-full py-3.5 bg-[#1C2C24] hover:bg-[#132019] text-white font-bold text-xs uppercase tracking-[0.18em] rounded-xs cursor-pointer t-press flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} />
                      <span>RETRY FULFILLMENT SYNC</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 font-mono text-[11px] uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    CLOSE DRAWER
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: CART ITEMS */}
            {!externalConfirmation && step === 'bag' && (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto overscroll-contain space-y-5">
                {errorMessage && (
                  <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xs">
                    {errorMessage}
                  </div>
                )}
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                      YOUR BAG IS CURRENTLY EMPTY
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 bg-[#1C2C24] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer t-press"
                    >
                      EXPLORE THE COLLECTION
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 2+ Polo Pair Promo Banner */}
                    {pairEligibleUnits === 1 && (
                      <div
                        data-testid="pair-upsell-banner"
                        className="p-3 bg-emerald-50 border border-emerald-200 rounded-xs flex items-center justify-between gap-2 text-xs text-emerald-950"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Sparkles size={14} className="text-emerald-700 shrink-0" />
                          <span>
                            Add <strong>1 more polo</strong> to save <strong>$10</strong> automatically + unlock <strong>Free US Shipping</strong>
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded-2xs shrink-0">
                          -$10 PAIR
                        </span>
                      </div>
                    )}
                    {pairEligibleUnits >= 2 && pairDiscountDollars > 0 && (
                      <div
                        data-testid="pair-applied-banner"
                        className="p-3 bg-emerald-900 text-white rounded-xs border border-emerald-800 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Check size={14} className="text-emerald-300 shrink-0" />
                          <span>
                            <strong>2+ Polo Pair Applied:</strong> -${pairDiscountDollars} Pair Savings &amp; Free US Shipping
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-emerald-200 bg-white/10 px-2 py-0.5 rounded-2xs shrink-0">
                          -${pairDiscountDollars}
                        </span>
                      </div>
                    )}

                    <div className="space-y-3.5">
                      {cartItems.map((item, idx) => {
                        const qty = item.quantity || 1;
                        const itemGetsPair = pairEligibleUnits >= 2 && isPairEligiblePoloItem(item);
                        return (
                          <div
                            key={`${item.id}-${idx}`}
                            className="flex gap-3.5 p-3.5 border border-slate-200 rounded-xs bg-[#FBFBFA]"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-18 h-22 object-cover border border-slate-200 rounded-2xs shrink-0"
                            />
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="font-serif text-sm font-bold text-[#090C10] leading-snug">
                                    {item.name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => onRemoveItem(idx)}
                                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                                    aria-label={`Remove ${item.name}`}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase leading-relaxed">
                                  {item.color} &bull; SIZE: {item.size}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200/70">
                                {/* Quantity Stepper */}
                                <div className="inline-flex items-center border border-slate-300 rounded-2xs bg-white">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onUpdateQuantity
                                        ? onUpdateQuantity(idx, -1)
                                        : qty <= 1 && onRemoveItem(idx)
                                    }
                                    className="px-2 py-1 text-slate-600 hover:text-black cursor-pointer"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={11} />
                                  </button>
                                  <span className="px-2.5 font-mono text-xs font-bold text-[#090C10]">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateQuantity && onUpdateQuantity(idx, 1)}
                                    className="px-2 py-1 text-slate-600 hover:text-black cursor-pointer"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={11} />
                                  </button>
                                </div>

                                <div className="font-mono text-xs font-bold text-[#090C10] text-right">
                                  {itemGetsPair ? (
                                    <>
                                      <span className="line-through text-slate-400 mr-1.5 text-[11px]">
                                        ${item.price * qty}
                                      </span>
                                      <span className="text-emerald-800">
                                        ${Math.max(0, (item.price - 5) * qty)} USD
                                      </span>
                                    </>
                                  ) : (
                                    `$${item.price * qty} USD`
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 1-Click Hat Upsell Banner (Unlocks $75 Free Shipping when paired with $48 Polo!) */}
                    {!hasCapInBag && (
                      <div className="p-4 bg-[#090C10] text-white rounded-xs border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
                          <span className="text-[#38BDF8] font-bold flex items-center gap-1">
                            <Sparkles size={12} />
                            {subtotal >= 47 && subtotal < 75
                              ? 'UNLOCK FREE SHIPPING + SAVE $7'
                              : 'BUNDLE & SAVE $7'}
                          </span>
                          <span className="text-emerald-400 font-semibold">+$28</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src="/assets/products/bespoke/hat_hero_wood.jpg"
                              alt="Tour Performance Poly-Mesh Cap"
                              className="w-11 h-11 object-cover rounded-2xs border border-white/15 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-serif text-sm font-medium truncate">
                                Tour Poly-Mesh Cap (Pure White)
                              </div>
                              <div className="font-mono text-xs text-slate-300">
                                $28 USD <span className="line-through text-slate-500 text-[10px]">$35</span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={onAddUpsellHat}
                            className="px-3 py-2 bg-white text-[#090C10] font-mono text-[10px] uppercase font-bold hover:bg-slate-200 transition-colors flex items-center gap-1 rounded-2xs cursor-pointer t-press shrink-0"
                          >
                            <Plus size={12} />
                            <span>ADD</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* STEP 2: STREAMLINED SHIPPING & PAYMENT FORM (Full Browser Autofill Compliance) */}
            {!externalConfirmation && step === 'shipping' && (
              <form
                onSubmit={handleSubmitOrder}
                className="p-5 sm:p-6 flex-1 overflow-y-auto overscroll-contain space-y-4"
              >
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">
                    {totalUnits} {totalUnits === 1 ? 'Item' : 'Items'} &bull;{' '}
                    {shipping === 0 ? 'Free US Shipping' : '$8 Shipping'}
                  </span>
                  <span className="font-bold text-[#1C2C24]">Total: ${total} USD</span>
                </div>

                {errorMessage && (
                  <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    Contact &amp; Delivery Destination
                  </span>

                  <div>
                    <label
                      htmlFor={`${baseId}-email`}
                      className="text-[11px] font-medium text-slate-700 block mb-1"
                    >
                      Email Address (For Tracking) *
                    </label>
                    <div className="relative">
                      <input
                        id={`${baseId}-email`}
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={shippingForm.email}
                        onChange={handleInputChange}
                        placeholder="golfer@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:outline-none focus:border-[#1C2C24]"
                      />
                      <Mail size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`${baseId}-fullName`}
                      className="text-[11px] font-medium text-slate-700 block mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      id={`${baseId}-fullName`}
                      type="text"
                      name="fullName"
                      autoComplete="name"
                      required
                      value={shippingForm.fullName}
                      onChange={handleInputChange}
                      placeholder="Dr. Ken Cyree"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:outline-none focus:border-[#1C2C24]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${baseId}-phone`}
                      className="text-[11px] font-medium text-slate-700 block mb-1"
                    >
                      Mobile Phone (Optional SMS Updates)
                    </label>
                    <input
                      id={`${baseId}-phone`}
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={shippingForm.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 000-0000"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:outline-none focus:border-[#1C2C24]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${baseId}-address1`}
                      className="text-[11px] font-medium text-slate-700 block mb-1"
                    >
                      Street Address *
                    </label>
                    <input
                      id={`${baseId}-address1`}
                      type="text"
                      name="address1"
                      autoComplete="address-line1"
                      required
                      value={shippingForm.address1}
                      onChange={handleInputChange}
                      placeholder="123 Fairway Drive"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:outline-none focus:border-[#1C2C24]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${baseId}-address2`}
                      className="text-[11px] font-medium text-slate-700 block mb-1"
                    >
                      Apt, Suite, Club Box (Optional)
                    </label>
                    <input
                      id={`${baseId}-address2`}
                      type="text"
                      name="address2"
                      autoComplete="address-line2"
                      value={shippingForm.address2}
                      onChange={handleInputChange}
                      placeholder="Suite 4B"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:outline-none focus:border-[#1C2C24]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label
                        htmlFor={`${baseId}-city`}
                        className="text-[11px] font-medium text-slate-700 block mb-1"
                      >
                        City *
                      </label>
                      <input
                        id={`${baseId}-city`}
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        required
                        value={shippingForm.city}
                        onChange={handleInputChange}
                        placeholder="Scottsdale"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:outline-none focus:border-[#1C2C24]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${baseId}-state`}
                        className="text-[11px] font-medium text-slate-700 block mb-1"
                      >
                        State *
                      </label>
                      <input
                        id={`${baseId}-state`}
                        type="text"
                        name="state"
                        autoComplete="address-level1"
                        required
                        maxLength={2}
                        value={shippingForm.state}
                        onChange={handleInputChange}
                        placeholder="AZ"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs uppercase focus:outline-none focus:border-[#1C2C24]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${baseId}-zip`}
                        className="text-[11px] font-medium text-slate-700 block mb-1"
                      >
                        ZIP Code *
                      </label>
                      <input
                        id={`${baseId}-zip`}
                        type="text"
                        name="zip"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        required
                        value={shippingForm.zip}
                        onChange={handleInputChange}
                        placeholder="85251"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xs focus:outline-none focus:border-[#1C2C24]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stripe & Direct Order Actions */}
                <div className="space-y-3 pt-2">
                  <StripeSecurityBeacon amount={total} />

                  <button
                    type="button"
                    onClick={handleStripePayment}
                    disabled={isCheckingOut}
                    className="w-full py-4 bg-[#635BFF] hover:bg-[#4E44E6] text-white text-xs font-bold tracking-[0.14em] uppercase rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg t-press"
                  >
                    {isCheckingOut ? (
                      <span>CONNECTING TO SECURE STRIPE CHECKOUT...</span>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        <span>PROCEED TO PAYMENT (CARD / APPLE PAY) &bull; ${total}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="w-full py-3 bg-[#090C10] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-[0.14em] rounded-xs flex items-center justify-center gap-2 cursor-pointer t-press"
                  >
                    <span>SUBMIT DIRECT ORDER (INVOICE DISPATCH)</span>
                    <ArrowRight size={14} />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
                    <Lock size={11} className="text-emerald-700" />
                    <span>256-Bit SSL &bull; 30-Day Fairway Trial Guarantee</span>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER CONFIRMED */}
            {!externalConfirmation && step === 'confirmed' && (
              <div className="p-8 text-center my-auto space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#B12535]">
                    ORDER CONFIRMED // EDITION 2026
                  </div>
                  <h3 className="font-serif text-2xl text-[#090C10]">Welcome to High Draw</h3>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    Your custom order <strong>#{lastOrderId}</strong> has been queued for precision embroidery and direct fulfillment.
                  </p>
                </div>
                <div className="bg-[#FBFBFA] p-4 font-mono text-[11px] text-slate-600 border border-slate-200 rounded-xs text-left space-y-1.5">
                  <div>ORDER ID: #{lastOrderId}</div>
                  {lastPrintifyOrderId && <div>PRINTIFY ID: {lastPrintifyOrderId}</div>}
                  <div>RECIPIENT: {shippingForm.fullName}</div>
                  <div>
                    SHIP TO: {shippingForm.address1}, {shippingForm.city}, {shippingForm.state}{' '}
                    {shippingForm.zip}
                  </div>
                  <div>EST. DISPATCH: 2–4 BUSINESS DAYS</div>
                </div>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 bg-[#090C10] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xs cursor-pointer t-press"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}

            {/* Cart Bottom Summary (When in Bag mode) */}
            {!externalConfirmation && step === 'bag' && cartItems.length > 0 && (
              <div className="p-5 sm:p-6 bg-[#FBFBFA] border-t border-slate-200 space-y-3.5">
                <div className="space-y-1.5 font-mono text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>ITEMS ({totalUnits} {totalUnits === 1 ? 'ITEM' : 'ITEMS'})</span>
                    <span className="font-semibold text-[#090C10]">${rawSubtotal} USD</span>
                  </div>
                  {pairDiscountDollars > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>2+ POLO PAIR SAVINGS</span>
                      <span>-${pairDiscountDollars} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span className="font-semibold text-[#090C10]">${subtotal} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>US SHIPPING</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-bold">FREE</span>
                      ) : (
                        `$${shipping} USD`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#090C10] pt-2 border-t border-slate-200">
                    <span>ESTIMATED TOTAL</span>
                    <span>${total} USD</span>
                  </div>
                </div>

                {/* Primary 1-Click Express Stripe Checkout + Secondary Address Flow */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleExpressStripeFromBag}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-md t-press"
                  >
                    <CreditCard size={15} />
                    <span>
                      {isCheckingOut ? 'LOADING CHECKOUT...' : `EXPRESS CHECKOUT • $${total}`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToShipping}
                    className="w-full py-2.5 bg-white hover:bg-slate-100 text-[#090C10] border border-slate-300 font-mono text-[11px] font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 cursor-pointer t-press"
                  >
                    <span>ENTER SHIPPING DETAILS</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-slate-500">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Apple Pay &bull; Stripe 256-Bit Vault &bull; 30-Day Guarantee</span>
                </div>
              </div>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};
