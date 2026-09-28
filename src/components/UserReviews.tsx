import React, { useState, useEffect } from 'react';
import { Star, Plus, Check, Quote } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  club: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    author: 'Marcus T.',
    club: 'Pinehurst No. 2 Member',
    rating: 5,
    title: 'Solves the collar curl issue completely',
    comment: 'The collar stays rigid under a sweater and the drape hides sweat after 18 holes. Extremely impressed for $48.',
    date: 'Sep 12, 2026',
  },
  {
    id: 'rev-02',
    author: 'David R.',
    club: 'Pebble Beach Scramble Captain',
    rating: 5,
    title: 'Bought 4 for my Saturday foursome',
    comment: 'Handed these out before our round. Everyone loved the fit. Zero synthetic shine.',
    date: 'Sep 10, 2026',
  },
  {
    id: 'rev-03',
    author: 'Julian K.',
    club: 'Torrey Pines Club Golfer',
    rating: 5,
    title: 'Peter Millar feel at half the price',
    comment: 'Fabric drape is identical to $130 boutique polos. The nape tracer detail is pure insider subtlety.',
    date: 'Sep 08, 2026',
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
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
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
      rating,
      title: title || 'Verified Purchase Review',
      comment,
      date: 'Just now',
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormOpen(false);
      setAuthor('');
      setClub('');
      setTitle('');
      setComment('');
      setRating(5);
    }, 1500);
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews" className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-[#F5F4F0] border-t border-slate-200">
      
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 mb-12 border-b border-slate-300">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B12535] block mb-1">
            FIELD REVIEWS & REPUTATION
          </span>
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#32363F] font-bold">
              Golfer Feedback
            </h2>
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 px-3 py-1.5 rounded text-xs font-bold">
              <Star size={14} fill="currentColor" className="text-amber-500" />
              <span>{avgRating} / 5.0 ({reviews.length} Reviews)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-5 py-3 bg-[#32363F] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus size={16} className="inline mr-1.5" />
          WRITE A REVIEW
        </button>
      </div>

      {/* Review Submission Form Drawer */}
      {formOpen && (
        <form onSubmit={handleSubmitReview} className="bg-white border border-slate-300 p-6 sm:p-8 rounded-lg shadow-lg mb-12 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#32363F]">Share Your Fairway Experience</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
              <input 
                type="text" 
                required 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Ken S." 
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#32363F]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Golf Club / Handicap</label>
              <input 
                type="text" 
                value={club} 
                onChange={(e) => setClub(e.target.value)}
                placeholder="e.g. 12 Handicap / Local Scramble Golfer" 
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#32363F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Rating</label>
              <select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#32363F]"
              >
                <option value={5}>5 Stars - Exceptional Quality</option>
                <option value={4}>4 Stars - Great Value</option>
                <option value={3}>3 Stars - Good</option>
                <option value={2}>2 Stars - Average</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Review Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Excellent collar memory" 
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#32363F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Feedback *</label>
            <textarea 
              required 
              rows={3} 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the fabric weight, collar structure, or swing fit..." 
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#32363F]"
            />
          </div>

          <button type="submit" className="px-6 py-3 bg-[#B12535] text-white font-bold text-xs uppercase tracking-wider rounded-xs hover:bg-[#8e1d29] transition-colors">
            {submitted ? (
              <span className="flex items-center gap-1.5"><Check size={16} /> REVIEW PUBLISHED!</span>
            ) : (
              <span>SUBMIT REVIEW</span>
            )}
          </button>
        </form>
      )}

      {/* Clean Editorial Reviews Grid (No Cheap Card Borders) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {reviews.map((r) => (
          <div key={r.id} className="space-y-4 bg-white p-8 rounded-lg shadow-sm border border-slate-200/80 relative">
            <Quote size={32} className="text-slate-200 absolute top-6 right-6" />

            <div className="flex text-amber-500 gap-1">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>

            <h4 className="font-serif text-lg font-bold text-[#32363F] leading-snug">{r.title}</h4>
            <p className="text-xs text-slate-600 font-normal leading-relaxed font-sans">{r.comment}</p>

            <div className="pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-semibold">
              <span>{r.author}</span>
              <span className="text-slate-400 font-normal">{r.club}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
