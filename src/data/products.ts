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
  colors: Array<{ name: string; hex: string; image?: string; logoColor?: string }>;
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
    id: 'men-polo-st740',
    slug: 'mens-tour-performance-polo',
    name: "The Tour Performance Polo — Men's",
    category: 'polos',
    collectionLabel: "MEN'S PERFORMANCE POLOS",
    price: 48,
    originalPrice: 115,
    image: '/assets/products/catalog/men_polo_truenavy.jpg',
    secondaryImage: '/assets/products/catalog/men_polo_carolinablue.jpg',
    gallery: [
      '/assets/products/catalog/men_polo_truenavy.jpg',
      '/assets/products/catalog/men_polo_carolinablue.jpg',
      '/assets/products/catalog/men_polo_white.jpg',
      '/assets/products/catalog/men_polo_black.jpg',
      '/assets/products/catalog/men_polo_forestgreen.jpg',
    ],
    colors: [
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/products/catalog/men_polo_truenavy.jpg', logoColor: 'Gold Tracer' },
      { name: 'Carolina Blue', hex: '#6BA4B8', image: '/assets/products/catalog/men_polo_carolinablue.jpg', logoColor: 'White Tracer' },
      { name: 'Crisp White', hex: '#FFFFFF', image: '/assets/products/catalog/men_polo_white.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Onyx Black', hex: '#111827', image: '/assets/products/catalog/men_polo_black.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Forest Green', hex: '#1E3A2F', image: '/assets/products/catalog/men_polo_forestgreen.jpg', logoColor: 'Gold Tracer' },
      { name: 'Deep Red', hex: '#991B1B', image: '/assets/products/catalog/men_polo_deepred.jpg', logoColor: 'White Tracer' },
      { name: 'Graphite', hex: '#4B5563', image: '/assets/products/catalog/men_polo_graphite.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Grey Concrete', hex: '#9CA3AF', image: '/assets/products/catalog/men_polo_greyconcrete.jpg', logoColor: 'White Tracer' },
      { name: 'True Royal', hex: '#1D4ED8', image: '/assets/products/catalog/men_polo_trueroyal.jpg', logoColor: 'White Tracer' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'The definitive tour-grade performance golf polo. Engineered from 100% technical micropique poly with moisture-wicking capillary weave and UPF 50+ UV solar protection. Features a flat-knit fused stay-flat collar and a single high-contrast embroidered High Draw ball flight tracer on the left chest.',
    features: [
      'Single high-contrast High Draw ball flight tracer embroidered on left chest',
      'UPF 50+ UV solar shield woven directly into technical micropique yarns',
      'Flat-knit stay-flat collar with permanent fused interlining',
      '3-button placket with tone-on-tone pearlized buttons',
      'Engineered angled shoulder seams for zero swing resistance',
      'Guaranteed for 100+ machine wash and dry cycles without pilling or fading',
    ],
    washGuarantee: '100+ Washes Guarantee • Won’t Shrink, Curl, or Fade',
    specs: {
      fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
      weight: '146 GSM Breathable Featherweight Drape',
      collar: 'Proprietary Fused Interlining Stay-Flat Stand',
      fit: 'Structured shoulders with comfortable fairway drape (S–4XL)',
      protection: 'UPF 50+ Solar Block UV Protection',
    },
  },
  {
    id: 'women-polo-lst740',
    slug: 'womens-tour-performance-polo',
    name: "The Tour Performance Polo — Women's",
    category: 'polos',
    collectionLabel: "WOMEN'S PERFORMANCE POLOS",
    price: 48,
    originalPrice: 115,
    image: '/assets/products/catalog/women_polo_carolinablue.jpg',
    secondaryImage: '/assets/products/catalog/women_polo_black.jpg',
    gallery: [
      '/assets/products/catalog/women_polo_carolinablue.jpg',
      '/assets/products/catalog/women_polo_black.jpg',
      '/assets/products/catalog/women_polo_white.jpg',
      '/assets/products/catalog/women_polo_truenavy.jpg',
      '/assets/products/catalog/women_polo_deepred.jpg',
    ],
    colors: [
      { name: 'Carolina Blue', hex: '#6BA4B8', image: '/assets/products/catalog/women_polo_carolinablue.jpg', logoColor: 'Black Tracer' },
      { name: 'Onyx Black', hex: '#111827', image: '/assets/products/catalog/women_polo_black.jpg', logoColor: 'Gold Tracer' },
      { name: 'Crisp White', hex: '#FFFFFF', image: '/assets/products/catalog/women_polo_white.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/products/catalog/women_polo_truenavy.jpg', logoColor: 'White Tracer' },
      { name: 'Deep Red', hex: '#991B1B', image: '/assets/products/catalog/women_polo_deepred.jpg', logoColor: 'White Tracer' },
      { name: 'True Royal', hex: '#1D4ED8', image: '/assets/products/catalog/women_polo_trueroyal.jpg', logoColor: 'White Tracer' },
      { name: 'Grey Concrete', hex: '#9CA3AF', image: '/assets/products/catalog/women_polo_greyconcrete.jpg', logoColor: 'White Tracer' },
      { name: 'Graphite', hex: '#4B5563', image: '/assets/products/catalog/women_polo_graphite.jpg', logoColor: 'Cyan Tracer' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'Boutique women’s performance golf polo with a contoured feminine silhouette and open self-fabric Y-neck collar. Crafted from 100% technical poly micropique with moisture-wicking performance and UPF 50+ sun protection. Finished with a single embroidered High Draw ball flight tracer on the left chest.',
    features: [
      'Single high-contrast High Draw ball flight tracer embroidered on left chest',
      'Open self-fabric collar with elegant elongated Y-neck placket',
      'Contoured feminine silhouette with curved drop-tail hem',
      'UPF 50+ UV solar shield woven directly into the fabric',
      'Breathable 4-way mechanical stretch for full follow-through freedom',
      'Tested across 100+ machine wash and dry cycles',
    ],
    washGuarantee: '100+ Washes Guarantee • Wrinkle-Free Dry',
    specs: {
      fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
      weight: '146 GSM Breathable Featherweight Knit',
      collar: 'Self-Fabric Open Y-Neck Placket',
      fit: 'Feminine contoured fit with slight waist shaping (XS–4XL)',
      protection: 'UPF 50+ Solar Block UV Protection',
    },
  },
  {
    id: 'outerwear-st443',
    slug: 'mens-tour-tech-quarter-zip',
    name: "The Tour Tech Quarter-Zip Pullover — Men's",
    category: 'outerwear',
    collectionLabel: 'OUTERWEAR & LAYERING',
    price: 56,
    originalPrice: 128,
    image: '/assets/products/catalog/quarter_zip_truenavywhite.jpg',
    secondaryImage: '/assets/products/catalog/quarter_zip_blackwhite.jpg',
    gallery: [
      '/assets/products/catalog/quarter_zip_truenavywhite.jpg',
      '/assets/products/catalog/quarter_zip_blackwhite.jpg',
      '/assets/products/catalog/quarter_zip_irongreywhite.jpg',
      '/assets/products/catalog/quarter_zip_trueroyalwhite.jpg',
      '/assets/products/catalog/quarter_zip_blackdeepred.jpg',
    ],
    colors: [
      { name: 'True Navy / White', hex: '#1E293B', image: '/assets/products/catalog/quarter_zip_truenavywhite.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Black / White', hex: '#111827', image: '/assets/products/catalog/quarter_zip_blackwhite.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Iron Grey / White', hex: '#4B5563', image: '/assets/products/catalog/quarter_zip_irongreywhite.jpg', logoColor: 'Cyan Tracer' },
      { name: 'True Royal / White', hex: '#1D4ED8', image: '/assets/products/catalog/quarter_zip_trueroyalwhite.jpg', logoColor: 'White Tracer' },
      { name: 'Black / Deep Red', hex: '#7F1D1D', image: '/assets/products/catalog/quarter_zip_blackdeepred.jpg', logoColor: 'White Tracer' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'Tour-engineered stretch 1/4-zip pullover for crisp morning rounds and cool evening play. Features 90/10 poly-spandex performance jersey, cadet collar, reverse coil zipper with chin guard, and contrast colorblocking along the sleeves and collar. Finished with a single embroidered High Draw ball flight tracer on the left chest.',
    features: [
      'Single high-contrast High Draw tracer logo embroidered on left chest',
      '90/10 poly/spandex technical jersey with 4-way active swing stretch',
      'Cadet stand collar with soft lockdown zipper garage to eliminate chin friction',
      'Sport-wick moisture management technology keeps you warm without sweat buildup',
      'Colorblock contrast sleeve and collar panels for athletic styling',
    ],
    washGuarantee: 'Cold Wash Tested • Retains Shape & Loft',
    specs: {
      fabric: '90% Poly, 10% Spandex Sport-Wick Jersey (6.8 oz/yd²)',
      weight: '230 GSM Mid-Weight Layering Fabric',
      collar: 'Cadet Stand Collar with Contrast Inner Facing',
      fit: 'Athletic layering drape tailored to wear over High Draw polos (XS–4XL)',
      protection: 'Wind-Resistant Thermal Stretch Barrier',
    },
  },
  {
    id: 'headwear-flexfit-mesh',
    slug: 'tour-performance-poly-mesh-cap',
    name: 'The Tour Performance Poly-Mesh Cap',
    category: 'headwear',
    collectionLabel: 'HEADWEAR & ACCESSORIES',
    price: 35,
    originalPrice: 55,
    image: '/assets/products/catalog/hat_white.jpg',
    secondaryImage: '/assets/products/catalog/hat_truenavy.jpg',
    gallery: [
      '/assets/products/catalog/hat_white.jpg',
      '/assets/products/catalog/hat_truenavy.jpg',
      '/assets/products/catalog/hat_black.jpg',
      '/assets/products/catalog/hat_greyheather.jpg',
      '/assets/products/catalog/hat_magnet.jpg',
    ],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF', image: '/assets/products/catalog/hat_white.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Deep Midnight Navy', hex: '#1E293B', image: '/assets/products/catalog/hat_truenavy.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Onyx Black', hex: '#111827', image: '/assets/products/catalog/hat_black.jpg', logoColor: 'Cyan Tracer' },
      { name: 'Charcoal Grey Heather', hex: '#64748B', image: '/assets/products/catalog/hat_greyheather.jpg', logoColor: 'White Tracer' },
      { name: 'Magnet Slate', hex: '#374151', image: '/assets/products/catalog/hat_magnet.jpg', logoColor: 'Cyan Tracer' },
      { name: 'True Red', hex: '#991B1B', image: '/assets/products/catalog/hat_truered.jpg', logoColor: 'Cyan Tracer' },
      { name: 'True Royal', hex: '#1D4ED8', image: '/assets/products/catalog/hat_trueroyal.jpg', logoColor: 'Cyan Tracer' },
    ],
    sizes: ['S/M', 'L/XL'],
    description: 'Official Flexfit® Cool & Dry Poly Block Mesh Cap engineered for maximum airflow under intense heat. Features breathable honeycomb poly-mesh architecture, moisture-wicking internal sweatband, and silver anti-glare underbill. Finished with a single embroidered High Draw ball flight tracer on the front crown.',
    features: [
      'Single high-contrast High Draw tracer flag embroidered on front crown',
      'Authentic Flexfit® stretch-to-fit elastic sweatband for all-day comfort',
      'Cool & Dry poly-block honeycomb mesh keeps scalp ventilated on the back nine',
      'Structured 6-panel mid-profile silhouette with permacurv visor',
      'Silver anti-glare underbill deflects sunlight off the green',
    ],
    washGuarantee: 'Sweat-Stain Resistant • Hand Wash Rinse',
    specs: {
      fabric: '100% Polyester Cool & Dry Poly Block Mesh',
      weight: 'Structured 6-Panel Mid-Profile Crown',
      collar: 'N/A',
      fit: 'Flexfit Elastic Sizing: S/M (6 3/4 - 7 1/4) & L/XL (7 1/8 - 7 5/8)',
      protection: 'Silver Anti-Glare Underbill with UPF 50+ Visor',
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
    image: '/assets/products/catalog/men_polo_truenavy.jpg',
    secondaryImage: '/assets/products/catalog/women_polo_carolinablue.jpg',
    gallery: [
      '/assets/products/catalog/men_polo_truenavy.jpg',
      '/assets/products/catalog/women_polo_carolinablue.jpg',
      '/assets/products/catalog/men_polo_white.jpg',
      '/assets/products/catalog/women_polo_black.jpg',
    ],
    colors: [
      { name: 'Mixed Foursome Selection', hex: '#1E293B', image: '/assets/products/catalog/men_polo_truenavy.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Outfit your regular weekend group in tour-grade performance polos. $40/shirt bulk bundle rate saves $32 immediately. Arrives in a luxury presentation box with any mix of Men’s and Women’s Tour Performance Polos in your preferred sizes and colors.',
    features: [
      'Complete foursome kit includes 4 tour-grade micropique polos with High Draw tracer embroidery',
      'Arrives in presentation gift packaging with High Draw balls and tees',
      'Save $32 instantly vs single polo pricing ($40 per shirt)',
      'Mix and match sizing and colors for all four players in your regular group',
    ],
    washGuarantee: 'Complete Foursome Guarantee • 100+ Washes per Shirt',
    specs: {
      fabric: '100% Technical Polyester Micropique Across All 4 Polos',
      weight: '4-Polo Luxury Presentation Packaging',
      collar: 'All Polos Feature Stay-Flat Fused Collar Stands',
      fit: 'Independent sizing selection for each player (XS to 4XL)',
      protection: 'UPF 50+ UV Solar Shield on All Garments',
    },
  },
];
