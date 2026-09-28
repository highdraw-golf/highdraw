import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, ShieldCheck, Check } from 'lucide-react';

interface ReviewsPageProps {
  onBackToHome: () => void;
  onGoToShop: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  onBackToHome,
  onGoToShop,
}) => {
  const [reviews, setReviews] = useState([
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
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [club, setClub] = useState('');
  const [handicap, setHandicap] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author,
      club: club || 'Verified Golfer',
      handicap: handicap || 'Dedicated Weekender',
      rating,
      title: title || 'Verified Course Review',
      comment,
      image: '/assets/review_marcus.jpg',
      productWorn: 'The Heritage Cypress Micro-Pique Polo (L)',
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
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-[#1C2C24] text-white py-16 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/assets/logo_tracer_cyan.png" alt="Tracer" className="h-4 w-auto object-contain" />
              <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                COMMUNITY &bull; VERIFIED COURSE REVIEWS
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              Fairway Feedback &amp; Proof
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Read how High Draw performance polos hold up through 18 holes of summer heat and 100+ wash cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Review Metrics & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-12 border-b border-slate-200 gap-6">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-4xl sm:text-5xl font-serif font-bold text-[#1A1F26]">5.0</span>
              <div className="flex text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold block text-sm text-[#1A1F26]">100% Recommendation Rate</span>
              <span>Based on verified weekender reviews across 24 home courses</span>
            </div>
          </div>

          <button
            onClick={() => setFormOpen(!formOpen)}
            className="px-6 py-3.5 bg-[#1C2C24] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            <span>WRITE A REVIEW</span>
          </button>
        </div>

        {/* Review Form */}
        {formOpen && (
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-300 p-6 sm:p-10 rounded-xs shadow-lg mb-16 space-y-4 max-w-3xl">
            <h3 className="font-serif text-2xl font-bold text-[#1A1F26]">Post Your Review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input 
                type="text" 
                required 
                placeholder="Your Name" 
                value={author} 
                onChange={e => setAuthor(e.target.value)} 
                className="bg-white border border-slate-300 p-2.5 text-xs rounded"
              />
              <input 
                type="text" 
                placeholder="Home Club" 
                value={club} 
                onChange={e => setClub(e.target.value)} 
                className="bg-white border border-slate-300 p-2.5 text-xs rounded"
              />
              <input 
                type="text" 
                placeholder="Handicap" 
                value={handicap} 
                onChange={e => setHandicap(e.target.value)} 
                className="bg-white border border-slate-300 p-2.5 text-xs rounded"
              />
            </div>
            <textarea 
              required 
              rows={3} 
              placeholder="Your honest feedback on collar durability and fabric drape..." 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              className="w-full bg-white border border-slate-300 p-2.5 text-xs rounded"
            />
            <button type="submit" className="px-6 py-3 bg-[#B12535] text-white font-bold text-xs uppercase tracking-wider rounded-xs">
              {submitted ? 'REVIEW POSTED!' : 'SUBMIT REVIEW'}
            </button>
          </form>
        )}

        {/* Grid of Reviews with Photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(r => (
            <div key={r.id} className="bg-slate-50 border border-slate-200/90 rounded-xs overflow-hidden shadow-xs">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
                <img src={r.image} alt={r.author} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex text-amber-500">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <h4 className="font-serif text-lg font-bold text-[#1A1F26]">"{r.title}"</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                <div className="pt-3 border-t border-slate-200 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1A1F26] block">{r.author}</span>
                    <span className="text-[11px] text-slate-500">{r.club}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#1C2C24] font-semibold">{r.handicap}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
