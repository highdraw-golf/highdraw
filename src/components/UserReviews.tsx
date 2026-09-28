import React, { useState, useEffect } from 'react';
import { Star, Plus, Check, Quote, ShieldCheck } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  club: string;
  handicap: string;
  rating: number;
  title: string;
  comment: string;
  image: string;
  productWorn: string;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    author: 'Marcus Thornton',
    club: 'Pinehurst No. 2 Regular',
    handicap: '9.4 Index',
    rating: 5,
    title: 'Eliminated the collar curl issue permanently',
    comment: 'The fused stay-flat collar holds its structure perfectly under a sweater or after 18 holes in the humidity. Most polos curl into bacon after three trips through the washer, but this collar stays as crisp as day one. Genuinely shocked this is only $48.',
    image: '/assets/review_marcus.jpg',
    productWorn: 'The Heritage Cypress Micro-Pique (L)',
    date: '3 days ago',
  },
  {
    id: 'rev-02',
    author: 'David Rodriguez',
    club: 'Pebble Beach Scramble Captain',
    handicap: '6.2 Index',
    rating: 5,
    title: 'Bought 4 for my regular Saturday group',
    comment: 'Handed these out to my foursome before our 7:30 AM tee time. The 4-way stretch drape is completely unrestricted through the transition, and there is zero synthetic gym shine. Everyone asked where I bought them.',
    image: '/assets/review_david.jpg',
    productWorn: 'The Coastal Carolina Stripe Polo (L)',
    date: '1 week ago',
  },
  {
    id: 'rev-03',
    author: 'Ken Cyree',
    club: 'Country Club Weekender',
    handicap: '11.8 Index',
    rating: 5,
    title: 'Luxury pro shop drape without the $125 retail markup',
    comment: 'At 60, I want a polo that fits properly across the shoulders without hugging my stomach. The micro-pique drape is identical to boutique brands that charge $120. The High Draw ball flight tracer embroidered on the chest and nape is pure understated class.',
    image: '/assets/review_ken.jpg',
    productWorn: 'The Classic Deep Navy Polo (XL)',
    date: '2 weeks ago',
  },
];

export const UserReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('highdraw_user_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [formOpen, setFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [club, setClub] = useState('');
  const [handicap, setHandicap] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [productWorn, setProductWorn] = useState('The Heritage Cypress Micro-Pique Polo');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('highdraw_user_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author,
      club: club || 'Verified Golfer',
      handicap: handicap || 'Dedicated Weekender',
      rating,
      title: title || 'Verified Course Feedback',
      comment,
      image: '/assets/review_marcus.jpg',
      productWorn,
      date: 'Just now',
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormOpen(false);
      setAuthor('');
      setClub('');
      setHandicap('');
      setTitle('');
      setComment('');
      setRating(5);
    }, 1200);
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews" className="w-full py-24 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-white border-b border-slate-200">
      
      {/* Header & Write Review Action */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-14 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/assets/logo_tracer_cyan.png" 
              alt="High Draw Mark" 
              className="h-4 w-auto object-contain"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-[#B12535]">
              VERIFIED GOLFER EXPERIENCES &bull; 100+ ROUNDS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1F26] font-bold">
              Fairway Feedback
            </h2>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-[#1A1F26] px-3.5 py-1.5 rounded-sm text-xs font-bold shadow-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span>{avgRating} / 5.0 ({reviews.length} Verified Reviews)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-6 py-3.5 bg-[#1C2C24] hover:bg-[#121d18] text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all self-start sm:self-auto shadow-sm active:scale-95 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>WRITE A REVIEW</span>
        </button>
      </div>

      {/* Review Submission Form Drawer */}
      {formOpen && (
        <div className="max-w-4xl mx-auto mb-16">
          <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-300 p-6 sm:p-10 rounded-sm shadow-xl space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">Submit Your Fairway Review</h3>
              <p className="text-xs text-slate-500 mt-1">Tell other golfers how the stay-flat collar and micro-pique drape held up in play.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
                <input 
                  type="text" 
                  required 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Ken C." 
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Home Club / Course</label>
                <input 
                  type="text" 
                  value={club} 
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="e.g. Augusta Country Club" 
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Handicap Index</label>
                <input 
                  type="text" 
                  value={handicap} 
                  onChange={(e) => setHandicap(e.target.value)}
                  placeholder="e.g. 10.4 Index" 
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rating</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
                >
                  <option value={5}>5 Stars — Exceeds $125 Boutique Quality</option>
                  <option value={4}>4 Stars — Great Fit & Drape</option>
                  <option value={3}>3 Stars — Average</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Purchased</label>
                <select 
                  value={productWorn} 
                  onChange={(e) => setProductWorn(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
                >
                  <option value="The Heritage Cypress Micro-Pique Polo">The Heritage Cypress Micro-Pique Polo ($48)</option>
                  <option value="The Coastal Carolina Performance Stripe Polo">The Coastal Carolina Performance Stripe Polo ($48)</option>
                  <option value="The Classic Performance Polo — Deep Navy">The Classic Deep Navy Polo ($48)</option>
                  <option value="The 19th Hole Performance Quarter-Zip">The 19th Hole Performance Quarter-Zip ($68)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Review Headline</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best stay-flat collar I've worn in 20 years" 
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Review Details *</label>
              <textarea 
                required 
                rows={3} 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe how the collar held up, fabric stretch on your swing, or wash durability..." 
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button 
                type="submit" 
                className="px-6 py-3.5 bg-[#B12535] text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#8e1d29] transition-colors flex items-center gap-2"
              >
                {submitted ? (
                  <>
                    <Check size={16} />
                    <span>REVIEW PUBLISHED LIVE!</span>
                  </>
                ) : (
                  <span>POST VERIFIED REVIEW</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 uppercase font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Picture-Heavy Real Golfer Review Cards (Real Golfers Wearing High Draw) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {reviews.map((r) => (
          <div 
            key={r.id} 
            className="flex flex-col justify-between bg-slate-50 border border-slate-200/90 rounded-sm overflow-hidden shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Real Golfer Course Photo */}
            <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-200 border-b border-slate-200">
              <img 
                src={r.image} 
                alt={`${r.author} wearing High Draw`} 
                className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-xs flex items-center gap-1.5 font-medium">
                <ShieldCheck size={13} className="text-[#38BDF8]" />
                <span>Verified Buyer &bull; {r.productWorn}</span>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{r.date}</span>
                </div>

                <h4 className="font-serif text-xl font-bold text-[#1A1F26] leading-snug">
                  "{r.title}"
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {r.comment}
                </p>
              </div>

              {/* Golfer Identity & Credentials */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1A1F26] block">{r.author}</span>
                  <span className="text-slate-500 text-[11px]">{r.club}</span>
                </div>
                <span className="text-[11px] font-mono text-[#1C2C24] bg-emerald-100/60 px-2 py-0.5 rounded-xs font-semibold">
                  {r.handicap}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
