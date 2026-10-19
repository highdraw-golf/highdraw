import React from 'react';
import { ArrowLeft, ArrowRight, Play, MapPin, Award, Compass, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onGoToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToHome,
  onGoToShop,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header Banner */}
      <div className="bg-[#1C2C24] text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
            <span>BACK TO HOME</span>
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/assets/brand/logo_tracer_cyan.png" alt="Tracer" className="h-4 w-auto object-contain" />
              <span className="text-[11px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                THE FOUNDER'S STORY &bull; DR. KEN CYREE
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              40 Years on the Fairways. <br className="hidden sm:inline" />
              <span className="italic font-normal text-slate-300">A Quest Across 47 States for an Honest $48 Polo.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed pt-2">
              Why former Business Dean and avid 3.8-handicap golfer Dr. Ken Cyree founded High Draw: to capture the pure joy of a solid shot and end the $125 legacy markup tax on golf apparel.
            </p>
          </div>
        </div>
      </div>

      {/* Main Editorial Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-16 text-slate-700 leading-relaxed text-sm sm:text-base">
        
        {/* Hero Swing Photo & Intro */}
        <div className="space-y-6">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xs overflow-hidden border border-slate-200 shadow-xl group">
            <img 
              src="/assets/founder/ken_tee_shot_backswing.jpg" 
              alt="Dr. Ken Cyree at top of backswing on elevated tee box" 
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700" 
            />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-[#1C2C24]/90 backdrop-blur-md text-white p-3.5 sm:px-5 sm:py-3 rounded-xs border border-white/10 shadow-lg">
              <div className="font-serif font-bold text-sm sm:text-base text-white">Dr. Ken Cyree &bull; 3.8 Handicap Index</div>
              <div className="text-[11px] font-mono text-[#38BDF8]">CO-FOUNDER, HIGH DRAW GOLF CO. &bull; 40+ YEARS PLAYING GOLF</div>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-4 pt-4">
            <p className="text-lg sm:text-xl font-serif text-[#1A1F26] leading-relaxed italic">
              &ldquo;I have had many of the pressures of life that all people do&mdash;juggling family and career while working hard to do your best at your chosen path. As a stress reliever, I have used golf since it is one of the few things I do where I am not thinking about work or other challenges.&rdquo;
            </p>
            <p>
              Ken Cyree is a founder of High Draw Gear and an avid golfer who has been walking fairways for over 40 years. Through decades of academic leadership as a Professor of Finance and former Dean of the School of Business Administration at the University of Mississippi (Ole Miss), the golf course was his sanctuary. It was where life paused, focus narrowed to 4.25 inches of cup in the green turf, and the camaraderie of a weekend foursome restored equilibrium.
            </p>
          </div>
        </div>

        {/* 50 States Quest Showcase */}
        <div className="bg-[#1C2C24] text-white p-8 sm:p-10 rounded-xs shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-mono font-bold uppercase tracking-wider">
                <Compass size={16} />
                <span>The National Bucket List</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Playing Golf in All 50 States
              </h2>
            </div>
            <div className="flex items-baseline gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xs self-start sm:self-auto">
              <span className="font-mono text-3xl font-bold text-[#38BDF8]">47</span>
              <span className="text-xs text-slate-300 font-mono uppercase tracking-wider">/ 50 Complete</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4 text-slate-200 text-sm sm:text-base">
              <p>
                &ldquo;I traveled a lot for my job and for pleasure, and one of my bucket list items was to play golf in all 50 states. I only have three left: <strong>Alaska, Hawaii, and Montana</strong>. This journey has taken me to classic courses, seaside links, mountain doglegs, and beloved municipal gems all across the country.&rdquo;
              </p>
              <p>
                From the sandhills of Nebraska to the tree-lined fairways of Mississippi, Ken experienced firsthand what works on the golf course&mdash;and what doesn't.
              </p>
            </div>
            <div className="md:col-span-5 bg-white/5 border border-white/10 p-5 rounded-xs space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                <MapPin size={14} className="text-[#B12535]" />
                <span>Remaining 3 States</span>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>Alaska</span>
                  <span className="text-[#38BDF8] text-[10px]">On The Horizon</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>Hawaii</span>
                  <span className="text-[#38BDF8] text-[10px]">On The Horizon</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Montana</span>
                  <span className="text-[#38BDF8] text-[10px]">On The Horizon</span>
                </li>
              </ul>
              <div className="pt-2 text-[11px] text-slate-400 italic">
                47 states played and counting with his signature draw ball-flight.
              </div>
            </div>
          </div>
        </div>

        {/* The $125 Pro Shop Tax & Southern Humidity */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-wider">
              <Award size={16} />
              <span>THE FINANCE PROFESSOR'S CALCULUS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F26]">
              Ending the $125 Pro Shop Guilt Trip
            </h2>
            <p className="text-slate-600">
              &ldquo;I noticed in my travels that if I wanted to buy a golf shirt with the club logo on it, they became prohibitively expensive, in my opinion. I would almost feel guilty paying $125 for a golf shirt and then wearing it to the course and drenching it with sweat in the heat and humidity we have in the South.&rdquo;
            </p>
            <p className="text-slate-600">
              As a finance professor, Ken understood the supply chain: the high price tag wasn't paying for better fabric; it was paying for luxury real estate overhead, multimillion-dollar PGA Tour player endorsements, and multi-tiered retail distribution markups.
            </p>
            <p className="text-slate-600 font-medium text-[#1C2C24]">
              &ldquo;I felt like there should be a shirt that was performance-oriented to allow for freedom of movement and handling the heat, while not breaking your budget. That was the genesis of High Draw.&rdquo;
            </p>
          </div>
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-[3/4] sm:aspect-square rounded-xs overflow-hidden border border-slate-200 shadow-lg">
              <img 
                src="/assets/founder/ken_fairway_wave_sun.jpg" 
                alt="Ken walking the fairway waving in the sun" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-xs text-slate-500 font-mono text-center">
              Ken on the fairway: breathable performance designed for real Southern humidity.
            </div>
          </div>
        </div>

        {/* The Video & The Physics of the High Draw */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] bg-[#1C2C24] px-2.5 py-1 rounded-xs inline-block">
              SHOT SHAPING &amp; TEMPO
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1F26]">
              Why &ldquo;High Draw&rdquo;? The Pure Joy of a Solid Strike
            </h2>
          </div>
          
          <p>
            &ldquo;I chose the name High Draw since I am well known for playing a draw on every shot. Most golfers covet a high draw off the tee to maximize distance, and it is a satisfying shot that creates the joy of a solid shot that keeps you coming back for more. Thus, I wanted a shirt that captured the joy of a great golf shot and allowed the golfer to wear it every day to the course or work since it is a great value and stylish.&rdquo;
          </p>

          {/* Embedded Video Player */}
          <div className="bg-slate-900 rounded-xs overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 sm:p-5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <Play size={16} className="text-[#38BDF8]" fill="#38BDF8" />
                <span className="font-serif font-bold text-sm sm:text-base">Ken Grooving the Signature High Draw</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Practice Range &bull; 42s</span>
            </div>
            <div className="relative aspect-[9/16] sm:aspect-[16/9] bg-black flex items-center justify-center max-h-[540px] mx-auto overflow-hidden">
              <video 
                controls 
                preload="metadata"
                poster="/assets/founder/ken_range_draw_poster.png"
                className="w-full h-full object-contain max-h-[540px]"
              >
                <source src="/assets/founder/ken_range_draw_swing.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>
            <div className="p-3 bg-slate-950 text-center text-xs text-slate-400 font-mono">
              Watch Ken's balanced tempo through impact producing his signature right-to-left apex.
            </div>
          </div>
        </div>

        {/* Scenic Ridge Swing Photo */}
        <div className="relative aspect-[16/9] rounded-xs overflow-hidden border border-slate-200 shadow-lg">
          <img 
            src="/assets/founder/ken_overcast_apex_swing.jpg" 
            alt="Ken Cyree golf swing with rolling mountain ridgeline" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-sm text-white px-4 py-2.5 rounded-xs text-xs font-sans">
            Tested on dramatic elevation changes and tough autumn conditions across 47 states.
          </div>
        </div>

        {/* Lori Cyree's Take Play to Work Line */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FBFBFA] p-8 sm:p-10 border border-slate-200 rounded-xs">
          <div className="md:col-span-5 space-y-2">
            <div className="aspect-[4/5] rounded-xs overflow-hidden border border-slate-200 shadow-md">
              <img 
                src="/assets/founder/ken_and_lori_portrait.jpg" 
                alt="Ken and Lori Cyree" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-[11px] font-mono text-slate-500 text-center">
              Ken &amp; Lori Cyree &bull; Oxford, Mississippi
            </div>
          </div>
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-[#B12535] text-xs font-bold uppercase tracking-wider">
              <Heart size={16} />
              <span>THE SPOUSE &amp; FAMILY PERSPECTIVE</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F26]">
              &ldquo;Take Play to Work&rdquo; &mdash; Lori Cyree
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              When evaluating golf apparel, Lori Cyree brought the critical lens that makes High Draw unique: the perspective of the spouse and the working professional.
            </p>
            <blockquote className="border-l-4 border-[#1C2C24] pl-4 italic text-slate-700 text-sm">
              &ldquo;I used to buy long-sleeved polos for Ken so we saved on dry cleaning, he was more comfortable throughout 12-hour academic and executive days, and he looked like a team player who could walk straight from a meeting to the putting green.&rdquo;
            </blockquote>
            <p className="text-slate-600 text-sm leading-relaxed">
              Her insight shaped our broader product vision: apparel that doesn't scream athletic gym wear, but features refined collar memory and premium drape suitable for the office, Sunday lunch, or a 36-hole weekend marathon.
            </p>
          </div>
        </div>

        {/* University Dean & Executive Atrium Photo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4 order-2 md:order-1">
            <div className="flex items-center gap-2 text-[#1C2C24] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={16} className="text-[#38BDF8]" />
              <span>THE EXECUTIVE FOUNDATION</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F26]">
              From the Dean's Office to the First Tee
            </h3>
            <p className="text-slate-600">
              High Draw is built on the shared principles of Dr. Ken Cyree and his son Kyle (UNC Kenan-Flagler MBA): disciplined unit economics, genuine respect for the customer's hard-earned dollar, and an obsession with quality that doesn't rely on bloated retail markup tricks.
            </p>
            <ul className="space-y-2.5 pt-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-[#1C2C24] mt-1 shrink-0" />
                <span><strong>Tailored Fairway Comfort:</strong> Breathable, lightweight fabric that holds its shape and comfort through warm summer rounds.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-[#1C2C24] mt-1 shrink-0" />
                <span><strong>Zero Synthetic Gym Sheen:</strong> Ultra-refined 180 GSM yarn-dyed matte micro-pique that breathes in summer heat.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-[#1C2C24] mt-1 shrink-0" />
                <span><strong>The Senior Athletic Drape:</strong> Tailored across the shoulders and chest with comfortable ease through the torso.</span>
              </li>
            </ul>
          </div>
          <div className="md:col-span-5 order-1 md:order-2 space-y-2">
            <div className="aspect-[3/4] rounded-xs overflow-hidden border border-slate-200 shadow-md">
              <img 
                src="/assets/founder/ken_and_lori_globe_atrium.jpg" 
                alt="Ken and Lori Cyree at university globe atrium" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-[11px] font-mono text-slate-500 text-center">
              Executive leadership meets fairway passion.
            </div>
          </div>
        </div>

        {/* Founder Closing Note */}
        <div className="p-8 bg-[#1C2C24] text-white rounded-xs space-y-4 border-l-4 border-[#38BDF8]">
          <h3 className="font-serif text-xl sm:text-2xl font-bold">
            &ldquo;Play Well!&rdquo;
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
            &ldquo;I hope all my friends and fellow golfers enjoy the brand and enhance their life in wearing our gear. We created this for the joy of the game, the walk with good friends, and the thrill of seeing that high draw turn into the flag.&rdquo;
          </p>
          <div className="pt-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider">
            &mdash; Dr. Ken Cyree &bull; Co-Founder, High Draw Golf Co.
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8 border-t border-slate-200 space-y-4">
          <p className="text-sm font-serif italic text-slate-600">
            Tour-grade performance. Senior athletic fit. Honest $48 pricing.
          </p>
          <button
            onClick={onGoToShop}
            className="px-8 py-4 bg-[#B12535] hover:bg-[#8E1D29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-lg inline-flex items-center gap-2 transition-all hover:scale-102"
          >
            <span>SHOP THE CORE POLO COLLECTION &bull; $48</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
