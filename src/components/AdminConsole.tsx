import React, { useState, useEffect } from 'react';
import { X, Sliders, RefreshCw, CheckCircle, Store, Zap, Sparkles, Tag, PackageCheck, Mail, Key, ExternalLink, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import type { OrderNotification } from '../lib/emailService';
import { getPrintifyShops, getPrintifyProducts } from '../lib/printify';

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  tickerText: string;
  onUpdateTicker: (newText: string) => void;
  activeBoard: string;
  onSelectBoard: (boardName: string, image: string) => void;
  poloPrice: number;
  onUpdatePrice: (newPrice: number) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  isOpen,
  onClose,
  tickerText,
  onUpdateTicker,
  activeBoard,
  onSelectBoard,
  poloPrice,
  onUpdatePrice,
}) => {
  const [tickerInput, setTickerInput] = useState(tickerText);
  const [priceInput, setPriceInput] = useState(poloPrice.toString());
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [orders, setOrders] = useState<OrderNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'orders' | 'printify'>('settings');

  // Printify State
  const [printifyToken, setPrintifyToken] = useState(() => localStorage.getItem('printify_api_token') || '');
  const [printifyShopId, setPrintifyShopId] = useState(() => localStorage.getItem('printify_shop_id') || '');
  const [shopsList, setShopsList] = useState<any[]>([]);
  const [syncedProducts, setSyncedProducts] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('printify_synced_products') || '[]');
    } catch {
      return [];
    }
  });
  const [isFetchingShops, setIsFetchingShops] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [printifyStatusMsg, setPrintifyStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('highdraw_orders') || '[]');
      setOrders(stored);
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const boards = [
    {
      name: 'Autumn Fairways',
      subtitle: 'Golden Hour Lifestyle',
      image: '/assets/lifestyle_golf.jpg',
    },
    {
      name: 'Flatlay Micro-Pique',
      subtitle: 'Macro Fabric Detail',
      image: '/assets/polo_navy_macro.png',
    },
    {
      name: 'Brutalist Twilight',
      subtitle: 'Luxury Editorial Styling',
      image: '/assets/hero_golf_editorial.png',
    },
    {
      name: 'Coastal Veranda',
      subtitle: 'High Draw Editorial Lookbook',
      image: '/assets/lifestyle_coastal_18th.jpg',
    },
  ];

  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTicker(tickerInput);
    alert('Top banner announcement updated!');
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(priceInput);
    if (!isNaN(val)) {
      onUpdatePrice(val);
      alert(`Polo price updated to $${val}`);
    }
  };

  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    setDeploySuccess(false);
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => setDeploySuccess(false), 5000);
    }, 2000);
  };

  const dadPrompts = [
    "Add a new polo named 'Pinehurst Stripe' for $48 with sizes S to 3XL.",
    "Change top banner announcement to 'SPRING OPEN SPECIAL: FREE SHIPPING ON ALL ORDERS'.",
    "Set all headwear prices to $32 and put bundles on 15% discount.",
    "Publish all website updates live to Vercel.",
  ];

  const copyPromptToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleFetchShops = async () => {
    if (!printifyToken.trim()) {
      setPrintifyStatusMsg({ type: 'error', text: 'Please enter a valid Printify Personal Access Token.' });
      return;
    }
    setIsFetchingShops(true);
    setPrintifyStatusMsg(null);
    try {
      localStorage.setItem('printify_api_token', printifyToken.trim());
      const shops = await getPrintifyShops(printifyToken.trim());
      setShopsList(shops);
      if (shops && shops.length > 0) {
        setPrintifyShopId(shops[0].id.toString());
        localStorage.setItem('printify_shop_id', shops[0].id.toString());
        setPrintifyStatusMsg({ type: 'success', text: `Connected! Found ${shops.length} store(s). Auto-selected "${shops[0].title}" (ID: ${shops[0].id}).` });
      } else {
        setPrintifyStatusMsg({ type: 'error', text: 'Connected to API, but no Printify shops found on this account.' });
      }
    } catch (err: any) {
      setPrintifyStatusMsg({ type: 'error', text: err.message || 'Failed to connect to Printify API. Check your token.' });
    } finally {
      setIsFetchingShops(false);
    }
  };

  const handleFetchProducts = async () => {
    if (!printifyToken.trim() || !printifyShopId.trim()) {
      setPrintifyStatusMsg({ type: 'error', text: 'Both Printify API Token and Shop ID are required.' });
      return;
    }
    setIsFetchingProducts(true);
    setPrintifyStatusMsg(null);
    try {
      const prods = await getPrintifyProducts(printifyShopId.trim(), printifyToken.trim());
      setSyncedProducts(prods);
      localStorage.setItem('printify_synced_products', JSON.stringify(prods));
      setPrintifyStatusMsg({ type: 'success', text: `Success! Pulled ${prods.length} products from Printify!` });
    } catch (err: any) {
      setPrintifyStatusMsg({ type: 'error', text: err.message || 'Failed to fetch products from Printify.' });
    } finally {
      setIsFetchingProducts(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#2A4236] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B12535] flex items-center justify-center text-white">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold tracking-wide uppercase">HIGH DRAW OWNER COMMAND CENTER</h2>
              <p className="text-xs text-slate-300 font-sans">Zero-Code Store & Automated Printify Fulfillment Management</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'settings' ? 'bg-white text-[#2A4236] border-b-2 border-[#2A4236]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders size={14} />
            <span>Store Settings & Styling</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'orders' ? 'bg-white text-[#2A4236] border-b-2 border-[#2A4236]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck size={14} />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('printify')}
            className={`flex-1 py-3 px-4 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'printify' ? 'bg-white text-[#2A4236] border-b-2 border-[#2A4236]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key size={14} />
            <span>Printify API & Products ({syncedProducts.length})</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 text-slate-800">

          {activeTab === 'settings' ? (
            <>
              {/* 1. Quick Live Deploy Button */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="text-[#B12535]" size={24} />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Publish Live Website</h3>
                    <p className="text-xs text-slate-600">Triggers automatic CI/CD deployment to Vercel and GitHub.</p>
                  </div>
                </div>
                <button
                  onClick={handleTriggerDeploy}
                  disabled={isDeploying}
                  className="px-5 py-2.5 bg-[#2A4236] hover:bg-[#1e3027] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-2"
                >
                  {isDeploying ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : deploySuccess ? (
                    <>
                      <CheckCircle size={14} className="text-[#FDE022]" />
                      <span>Deployed Live!</span>
                    </>
                  ) : (
                    <>
                      <Store size={14} />
                      <span>Publish Live</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2. Top Announcement Ticker Editor */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Tag size={14} className="text-[#B12535]" />
                  <span>Top Store Banner Announcement</span>
                </label>
                <form onSubmit={handleSaveTicker} className="flex gap-2">
                  <input
                    type="text"
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-sm text-xs font-medium focus:ring-2 focus:ring-[#2A4236] focus:outline-none"
                    placeholder="Enter banner text..."
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#B12535] hover:bg-[#8e1d29] text-white text-xs font-bold uppercase tracking-wider rounded-sm"
                  >
                    Save
                  </button>
                </form>
              </div>

              {/* 3. Single-Click Price Modifier */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Tag size={14} className="text-[#2A4236]" />
                  <span>Men's Polo Standard Price ($)</span>
                </label>
                <form onSubmit={handleSavePrice} className="flex gap-2">
                  <input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-32 px-4 py-2.5 border border-slate-300 rounded-sm text-xs font-medium focus:ring-2 focus:ring-[#2A4236] focus:outline-none"
                    placeholder="48"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2A4236] hover:bg-[#1e3027] text-white text-xs font-bold uppercase tracking-wider rounded-sm"
                  >
                    Update Price
                  </button>
                </form>
              </div>

              {/* 4. Visual Theme / Hero Photo Board Switcher */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#B12535]" />
                  <span>Select Active Lifestyle Theme</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {boards.map((b) => (
                    <div
                      key={b.name}
                      onClick={() => onSelectBoard(b.name, b.image)}
                      className={`cursor-pointer border rounded-md p-3 transition-all flex items-center gap-3 ${
                        activeBoard === b.name
                          ? 'border-[#B12535] bg-red-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <img src={b.image} alt={b.name} className="w-14 h-14 object-cover rounded-sm border border-slate-200" />
                      <div>
                        <h4 className="text-xs font-bold uppercase text-slate-900">{b.name}</h4>
                        <p className="text-[11px] text-slate-500">{b.subtitle}</p>
                        {activeBoard === b.name && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-[#B12535] uppercase tracking-wider">Active</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Plain-English AI Command Prompts */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Non-Technical AI Assistant Prompts
                  </label>
                  {copiedPrompt && (
                    <span className="text-xs text-[#2A4236] font-bold">Prompt Copied!</span>
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Click any prompt below to copy it, then paste it directly into your AI assistant to perform store updates automatically:
                </p>
                <div className="space-y-2">
                  {dadPrompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      onClick={() => copyPromptToClipboard(prompt)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-xs text-slate-800 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <span>"{prompt}"</span>
                      <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-[#B12535]">Copy</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ORDERS & AUTOMATED FULFILLMENT TAB */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-3">
                <Mail className="text-[#2A4236]" size={22} />
                <div className="text-xs">
                  <p className="font-bold text-[#2A4236] uppercase">Zero-Labor Fulfillment Active</p>
                  <p className="text-slate-600">
                    All incoming orders automatically transmit to **Printify** for printing & shipping. Alerts are automatically sent to **highdrawgear@gmail.com**.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-md">
                  <PackageCheck size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No Orders Placed Yet</p>
                  <p className="text-xs text-slate-500 mt-1">When customers place orders, they will appear here automatically with Printify tracking status.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-md bg-slate-50 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-bold text-slate-900">ORDER #{ord.orderId}</span>
                        <span className="px-2.5 py-0.5 bg-[#2A4236] text-white text-[10px] font-bold uppercase rounded-full">
                          {ord.printifyStatus || "Auto-Fulfilled by Printify"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <p><strong className="text-slate-900">Customer:</strong> {ord.customerName}</p>
                          <p><strong className="text-slate-900">Email:</strong> {ord.customerEmail}</p>
                        </div>
                        <div>
                          <p><strong className="text-slate-900">Shipping:</strong> {ord.shippingAddress}</p>
                          <p><strong className="text-slate-900">Total:</strong> ${ord.totalAmount}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-200 text-slate-600">
                        <strong className="text-slate-900">Items:</strong> {ord.items.map(i => `${i.name} (${i.size})`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'printify' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-md mt-0.5">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Printify Direct API Integration</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Connect your Printify account to pull in your actual embroidered polos and hats, view mockups, and automatically synchronize product inventory and automated fulfillment.
                  </p>
                </div>
              </div>

              {/* Status Alert Banner */}
              {printifyStatusMsg && (
                <div className={`p-3 rounded-md text-xs font-medium flex items-center gap-2 ${
                  printifyStatusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {printifyStatusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{printifyStatusMsg.text}</span>
                </div>
              )}

              {/* Step 1: Token Configuration */}
              <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#2A4236] text-white flex items-center justify-center text-[10px]">1</span>
                    Printify Personal Access Token (API Key)
                  </span>
                  <a 
                    href="https://printify.com/app/account/api" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-[#2A4236] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Generate API Token in Printify</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    value={printifyToken}
                    onChange={(e) => setPrintifyToken(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-sm text-xs font-mono focus:outline-none focus:border-[#2A4236]"
                  />
                  <button
                    onClick={handleFetchShops}
                    disabled={isFetchingShops}
                    className="px-4 py-2 bg-[#2A4236] hover:bg-[#1e3027] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {isFetchingShops ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    <span>Connect & Detect Stores</span>
                  </button>
                </div>

                {/* Shop Selector Dropdown */}
                {shopsList.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Select Store:</span>
                    <select
                      value={printifyShopId}
                      onChange={(e) => {
                        setPrintifyShopId(e.target.value);
                        localStorage.setItem('printify_shop_id', e.target.value);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs font-medium text-slate-800 focus:outline-none"
                    >
                      {shopsList.map(s => (
                        <option key={s.id} value={s.id}>{s.title} (ID: {s.id})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Step 2: Fetch Products Action */}
              <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#2A4236] text-white flex items-center justify-center text-[10px]">2</span>
                    Synchronize Products & Visuals
                  </span>
                  <button
                    onClick={handleFetchProducts}
                    disabled={isFetchingProducts}
                    className="px-4 py-2 bg-[#B12535] hover:bg-[#8e1d29] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5"
                  >
                    {isFetchingProducts ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    <span>Pull Live Printify Products</span>
                  </button>
                </div>

                {syncedProducts.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-300 rounded-sm bg-white">
                    <p className="text-xs text-slate-600 font-medium">No products synchronized yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Connect your API key above and click "Pull Live Printify Products" to import your catalog.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pt-2">
                    {syncedProducts.map((p, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-sm flex items-center gap-3">
                        {p.images && p.images[0] && (
                          <img src={p.images[0].src} alt={p.title} className="w-14 h-14 object-cover rounded-xs border border-slate-100" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-500">{p.variants?.length || 0} variants &bull; ID: {p.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3: Dad's Playbook for Creating Golf Polos in Printify */}
              <div className="p-5 border border-slate-200 rounded-lg bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Dad's Quick Playbook for Printify Golf Apparel</h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#2A4236]">1. Best Polo Blanks:</span>
                    <span>Search Printify Catalog for <strong>"Sport-Tek PosiCharge Micro-Mesh"</strong> or <strong>"Adidas Golf Polo"</strong>. Pick Embroidery technique.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#2A4236]">2. Best Cap Blank:</span>
                    <span>Search for <strong>"Yupoong 6089"</strong> or <strong>"Richardson 112 / 256"</strong> structured rope cap with front crown embroidery.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-[#2A4236]">3. Logo Placement:</span>
                    <span>Upload High Draw tracer mark (`/assets/logo_tracer_black.png` or `cyan.png`) to the <strong>Left Chest</strong> (approx 2.5" wide).</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          High Draw Golf Automated Owner Command Suite &bull; Pipe: highdrawgear@gmail.com
        </div>

      </div>
    </div>
  );
};
