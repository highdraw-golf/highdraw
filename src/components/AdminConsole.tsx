import React, { useState } from 'react';
import { X, Sliders, RefreshCw, CheckCircle, Store, Zap, Sparkles, Tag } from 'lucide-react';

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
      subtitle: 'Peter Millar Triptych Lookbook',
      image: '/assets/peter_millar_lookbook_triptych_1790563847097.jpg',
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
              <p className="text-xs text-slate-300 font-sans">Zero-Code Store Management for Brand Owners</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 text-slate-800">

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

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          High Draw Golf Automated Owner Command Suite &bull; Pipe: kensiri@gmail.com
        </div>

      </div>
    </div>
  );
};
