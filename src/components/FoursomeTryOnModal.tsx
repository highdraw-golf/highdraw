import React, { useState } from 'react';
import { X, Sparkles, Upload, Share2, Check, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoursomeTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFoursomePack: () => void;
}

export const FoursomeTryOnModal: React.FC<FoursomeTryOnModalProps> = ({ isOpen, onClose, onAddFoursomePack }) => {
  const [selectedColor, setSelectedColor] = useState('Deep Maritime Navy');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'result'>('result');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setActiveTab('result');
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareWhatsApp = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    const text = encodeURIComponent("Check out our foursome suited up in High Draw Golf polos for Saturday! Tour quality, no $110 overpriced retail markup: https://highdrawgolf.com");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://highdrawgolf.com/try-on?group=foursome-01");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-[#0000] z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white hairline-all shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="bg-[#0D1B2A] text-white p-6 hairline-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C03221] text-white rounded-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-300">
                PROPRIETARY AI STUDIO ENGINE
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-normal text-white">
                The Foursome Try-On Generator
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-8">

          {/* Tab Controls */}
          <div className="flex border-b border-slate-200 font-mono text-[11px] uppercase tracking-[0.2em]">
            <button
              onClick={() => setActiveTab('result')}
              className={`pb-3 px-6 border-b-2 font-semibold transition-all ${
                activeTab === 'result' ? 'border-[#0D1B2A] text-[#0D1B2A]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              1. PREVIEW RESULT & EXPORT
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-3 px-6 border-b-2 font-semibold transition-all ${
                activeTab === 'upload' ? 'border-[#0D1B2A] text-[#0D1B2A]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              2. UPLOAD YOUR FOURSOME PHOTO
            </button>
          </div>

          {activeTab === 'upload' ? (
            /* Upload Screen */
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-sm p-10 text-center hover:border-slate-500 transition-colors bg-[#FBFBFA]">
                <Upload size={36} className="mx-auto text-slate-400 mb-4" />
                <h3 className="font-serif text-lg text-[#090C10] font-medium mb-1">
                  Upload Foursome Photo from 18th Green
                </h3>
                <p className="font-sans text-xs text-slate-500 font-light mb-6 max-w-md mx-auto">
                  Supports HEIC, PNG, JPG. Our vision segmentation model automatically fits your group in High Draw polos.
                </p>
                <label className="btn-obsidian px-6 py-3 text-xs tracking-widest cursor-pointer inline-flex items-center gap-2">
                  <span>SELECT GROUP PHOTO</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Rendered Image (7 Cols) */}
              <div className="md:col-span-7 space-y-4">
                <div className="relative aspect-[4/3] bg-[#090C10] hairline-all overflow-hidden group">
                  <img 
                    src={uploadedImage || "/assets/foursome_after.png"} 
                    alt="AI Rendered Foursome" 
                    className="w-full h-full object-cover"
                  />

                  {isProcessing && (
                    <div className="absolute inset-0 bg-[#090C10]/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3 font-mono text-xs">
                      <Sparkles size={24} className="text-[#C03221] animate-spin" />
                      <span>SEGMENTING FOURSOME & APPLYING HIGH DRAW POLOS...</span>
                    </div>
                  )}

                  {/* AI Badge */}
                  <div className="absolute top-4 left-4 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase tracking-[0.2em] px-3 py-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>AI TRY-ON READY &bull; HIGH RESOLUTION</span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span>GROUP: 4 PLAYERS DETECTED</span>
                  <span>EST. FIT: TOUR REGULAR</span>
                </div>
              </div>

              {/* Right Options & Viral Sharing (5 Cols) */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C03221] font-semibold block mb-1">
                    GARMENT SELECTION
                  </span>
                  <h3 className="font-serif text-xl text-[#090C10] font-medium">
                    Foursome Match Kit
                  </h3>
                  <p className="font-sans text-xs text-slate-500 font-light mt-1">
                    4 Core Performance Polos + 4 Structured Rope Caps for your group.
                  </p>
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 block">
                    COLORWAY: <span className="text-[#090C10]">{selectedColor}</span>
                  </label>
                  <div className="flex gap-2">
                    {['Deep Maritime Navy', 'Charcoal Slate', 'Crisp White'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 font-mono text-[10px] uppercase border transition-all ${
                          selectedColor === c ? 'bg-[#090C10] text-white border-[#090C10]' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {c.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Viral Share Actions */}
                <div className="hairline-all bg-[#FBFBFA] p-4 space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#090C10] font-semibold flex items-center gap-1.5">
                    <Share2 size={12} className="text-[#C03221]" />
                    <span>SHARE WITH FOURSOME CHAT</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleShareWhatsApp}
                      className="flex-1 py-2.5 bg-[#25D366] text-white font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-[#1ebd59] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Share2 size={12} />
                      <span>WHATSAPP CHAT</span>
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="py-2.5 px-4 bg-white border border-slate-300 text-[#090C10] font-mono text-[10px] uppercase tracking-[0.15em] hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedLink ? 'COPIED!' : 'LINK'}</span>
                    </button>
                  </div>
                </div>

                {/* Group Order Special */}
                <div className="pt-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">4-PACK SPECIAL PRICE</span>
                    <div className="font-mono text-right">
                      <span className="text-lg font-bold text-[#090C10]">$160 USD</span>
                      <span className="text-xs text-slate-400 line-through ml-2">$192</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAddFoursomePack();
                      onClose();
                    }}
                    className="w-full btn-obsidian py-4 text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                    <span>ORDER 4-PACK FOR GROUP &bull; $160</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#FBFBFA] px-8 py-4 hairline-t flex items-center justify-between font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-600" />
            Zero Risk &bull; Free Group Shipping Included
          </span>
          <span>HIGH DRAW GOLF &bull; APPAREL ENGINE</span>
        </div>

      </div>
    </div>
  );
};
