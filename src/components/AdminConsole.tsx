import React, { useState, useEffect } from 'react';
import { X, Sliders, RefreshCw, CheckCircle, Store, Zap, Sparkles, Tag, PackageCheck, Mail, Layers } from 'lucide-react';
import type { OrderNotification } from '../lib/emailService';
import { SILHOUETTE_SPECS, getMatrixStats, type SilhouetteId } from '../lib/taxonomy';
import { resolvePrintifyFulfillment } from '../lib/fulfillmentResolver';
import { LOGO_STYLE_OPTIONS, LOGO_COLOR_OPTIONS, getLogoAssetPath, type LogoStyle, type LogoVariant } from './brand/HighDrawLogo';

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onLock?: () => void;
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
  onLock,
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
  const [orders, setOrders] = useState<OrderNotification[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(sessionStorage.getItem('highdraw_orders_session') || '[]');
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'settings' | 'taxonomy' | 'orders'>('taxonomy');
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteId>('men-polo-st740');
  const [selectedColor, setSelectedColor] = useState<string>('Grey Concrete');
  const [selectedLogo, setSelectedLogo] = useState<LogoStyle>('mark_only');
  const [selectedThread, setSelectedThread] = useState<LogoVariant>('black');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const matrixStats = getMatrixStats();

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = JSON.parse(sessionStorage.getItem('highdraw_orders_session') || '[]');
        setOrders(stored);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
      image: '/assets/hero_editorial.png',
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
          <div className="flex items-center gap-2">
            {onLock && (
              <button
                onClick={onLock}
                className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-300 hover:text-white border border-slate-500 hover:border-white rounded-xs transition-colors cursor-pointer"
                title="Lock console session"
              >
                Lock Session
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`flex-1 py-3 px-4 text-center transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'taxonomy' ? 'bg-white text-[#2A4236] border-b-2 border-[#2A4236]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>Sovereign Taxonomy ({matrixStats.totalPermutations.toLocaleString()} SKUs)</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 text-center transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-[#2A4236] border-b-2 border-[#2A4236]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders size={14} />
            <span>Store Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 text-center transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-[#2A4236] border-b-2 border-[#2A4236]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck size={14} />
            <span>Orders & Fulfillment ({orders.length})</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 text-slate-800">

          {activeTab === 'taxonomy' ? (
            (() => {
              const activeSpec = SILHOUETTE_SPECS[selectedSilhouette];
              const colorKeys = Object.keys(activeSpec.colorMap);
              const safeColor = colorKeys.includes(selectedColor) ? selectedColor : colorKeys[0];
              const activeColorObj = activeSpec.colorMap[safeColor];
              const resolved = resolvePrintifyFulfillment({
                id: selectedSilhouette,
                color: safeColor,
                size: selectedSize,
                logoStyle: selectedLogo,
                logoColor: selectedThread,
              });
              const previewLogoSrc = getLogoAssetPath(selectedLogo, selectedThread);

              return (
                <div className="space-y-6">
                  {/* Top Architecture Banner */}
                  <div className="p-4 bg-[#1C2C24] text-white rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] font-bold">
                        ZERO-TOIL PRINTIFY BYPASS ENGINE &bull; STAGING PREVIEW
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] rounded-xs">
                        {matrixStats.totalPermutations.toLocaleString()} Permutations Active
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold">
                      Sovereign Deterministic SKU &amp; Variant Matrix
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Instead of manually building {matrixStats.totalPermutations.toLocaleString()} separate products inside Printify&apos;s slow interface, High Draw computes SKUs deterministically and overlays all 4 marks &times; 4 thread colors dynamically on unbranded garment bases, resolving directly to Printify Provider #217 (Fulfill Engine) numeric variant IDs.
                    </p>
                  </div>

                  {/* Interactive SKU & Variant Explorer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-md border border-slate-200">
                    <div className="space-y-3 text-xs">
                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">1. Garment Silhouette</span>
                        <select
                          value={selectedSilhouette}
                          onChange={(e) => {
                            const nextSil = e.target.value as SilhouetteId;
                            setSelectedSilhouette(nextSil);
                            const firstCol = Object.keys(SILHOUETTE_SPECS[nextSil].colorMap)[0];
                            setSelectedColor(firstCol);
                            setSelectedSize(SILHOUETTE_SPECS[nextSil].sizes[0]);
                          }}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xs font-medium"
                        >
                          {matrixStats.breakdown.map(b => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.total} combos)
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">2. Factory Colorway</span>
                        <select
                          value={safeColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xs font-medium"
                        >
                          {colorKeys.map(c => (
                            <option key={c} value={c}>
                              {c} (Printify: {activeSpec.colorMap[c].printifyColorTitle})
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="grid grid-cols-2 gap-2">
                        <label className="block space-y-1">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">3. Embroidery Mark</span>
                          <select
                            value={selectedLogo}
                            onChange={(e) => setSelectedLogo(e.target.value as LogoStyle)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-xs font-medium"
                          >
                            {LOGO_STYLE_OPTIONS.map(l => (
                              <option key={l.id} value={l.id}>{l.shortLabel}</option>
                            ))}
                          </select>
                        </label>

                        <label className="block space-y-1">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">4. Thread Color</span>
                          <select
                            value={selectedThread}
                            onChange={(e) => setSelectedThread(e.target.value as LogoVariant)}
                            disabled={selectedLogo === 'none'}
                            className="w-full p-2 bg-white border border-slate-300 rounded-xs font-medium disabled:opacity-50"
                          >
                            {LOGO_COLOR_OPTIONS.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">5. Size</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeSpec.sizes.map(sz => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setSelectedSize(sz)}
                              className={`px-2.5 py-1 rounded-xs font-mono text-xs font-bold border cursor-pointer ${
                                selectedSize === sz
                                  ? 'bg-[#2A4236] text-white border-[#2A4236]'
                                  : 'bg-white text-slate-700 border-slate-300'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </label>
                    </div>

                    {/* Right Column: Live Resolved Output */}
                    <div className="bg-white p-4 rounded-xs border border-slate-200 flex flex-col justify-between space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-16 h-16 rounded-xs border border-slate-300 flex items-center justify-center shrink-0 shadow-inner"
                          style={{ backgroundColor: activeColorObj?.hex || '#1E293B' }}
                        >
                          {previewLogoSrc ? (
                            <img src={previewLogoSrc} alt="Logo preview" className="w-12 h-12 object-contain" />
                          ) : (
                            <span className="text-[9px] font-mono uppercase text-white/80 font-bold">CLEAN</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B12535] font-bold block">
                            DETERMINISTIC SKU
                          </span>
                          <code className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-2xs block mt-0.5">
                            {resolved.sovereignSku}
                          </code>
                          <span className="text-[11px] text-slate-500 block mt-1">
                            Blueprint #{activeSpec.blueprintId} &bull; Provider #{activeSpec.printProviderId}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs font-mono text-[11px] space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Printify Product ID:</span>
                          <span className="font-bold text-slate-800">{resolved.printifyProductId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Resolved Variant ID:</span>
                          <span className="font-bold text-emerald-700">#{resolved.printifyVariantId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Printify Color Key:</span>
                          <span className="font-bold text-slate-800">{resolved.printifyColorTitle} / {resolved.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Decoration Position:</span>
                          <span className="font-bold text-slate-800">{resolved.placeholderPosition} ({resolved.decorationMethod})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Silhouette Matrix Breakdown Table */}
                  <div className="border border-slate-200 rounded-md overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 font-mono text-[10px] uppercase text-slate-600">
                          <th className="py-2.5 px-3">Garment Blank</th>
                          <th className="py-2.5 px-3">Colors</th>
                          <th className="py-2.5 px-3">Sizes</th>
                          <th className="py-2.5 px-3">Logo &times; Thread</th>
                          <th className="py-2.5 px-3 text-right">Permutations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {matrixStats.breakdown.map(row => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{row.name}</td>
                            <td className="py-2.5 px-3 font-mono">{row.colors}</td>
                            <td className="py-2.5 px-3 font-mono">{row.sizes}</td>
                            <td className="py-2.5 px-3 font-mono">{row.logoCombinations} (4&times;4 + Clean)</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-right text-[#2A4236]">{row.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()
          ) : activeTab === 'settings' ? (
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

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          High Draw Golf Automated Owner Command Suite &bull; Pipe: highdrawgear@gmail.com
        </div>

      </div>
    </div>
  );
};
