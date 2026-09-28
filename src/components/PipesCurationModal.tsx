import React from 'react';
import { X, Sparkles, Check, User, ShieldCheck } from 'lucide-react';

interface PipesCurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBoard: string;
  onSelectBoard: (boardName: string, heroImage: string) => void;
}

export const PipesCurationModal: React.FC<PipesCurationModalProps> = ({
  isOpen,
  onClose,
  activeBoard,
  onSelectBoard,
}) => {
  if (!isOpen) return null;

  const boards = [
    {
      id: 'autumn-fairways',
      name: 'Autumn Fairways (Golden Hour)',
      heroImage: '/assets/lifestyle_golf.jpg',
      description: 'Clean medium-format fairway walking shots with warm afternoon lighting.',
      tag: 'ACTIVE BOARD',
    },
    {
      id: 'flatlay-craftsmanship',
      name: 'Flatlay & Textile Micro-Pique',
      heroImage: '/assets/polo_flatlay.jpg',
      description: 'Studio folded flatlay photography featuring Navy and Augusta Green polos on oak.',
      tag: 'PREMIUM FLATLAY',
    },
    {
      id: 'brutalist-architectural',
      name: 'Brutalist Clubhouse Twilight',
      heroImage: '/assets/hero_balenciaga.png',
      description: 'High fashion architectural campaign shots for evening fairway events.',
      tag: 'ARCHITECTURAL',
    },
    {
      id: 'veranda-clubhouse',
      name: 'Coastal Resort Veranda',
      heroImage: '/assets/hero_editorial.png',
      description: 'Coastal ocean background lookbook shots at Pebble Beach.',
      tag: 'COASTAL LOOKBOOK',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300 border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#2A4236] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B12535] text-white rounded">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 flex items-center gap-1.5">
                <User size={12} />
                <span>PIPE OWNER: KEN SIRI (KENSIRI@GMAIL.COM)</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-white">
                High Draw Golf &bull; Private Business Pipe
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Free Business Pipe License Active:</strong> This private pipe allows Ken Cyree (`kencyree@gmail.com`) in Clark to curate photography boards and drive how the High Draw Golf storefront looks in real-time.
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              SELECT CURATED PHOTO BOARD FOR STOREFRONT:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boards.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    onSelectBoard(b.name, b.heroImage);
                    onClose();
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    activeBoard === b.name
                      ? 'border-[#2A4236] bg-emerald-50/50 shadow-md'
                      : 'border-slate-200 hover:border-slate-400 bg-white'
                  }`}
                >
                  <div className="aspect-[16/9] bg-slate-900 rounded overflow-hidden relative">
                    <img src={b.heroImage} alt={b.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-[#2A4236] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      {b.tag}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-sm font-bold text-[#32363F]">{b.name}</h4>
                      {activeBoard === b.name && <Check size={16} className="text-emerald-700" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 text-center text-xs text-slate-500 border-t border-slate-200">
          CURATED IN CLARK VIA HIGH DRAW GOLF PIPE &bull; FREE BUSINESS LICENSE
        </div>

      </div>
    </div>
  );
};
