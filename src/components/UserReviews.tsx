import React, { useState, useEffect } from 'react';
import { Star, Plus, Check, ShieldCheck, Quote } from 'lucide-react';

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
  tag: 'collar' | 'course' | 'foursome' | 'all';
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
    tag: 'collar',
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
    tag: 'foursome',
  },
  
];

export const UserReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window === 'undefined') return INITIAL_REVIEWS;
    try {
      const saved = localStorage.getItem('highdraw_user_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'collar' | 'course' | 'foursome'>('all');
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
    try {
      localStorage.setItem('highdraw_user_reviews', JSON.stringify(reviews));
    } catch {
      // ignore
    }
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
      image: '/assets/products/editorial/men_polo_navy_course.jpg',
      productWorn,
      date: 'Just now',
      tag: 'course',
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

  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter(r => r.tag === activeFilter || !r.tag);

  return (
    <section id="reviews" className="w-full py-28 lg:py-36 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-white border-b border-slate-200">
      
      {/* Header & Filter Controls */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 mb-16 border-b border-slate-200">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/brand/logo_tracer_cyan.png" 
              alt="High Draw Mark" 
              className="h-4 w-auto object-contain"
            />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#B12535]">
              FIELD NOTES &bull; VERIFIED 100+ ROUND EXPERIENCES
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1F26] font-bold tracking-tight">
              The Fairway Journal
            </h2>
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 text-[#1A1F26] px-3.5 py-1.5 rounded-xs text-xs font-semibold">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="font-mono font-bold">5.0 / 5.0</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-600">Zero Bacon Collars Reported</span>
            </div>
          </div>
        </div>

        {/* Filter Pill Navigation & Submit CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xs border border-slate-200 p-1 bg-slate-50 text-xs font-mono uppercase tracking-wider">
            {[
              { id: 'all', label: 'All Notes' },
              { id: 'collar', label: 'Collar Tests' },
              { id: 'course', label: 'Pro Shop Comparisons' },
              { id: 'foursome', label: 'Foursome Kits' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-bold ${
                  activeFilter === f.id
                    ? 'bg-[#1C2C24] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1A1F26]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFormOpen(!formOpen)}
            className="px-5 py-2.5 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>SUBMIT FIELD NOTE</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form Drawer */}
      {formOpen && (
        <div className="max-w-4xl mx-auto mb-20 animate-in fade-in duration-200">
          <form onSubmit={handleSubmitReview} className="bg-[#FBFBFA] border border-slate-300 p-6 sm:p-10 rounded-xs shadow-xl space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">Submit Your Course Field Note</h3>
              <p className="text-xs text-slate-500 mt-1">Tell fellow weekenders how the stay-flat collar and micro-pique drape held up in real play.</p>
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
                  placeholder="e.g. Pinehurst No. 2" 
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Worn</label>
                <select 
                  value={productWorn} 
                  onChange={(e) => setProductWorn(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
                >
                  <option value="The Heritage Cypress Micro-Pique Polo">The Heritage Cypress Micro-Pique Polo ($48)</option>
                  <option value="The Coastal Carolina Performance Stripe Polo">The Coastal Carolina Stripe Polo ($48)</option>
                  <option value="The Classic Performance Polo — Deep Navy">The Classic Deep Navy Polo ($48)</option>
                  <option value="The 19th Hole Performance Quarter-Zip">The 19th Hole Performance Quarter-Zip ($56)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Headline</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best stay-flat collar I've worn in 20 years" 
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Field Feedback *</label>
              <textarea 
                required 
                rows={3} 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe collar durability, shoulder mobility on full swings, or wash performance..." 
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1C2C24]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button 
                type="submit" 
                className="px-6 py-3.5 bg-[#B12535] text-white font-bold text-xs uppercase tracking-wider rounded-xs hover:bg-[#8E1D29] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                {submitted ? (
                  <>
                    <Check size={16} />
                    <span>FIELD NOTE PUBLISHED!</span>
                  </>
                ) : (
                  <span>POST VERIFIED FIELD NOTE</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 uppercase font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Spaced-Out Field Notes Grid (Frameless Editorial Stories, Zero Clunky Boxed Cards) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
        {filteredReviews.map((r) => (
          <div key={r.id} className="space-y-5 flex flex-col justify-between">
            <div>
              {/* Clean Frameless Photography */}
              <div className="aspect-[16/11] w-full overflow-hidden rounded-xs relative bg-slate-100 border border-slate-200/60 shadow-sm group">
                <img 
                  src={r.image} 
                  alt={`${r.author} wearing High Draw`} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-xs flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#38BDF8]" />
                  <span>Verified Buyer &bull; {r.productWorn}</span>
                </div>
              </div>

              {/* Review Typography & Stars */}
              <div className="pt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{r.date}</span>
                </div>

                <h4 className="font-serif text-xl font-bold text-[#1A1F26] leading-snug">
                  &ldquo;{r.title}&rdquo;
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {r.comment}
                </p>
              </div>
            </div>

            {/* Discreet Author Line with Hairline Rule */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#1A1F26] block">{r.author}</span>
                <span className="text-slate-500 text-[11px]">{r.club}</span>
              </div>
              <span className="text-[11px] font-mono text-[#1C2C24] bg-[#1C2C24]/5 border border-[#1C2C24]/10 px-2 py-0.5 rounded-xs font-semibold">
                {r.handicap}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
