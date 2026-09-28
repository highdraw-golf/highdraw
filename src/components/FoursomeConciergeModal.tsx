import React, { useState } from 'react';
import { X, Compass, Share2, Check, ArrowRight, ShieldCheck, Copy, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoursomeConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFoursomePack: () => void;
}

export const FoursomeConciergeModal: React.FC<FoursomeConciergeModalProps> = ({ isOpen, onClose, onAddFoursomePack }) => {
  const [selectedColor, setSelectedColor] = useState('Deep Maritime Navy');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Custom sizes per player in group
  const [playerSizes, setPlayerSizes] = useState<{ [key: string]: string }>({
    'Player 1 (Captain)': 'L',
    'Player 2': 'XL',
    'Player 3': 'M',
    'Player 4': 'L',
  });

  if (!isOpen) return null;

  const handleShareGroup = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    const text = encodeURIComponent("Check out our foursome kit in High Draw Golf polos for Saturday's round! Tour quality without the $110 overpriced retail markup: https://highdrawgolf.com");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://highdrawgolf.com/concierge?group=foursome-01");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const updatePlayerSize = (player: string, size: string) => {
    setPlayerSizes((prev) => ({ ...prev, [player]: size }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white hairline-all shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="bg-[#090C10] text-white p-6 hairline-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C03221] text-white rounded-sm">
              <Compass size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
                BESPOKE GROUP FITTING SUITE
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-normal text-white">
                Foursome Fitting & Scramble Concierge
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
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Visual Presentation (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="relative aspect-[4/3] bg-[#090C10] hairline-all overflow-hidden group">
                <img 
                  src="/assets/foursome_after.png" 
                  alt="Foursome Golf Ensemble" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#090C10]/90 border border-white/10 text-white font-mono text-[9px] uppercase tracking-[0.25em] px-3 py-1 flex items-center gap-1.5">
                  <Users size={12} className="text-[#C03221]" />
                  <span>FOURSOME MATCH KIT &bull; 4 POLOS + 4 ROPE CAPS</span>
                </div>
              </div>

              <div className="p-4 bg-[#FBFBFA] hairline-all font-mono text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between font-semibold text-[#090C10]">
                  <span>THE SATURDAY SCRAMBLE BUNDLE</span>
                  <span>SAVE $32 AUTOMATICALLY</span>
                </div>
                <p className="font-sans text-xs font-light text-slate-500 pt-1">
                  Outfit your regular foursome or tournament team in matching High Draw performance polos and vintage rope caps. Delivered directly to your door in 3-5 business days.
                </p>
              </div>
            </div>

            {/* Right Group Sizing & Order Setup (5 Cols) */}
            <div className="md:col-span-5 space-y-6">
              
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C03221] font-semibold block mb-1">
                  PLAYER SIZING SETUP
                </span>
                <h3 className="font-serif text-xl text-[#090C10] font-medium">
                  Select Sizes for Your Group
                </h3>
              </div>

              {/* Player Sizing List */}
              <div className="space-y-3 font-mono text-xs">
                {Object.keys(playerSizes).map((player) => (
                  <div key={player} className="flex items-center justify-between p-3 bg-[#FBFBFA] hairline-all">
                    <span className="text-[#090C10] font-medium text-[11px] uppercase tracking-wider">{player}</span>
                    <div className="flex gap-1">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => updatePlayerSize(player, sz)}
                          className={`w-7 h-7 font-mono text-[10px] font-bold border transition-all ${
                            playerSizes[player] === sz
                              ? 'bg-[#090C10] text-white border-[#090C10]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Colorway Selection */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 block">
                  COLORWAY: <span className="text-[#090C10] font-semibold">{selectedColor}</span>
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

              {/* Share Actions */}
              <div className="hairline-all bg-[#FBFBFA] p-4 space-y-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#090C10] font-semibold flex items-center gap-1.5">
                  <Share2 size={12} className="text-[#C03221]" />
                  <span>SHARE WITH YOUR FOURSOME</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleShareGroup}
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

              {/* Checkout Action */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">4-PACK GROUP SPECIAL</span>
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
                  <span>ACQUIRE FOURSOME BUNDLE &bull; $160</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#FBFBFA] px-8 py-4 hairline-t flex items-center justify-between font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-600" />
            30-Day Fairway Guarantee &bull; Free Group Shipping Included
          </span>
          <span>HIGH DRAW GOLF &bull; BESPOKE APPAREL</span>
        </div>

      </div>
    </div>
  );
};
