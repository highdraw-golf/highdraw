export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'polos' | 'outerwear' | 'headwear' | 'bundles';
  collectionLabel: string;
  price: number;
  originalPrice: number;
  image: string;
  secondaryImage: string;
  gallery: string[];
  colors: Array<{ name: string; hex: string; image?: string }>;
  sizes: string[];
  description: string;
  features: string[];
  washGuarantee: string;
  specs: {
    fabric: string;
    weight: string;
    collar: string;
    fit: string;
    protection: string;
  };
}

export const PRODUCTS: Product[] = [
  {
    id: 'polo-white-01',
    slug: 'the-classic-tour-performance-polo-crisp-white',
    name: 'The Classic Tour Performance Polo — Crisp White',
    category: 'polos',
    collectionLabel: "MEN'S CORE POLOS",
    price: 48,
    originalPrice: 115,
    image: '/assets/polo_white_flatlay.jpg',
    secondaryImage: '/assets/lifestyle_golf.jpg',
    gallery: [
      '/assets/polo_white_flatlay.jpg',
      '/assets/lifestyle_golf.jpg',
      '/assets/craft_collar_macro.jpg',
      '/assets/lifestyle_coastal_18th.jpg',
    ],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF', image: '/assets/polo_white_flatlay.jpg' },
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/polo_navy_flatlay.jpg' },
      { name: 'Coastal Carolina', hex: '#6BA4B8', image: '/assets/polo_carolina_blue.jpg' },
      { name: 'Cypress Green', hex: '#2A4236', image: '/assets/polo_cypress_green.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'The definitive tour-grade white performance golf shirt. Pure matte 180 GSM micro-pique drape with zero cling. Features a fused stay-flat collar that stands upright permanently and the official High Draw ball flight tracer logo embroidered in high-contrast midnight black on the left chest.',
    features: [
      'High-contrast midnight black High Draw ball flight tracer embroidered on left chest',
      'Fused interlining collar stand that will never roll or bacon in the wash',
      '180 GSM yarn-dyed matte micro-pique with a tailored fairway drape',
      'UPF 50+ UV solar shield woven directly into the technical yarns',
      'Mother-of-pearl engraved High Draw buttons on a structured 3-button placket',
      'Guaranteed for 100+ machine wash and dry cycles',
    ],
    washGuarantee: '100+ Washes Guarantee • Won’t Shrink, Curl, or Fade',
    specs: {
      fabric: '92% Technical Poly Micro-Pique, 8% Spandex',
      weight: '180 GSM Mid-Weight Breathable Drape',
      collar: 'Proprietary Fused Interlining Stay-Flat Stand',
      fit: 'Structured shoulders with comfortable fairway drape (S–3XL)',
      protection: 'UPF 50+ Solar Block UV Protection',
    },
  },
  {
    id: 'polo-navy-01',
    slug: 'the-classic-performance-polo-deep-navy',
    name: 'The Classic Performance Polo — Deep Midnight Navy',
    category: 'polos',
    collectionLabel: "MEN'S CORE POLOS",
    price: 48,
    originalPrice: 110,
    image: '/assets/polo_navy_flatlay.jpg',
    secondaryImage: '/assets/review_ken.jpg',
    gallery: [
      '/assets/polo_navy_flatlay.jpg',
      '/assets/craft_collar_macro.jpg',
      '/assets/review_ken.jpg',
      '/assets/lifestyle_coastal_18th.jpg',
    ],
    colors: [
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/polo_navy_flatlay.jpg' },
      { name: 'Crisp White', hex: '#FFFFFF', image: '/assets/polo_white_flatlay.jpg' },
      { name: 'Coastal Carolina', hex: '#6BA4B8', image: '/assets/polo_carolina_blue.jpg' },
      { name: 'Cypress Green', hex: '#2A4236', image: '/assets/polo_cypress_green.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Tour-tested solid navy drape featuring the vibrant electric cyan High Draw ball flight tracer embroidered in high contrast on the chest. Structured athletic tailoring, stay-flat fused placket, and luxury drape at an honest $48 mid-market price point.',
    features: [
      'High-contrast electric cyan High Draw ball flight tracer embroidered on chest',
      'Deep indigo color lock yarns that will not fade in direct sunlight or hot wash',
      'Fused stay-flat collar stand with zero bacon curl guarantee',
      'Moisture-transport capillary weave pulls perspiration away from the skin',
      'Mother-of-pearl buttons with High Draw laser etching',
    ],
    washGuarantee: '100+ Washes Guarantee • Wrinkle-Free Dry',
    specs: {
      fabric: '92% Technical Micro-Pique, 8% Stretch Spandex',
      weight: '185 GSM Mid-Weight Solid Knit',
      collar: 'Fused Rigid Stand with Micro-Stitched Edge',
      fit: 'Generous fairway length that stays tucked through 18 holes',
      protection: 'UPF 50+ UV Block',
    },
  },
  {
    id: 'polo-carolina-01',
    slug: 'the-coastal-carolina-performance-stripe-polo',
    name: 'The Coastal Carolina Performance Stripe Polo',
    category: 'polos',
    collectionLabel: "MEN'S STRIPE CAPSULE",
    price: 48,
    originalPrice: 115,
    image: '/assets/polo_carolina_blue.jpg',
    secondaryImage: '/assets/review_david.jpg',
    gallery: [
      '/assets/polo_carolina_blue.jpg',
      '/assets/review_david.jpg',
      '/assets/craft_collar_macro.jpg',
      '/assets/lifestyle_coastal_18th.jpg',
    ],
    colors: [
      { name: 'Coastal Carolina', hex: '#6BA4B8', image: '/assets/polo_carolina_blue.jpg' },
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/polo_navy_flatlay.jpg' },
      { name: 'Crisp White', hex: '#FFFFFF', image: '/assets/polo_white_flatlay.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Subtle yarn-dyed maritime micro-stripe with breathable UPF 50+ UV solar shield. Perfect weight that drapes cleanly over the midsection without pulling. Features the official High Draw tracer logo embroidered in high-contrast dark navy thread on the left chest.',
    features: [
      'High-contrast dark navy High Draw tracer logo embroidered on left chest',
      'Yarn-dyed horizontal micro-stripe that never runs in the laundry',
      'Fused stay-flat collar that stays crisp under sweaters or open',
      'Breathable 4-way mechanical stretch for unrestricted swing rotation',
      'Pre-washed and shrink-tested across 100 industrial wash cycles',
    ],
    washGuarantee: '100+ Washes Guarantee • Anti-Pilling Knit',
    specs: {
      fabric: '90% Poly Micro-Weave, 10% Spandex',
      weight: '180 GSM Technical Maritime Knit',
      collar: 'Self-Fabric Stay-Flat Fused Collar Stand',
      fit: 'Athletic tailored fit through chest, relaxed waist drape',
      protection: 'UPF 50+ Solar Shield UV Resistant',
    },
  },
  {
    id: 'outerwear-zip-01',
    slug: 'the-19th-hole-performance-quarter-zip',
    name: 'The 19th Hole Performance Quarter-Zip',
    category: 'outerwear',
    collectionLabel: 'OUTERWEAR & LAYERING',
    price: 68,
    originalPrice: 145,
    image: '/assets/lifestyle_pullover.jpg',
    secondaryImage: '/assets/lifestyle_coastal_18th.jpg',
    gallery: [
      '/assets/lifestyle_pullover.jpg',
      '/assets/lifestyle_coastal_18th.jpg',
      '/assets/craft_collar_macro.jpg',
    ],
    colors: [
      { name: 'Charcoal Heather', hex: '#475569', image: '/assets/lifestyle_pullover.jpg' },
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/polo_navy_flatlay.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Brushed thermal micro-fleece interior with technical stretch shell. Finished with lockdown zipper garage and storm placket for brisk morning rounds. Features the High Draw tracer logo on the chest in vibrant cyan blue thread.',
    features: [
      'Vibrant electric cyan High Draw tracer logo embroidered on chest',
      'Brushed fleece interior provides warmth without bulk on your swing',
      'Lockdown zipper garage prevents chin irritation at address',
      'Ribbed cuffs and hem retain shape during swing follow-through',
      'Cold wash tested to retain loft and thermal insulation',
    ],
    washGuarantee: 'Cold Wash Tested • Retains Shape & Loft',
    specs: {
      fabric: '88% Poly-Thermal Knit, 12% Spandex',
      weight: '240 GSM Mid-Weight Thermal Layer',
      collar: 'Structured Stand Collar with Internal Wind Flap',
      fit: 'Layering fit designed to wear comfortably over High Draw polos',
      protection: 'Wind-Resistant Thermal Barrier',
    },
  },
  {
    id: 'headwear-rope-01',
    slug: 'the-high-draw-structured-visor-rope-cap',
    name: 'The High Draw Structured Visor Rope Cap',
    category: 'headwear',
    collectionLabel: 'HEADWEAR & ACCESSORIES',
    price: 32,
    originalPrice: 55,
    image: '/assets/hat_rope_white.png',
    secondaryImage: '/assets/lookbook_accessories.jpg',
    gallery: [
      '/assets/hat_rope_white.png',
      '/assets/lookbook_accessories.jpg',
      '/assets/lifestyle_golf.jpg',
    ],
    colors: [
      { name: 'Vintage White / Navy Rope', hex: '#F8FAFC', image: '/assets/hat_rope_white.png' },
    ],
    sizes: ['ONE SIZE (SNAPBACK)'],
    description: 'Classic 5-panel retro structured crown featuring the official High Draw tracer flag embroidery with moisture-wicking headband and braided visor rope accent.',
    features: [
      'Official High Draw tracer flag embroidered in heavy navy thread on the front crown',
      'Moisture-wicking internal sweatband keeps brow dry during hot rounds',
      'Durable nautical braided visor rope across the brim',
      'Adjustable snapback strap fits hat sizes 6 7/8 to 7 3/4',
    ],
    washGuarantee: 'Sweat-Stain Resistant • Hand Wash Rinse',
    specs: {
      fabric: '100% Chino Cotton Twill with Poly Rope Accent',
      weight: 'Structured 5-Panel High-Crown Profile',
      collar: 'N/A',
      fit: 'One Size Fits Most with Premium Snapback Closure',
      protection: 'Anti-Glare Dark Underbill with UPF 50+ Brim',
    },
  },
  {
    id: 'bundle-foursome-01',
    slug: 'the-saturday-foursome-scramble-kit',
    name: 'The Saturday Foursome Scramble Kit (4 Polos)',
    category: 'bundles',
    collectionLabel: 'CURATED BUNDLES',
    price: 160,
    originalPrice: 192,
    image: '/assets/foursome_after.jpg',
    secondaryImage: '/assets/lifestyle_coastal_18th.jpg',
    gallery: [
      '/assets/foursome_after.jpg',
      '/assets/polo_white_flatlay.jpg',
      '/assets/polo_navy_flatlay.jpg',
      '/assets/polo_carolina_blue.jpg',
    ],
    colors: [
      { name: 'Mixed Foursome Selection', hex: '#1E293B' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Outfit your regular weekend group in tour-grade performance polos. $40/shirt bulk bundle rate saves $32 immediately. Arrives in a luxury presentation box with Crisp White, Deep Navy, Coastal Carolina Stripe, and Cypress Green polos.',
    features: [
      'Complete foursome kit includes 4 tour-grade micro-pique polos with High Draw tracer embroidery',
      'Arrives in presentation box with High Draw branded ribbon and balls',
      'Save $32 instantly vs single polo pricing ($40 per shirt)',
      'Mix and match sizing for all four players in your group',
    ],
    washGuarantee: 'Complete Foursome Guarantee • 100+ Washes per Shirt',
    specs: {
      fabric: '180 GSM Micro-Pique Knit Across All 4 Polos',
      weight: '4-Polo Luxury Gift Box Presentation',
      collar: 'All 4 Polos Feature Stay-Flat Fused Collar Stands',
      fit: 'Independent sizing selection for each player (S to 3XL)',
      protection: 'UPF 50+ UV Solar Shield on All Garments',
    },
  },
  {
    id: 'polo-cypress-01',
    slug: 'the-heritage-cypress-micro-pique-polo',
    name: 'The Heritage Cypress Micro-Pique Polo',
    category: 'polos',
    collectionLabel: "MEN'S CORE POLOS",
    price: 48,
    originalPrice: 115,
    image: '/assets/polo_cypress_green.jpg',
    secondaryImage: '/assets/review_marcus.jpg',
    gallery: [
      '/assets/polo_cypress_green.jpg',
      '/assets/craft_collar_macro.jpg',
      '/assets/review_marcus.jpg',
      '/assets/lifestyle_coastal_18th.jpg',
    ],
    colors: [
      { name: 'Cypress Green', hex: '#2A4236', image: '/assets/polo_cypress_green.jpg' },
      { name: 'Crisp White', hex: '#FFFFFF', image: '/assets/polo_white_flatlay.jpg' },
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/polo_navy_flatlay.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Ultra-refined 4-way stretch drape engineered for 40+ golfers. Fused knit stay-flat collar, moisture-wicking micro-pique, and zero gym-shirt cling. The official High Draw ball flight tracer is subtly embroidered on the chest.',
    features: [
      'Fused interlining collar stand that will never roll or bacon in the wash',
      '180 GSM yarn-dyed micro-pique with a tailored matte drape',
      'UPF 50+ UV solar protection woven directly into the technical yarns',
      'Mother-of-pearl engraved High Draw buttons on a structured 3-button placket',
      'Guaranteed for 100+ machine wash and dry cycles',
    ],
    washGuarantee: '100+ Washes Guarantee • Won’t Shrink, Curl, or Fade',
    specs: {
      fabric: '92% Technical Poly Micro-Pique, 8% Spandex',
      weight: '180 GSM Mid-Weight Breathable Drape',
      collar: 'Proprietary Fused Interlining Stay-Flat Stand',
      fit: 'Structured shoulders with comfortable fairway drape (S–3XL)',
      protection: 'UPF 50+ Solar Block UV Protection',
    },
  },
];
