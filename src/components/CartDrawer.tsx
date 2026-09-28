import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Plus, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onAddUpsellHat: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onAddUpsellHat,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end modal-overlay">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Cart Header */}
        <div className="p-6 bg-[#090C10] text-white hairline-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-wider">YOUR BAG</span>
            <span className="font-mono text-xs px-2 py-0.5 bg-white/10 rounded-full text-slate-300">
              {cartItems.length} ITEMS
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {orderComplete ? (
          /* Order Complete Confirmation */
          <div className="p-8 text-center my-auto space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C03221]">
                ORDER CONFIRMED // EDITION 001
              </div>
              <h3 className="font-serif text-2xl text-[#090C10]">Welcome to High Draw</h3>
              <p className="font-sans text-xs text-slate-500 font-light leading-relaxed">
                Your direct-to-player order has been routed to our crafting facility. You will receive a tracking link via email shortly.
              </p>
            </div>
            <div className="bg-[#FBFBFA] p-4 font-mono text-[11px] text-slate-600 hairline-all text-left space-y-1">
              <div>ORDER ID: #HD-2026-9841</div>
              <div>EST. DELIVERY: 3–5 BUSINESS DAYS</div>
              <div>GUARANTEE: 30-DAY FAIRWAY RETURN</div>
            </div>
            <button
              onClick={() => {
                setOrderComplete(false);
                onClose();
              }}
              className="w-full btn-obsidian py-3.5 text-xs tracking-[0.2em]"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          /* Cart Items List */
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                  YOUR BAG IS CURRENTLY EMPTY
                </p>
                <button
                  onClick={onClose}
                  className="btn-outline text-xs px-6 py-3"
                >
                  EXPLORE THE CAPSULE
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 hairline-all bg-[#FBFBFA]">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-20 object-cover border border-slate-200"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-medium text-[#090C10]">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase">
                            COLOR: {item.color} &bull; SIZE: {item.size}
                          </p>
                        </div>
                        <div className="font-mono text-xs font-semibold text-[#090C10]">
                          ${item.price} USD
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 1-Click Hat Upsell Banner */}
                <div className="p-4 bg-[#090C10] text-white hairline-all space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
                    <span className="text-[#C03221] font-semibold flex items-center gap-1">
                      <Sparkles size={12} /> BUNDLE & SAVE $6
                    </span>
                    <span className="text-slate-400">1-CLICK ADD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-serif text-sm font-medium">High Draw Rope Cap</div>
                      <div className="font-mono text-xs text-slate-300">$26 USD <span className="line-through text-slate-500 text-[10px]">$32</span></div>
                    </div>
                    <button
                      onClick={onAddUpsellHat}
                      className="px-3 py-2 bg-white text-[#090C10] font-mono text-[10px] uppercase font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} />
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Cart Footer & Checkout */}
        {!orderComplete && cartItems.length > 0 && (
          <div className="p-6 bg-[#FBFBFA] hairline-t space-y-4">
            
            {/* Price Calculations */}
            <div className="space-y-2 font-mono text-xs text-slate-600">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-semibold text-[#090C10]">${subtotal} USD</span>
              </div>
              <div className="flex justify-between">
                <span>EST. SHIPPING</span>
                <span>{shipping === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `$${shipping} USD`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#090C10] pt-2 hairline-t">
                <span>TOTAL</span>
                <span>${total} USD</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full btn-obsidian py-4 text-xs tracking-[0.25em] flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <span>ROUTING TO STRIPE CHECKOUT...</span>
              ) : (
                <>
                  <span>PROCEED TO CHECKOUT &bull; ${total}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-slate-500 pt-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Stripe 256-Bit Encrypted Checkout &bull; Apple Pay</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
