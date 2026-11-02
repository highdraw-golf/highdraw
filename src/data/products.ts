import type { LogoVariant } from '../components/brand/HighDrawLogo';

export interface LogoPlacementSpec {
  left: string;
  top: string;
  height: string;
  angle?: number;
}

export interface ProductColorway {
  name: string;
  hex: string;
  image?: string;
  unbrandedImage?: string;
  logoColor?: string;
  defaultLogoColor?: LogoVariant;
  logoPlacement?: LogoPlacementSpec;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'polos' | 'outerwear' | 'headwear' | 'bundles';
  userType?: 'mens' | 'womens' | 'unisex' | 'foursome';
  companionProductId?: string;
  collectionLabel: string;
  price: number;
  originalPrice: number;
  image: string;
  secondaryImage: string;
  gallery: string[];
  colors: ProductColorway[];
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

const MEN_POLO_CATALOG_PLACEMENT: LogoPlacementSpec = {
  left: '59.2%',
  top: '36.4%',
  height: '3.2%',
  angle: 0,
};

const WOMEN_POLO_CATALOG_PLACEMENT: LogoPlacementSpec = {
  left: '57.2%',
  top: '40.6%',
  height: '2.8%',
  angle: 0,
};

const QUARTER_ZIP_CATALOG_PLACEMENT: LogoPlacementSpec = {
  left: '55.0%',
  top: '30.0%',
  height: '3.1%',
  angle: 0,
};

const HAT_CATALOG_PLACEMENT: LogoPlacementSpec = {
  left: '57.1%',
  top: '32.9%',
  height: '6.2%',
  angle: 0,
};

export const PRODUCTS: Product[] = [
  {
    id: 'men-polo-st740',
    slug: 'mens-tour-performance-polo',
    name: "The Tour Performance Polo — Men's",
    category: 'polos',
    userType: 'mens',
    companionProductId: 'women-polo-lst740',
    collectionLabel: "MEN'S PERFORMANCE POLOS",
    price: 48,
    originalPrice: 115,
    image: '/assets/products/bespoke/men_polo_hero_wood.jpg',
    secondaryImage: '/assets/products/editorial/men_polo_navy_course.jpg',
    gallery: [
      '/assets/products/bespoke/men_polo_hero_wood.jpg',
      '/assets/products/editorial/men_polo_navy_course.jpg',
      '/assets/products/editorial/men_polo_carolina_course.jpg',
      '/assets/products/bespoke/men_polo_black_wood.jpg',
      '/assets/products/catalog/men_polo_truenavy.jpg',
    ],
    colors: [
      {
        name: 'Deep Midnight Navy',
        hex: '#1E293B',
        image: '/assets/products/bespoke/men_polo_hero_wood.jpg',
        unbrandedImage: '/assets/products/unbranded/men_polo_hero_wood.jpg',
        logoColor: 'Gold Tracer',
        defaultLogoColor: 'gold',
        logoPlacement: { left: '61.7%', top: '50.6%', height: '6.1%', angle: 32 },
      },
      {
        name: 'Carolina Blue',
        hex: '#6BA4B8',
        image: '/assets/products/catalog/men_polo_carolinablue.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_carolinablue_model_front.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Crisp White',
        hex: '#FFFFFF',
        image: '/assets/products/catalog/men_polo_white.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_white_model_front.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Onyx Black',
        hex: '#111827',
        image: '/assets/products/bespoke/men_polo_black_wood.jpg',
        unbrandedImage: '/assets/products/unbranded/men_polo_black_wood.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: { left: '57.8%', top: '28.3%', height: '6.1%', angle: 0 },
      },
      {
        name: 'Forest Green',
        hex: '#1E3A2F',
        image: '/assets/products/catalog/men_polo_forestgreen.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_forestgreen_model_front.jpg',
        logoColor: 'Gold Tracer',
        defaultLogoColor: 'gold',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Deep Red',
        hex: '#991B1B',
        image: '/assets/products/catalog/men_polo_deepred.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_deepred_model_front.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Graphite',
        hex: '#4B5563',
        image: '/assets/products/catalog/men_polo_graphite.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_graphite_model_front.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Grey Concrete',
        hex: '#9CA3AF',
        image: '/assets/products/catalog/men_polo_greyconcrete.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_greyconcrete_model_front.jpg',
        logoColor: 'Black Tracer',
        defaultLogoColor: 'black',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'True Royal',
        hex: '#1D4ED8',
        image: '/assets/products/catalog/men_polo_trueroyal.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_trueroyal_model_front.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'Feel the fabric. The exact same 180 GSM micro-pique stretch blend as $125 legacy boutique brands, engineered for pure fairway comfort, athletic drape, and moisture-wicking capillary airflow with UPF 50+ UV solar protection. Customize your left-chest embroidery across 4 official High Draw marks and 4 thread colors — or order it completely unbranded.',
    features: [
      'Customizable left-chest embroidery: choose Mark + Monogram, Mark-Only, Monogram (HD), Mark + Text, or Optional No Logo',
      'Four precision thread colorways (Cyan, Gold, Crisp White, Onyx Black) tailored to any shirt color',
      'UPF 50+ UV solar shield woven directly into technical micropique yarns',
      'Tailored flat-knit collar engineered for breathability and comfort under the sun',
      '3-button placket with tone-on-tone pearlized buttons and angled shoulder seams',
      'Guaranteed for 100+ machine wash and dry cycles without pilling or fading',
    ],
    washGuarantee: '100+ Washes Guarantee • Won’t Shrink, Curl, or Fade',
    specs: {
      fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
      weight: '180 GSM Class Matte Performance Drape',
      collar: 'Tailored Flat-Knit Self-Fabric Collar',
      fit: 'Structured shoulders with comfortable fairway drape (S–4XL)',
      protection: 'UPF 50+ Solar Block UV Protection',
    },
  },
  {
    id: 'women-polo-lst740',
    slug: 'womens-tour-performance-polo',
    name: "The Tour Performance Polo — Women's",
    category: 'polos',
    userType: 'womens',
    companionProductId: 'men-polo-st740',
    collectionLabel: "WOMEN'S PERFORMANCE POLOS",
    price: 48,
    originalPrice: 115,
    image: '/assets/products/bespoke/women_polo_hero_wood.jpg',
    secondaryImage: '/assets/products/editorial/women_polo_carolina_course.jpg',
    gallery: [
      '/assets/products/bespoke/women_polo_hero_wood.jpg',
      '/assets/products/editorial/women_polo_carolina_course.jpg',
      '/assets/products/catalog/women_polo_carolinablue.jpg',
      '/assets/products/catalog/women_polo_black.jpg',
      '/assets/products/catalog/women_polo_white.jpg',
    ],
    colors: [
      {
        name: 'Carolina Blue',
        hex: '#6BA4B8',
        image: '/assets/products/bespoke/women_polo_hero_wood.jpg',
        unbrandedImage: '/assets/products/unbranded/women_polo_hero_wood.jpg',
        logoColor: 'Black Tracer',
        defaultLogoColor: 'black',
        logoPlacement: { left: '63.1%', top: '48.2%', height: '5.5%', angle: 28 },
      },
      {
        name: 'Onyx Black',
        hex: '#111827',
        image: '/assets/products/catalog/women_polo_black.jpg',
        unbrandedImage: '/assets/products/womens-polo/LST740_black_model_front.jpg',
        logoColor: 'Gold Tracer',
        defaultLogoColor: 'gold',
        logoPlacement: WOMEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Crisp White',
        hex: '#FFFFFF',
        image: '/assets/products/catalog/women_polo_white.jpg',
        unbrandedImage: '/assets/products/womens-polo/LST740_white_model_front.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: WOMEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Deep Midnight Navy',
        hex: '#1E293B',
        image: '/assets/products/catalog/women_polo_truenavy.jpg',
        unbrandedImage: '/assets/products/womens-polo/LST740_truenavy_model_front.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: WOMEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Deep Red',
        hex: '#991B1B',
        image: '/assets/products/catalog/women_polo_deepred.jpg',
        unbrandedImage: '/assets/products/womens-polo/LST740_deepred_model_front.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: WOMEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'True Royal',
        hex: '#1D4ED8',
        image: '/assets/products/catalog/women_polo_trueroyal.jpg',
        unbrandedImage: '/assets/products/womens-polo/LST740_trueroyal_model_front.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: WOMEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Grey Concrete',
        hex: '#9CA3AF',
        image: '/assets/products/catalog/women_polo_greyconcrete.jpg',
        unbrandedImage: '/assets/products/womens-polo/LST740_greyconcrete_model_front.jpg',
        logoColor: 'Black Tracer',
        defaultLogoColor: 'black',
        logoPlacement: WOMEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'Graphite',
        hex: '#4B5563',
        image: '/assets/products/catalog/women_polo_graphite.jpg',
        unbrandedImage: '/assets/products/womens-polo/LST740_graphite_model_front.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: WOMEN_POLO_CATALOG_PLACEMENT,
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'Feel the fabric. Tour-grade micro-pique stretch blend with a contoured feminine silhouette and open self-fabric Y-neck collar. Engineered for 100+ fairway washes without losing its drape. Customize your left-chest embroidery with any of the 4 official High Draw marks and 4 thread colors — or select Optional No Logo.',
    features: [
      'Customizable left-chest embroidery: choose Mark + Monogram, Mark-Only, Monogram (HD), Mark + Text, or Optional No Logo',
      'Open self-fabric collar with elegant elongated Y-neck placket',
      'Contoured feminine silhouette with curved drop-tail hem',
      'UPF 50+ UV solar shield woven directly into the fabric',
      'Breathable 4-way mechanical stretch for full follow-through freedom',
      'Tested across 100+ machine wash and dry cycles',
    ],
    washGuarantee: '100+ Washes Guarantee • Wrinkle-Free Dry',
    specs: {
      fabric: '100% Technical Polyester Micropique (4.3 oz/yd²)',
      weight: '180 GSM Class Breathable Featherweight Knit',
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
    userType: 'mens',
    collectionLabel: 'OUTERWEAR & LAYERING',
    price: 56,
    originalPrice: 128,
    image: '/assets/products/bespoke/quarter_zip_hero_wood.jpg',
    secondaryImage: '/assets/products/editorial/quarter_zip_pullover_action.jpg',
    gallery: [
      '/assets/products/bespoke/quarter_zip_hero_wood.jpg',
      '/assets/products/editorial/quarter_zip_pullover_action.jpg',
      '/assets/products/catalog/quarter_zip_truenavywhite.jpg',
      '/assets/products/catalog/quarter_zip_blackwhite.jpg',
      '/assets/products/catalog/quarter_zip_irongreywhite.jpg',
    ],
    colors: [
      {
        name: 'True Navy / White',
        hex: '#1E293B',
        image: '/assets/products/bespoke/quarter_zip_hero_wood.jpg',
        unbrandedImage: '/assets/products/unbranded/quarter_zip_hero_wood.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: { left: '54.3%', top: '38.5%', height: '5.3%', angle: 16 },
      },
      {
        name: 'Black / White',
        hex: '#111827',
        image: '/assets/products/catalog/quarter_zip_blackwhite.jpg',
        unbrandedImage: '/assets/products/unbranded/quarter_zip_blackwhite.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: QUARTER_ZIP_CATALOG_PLACEMENT,
      },
      {
        name: 'Iron Grey / White',
        hex: '#4B5563',
        image: '/assets/products/catalog/quarter_zip_irongreywhite.jpg',
        unbrandedImage: '/assets/products/unbranded/quarter_zip_irongreywhite.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: QUARTER_ZIP_CATALOG_PLACEMENT,
      },
      {
        name: 'True Royal / White',
        hex: '#1D4ED8',
        image: '/assets/products/catalog/quarter_zip_trueroyalwhite.jpg',
        unbrandedImage: '/assets/products/unbranded/quarter_zip_trueroyalwhite.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: QUARTER_ZIP_CATALOG_PLACEMENT,
      },
      {
        name: 'Black / Deep Red',
        hex: '#7F1D1D',
        image: '/assets/products/catalog/quarter_zip_blackdeepred.jpg',
        unbrandedImage: '/assets/products/unbranded/quarter_zip_blackdeepred.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: QUARTER_ZIP_CATALOG_PLACEMENT,
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'Tour-engineered stretch 1/4-zip pullover for crisp morning rounds and cool evening play. Features 90/10 poly-spandex performance jersey, cadet collar, reverse coil zipper with chin guard, and contrast colorblocking along the sleeves and collar. Custom embroidered with your choice of High Draw logo style and thread color — or optional clean finish.',
    features: [
      'Customizable left-chest embroidery across 4 official High Draw logo styles & 4 thread colors (or No Logo)',
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
    userType: 'unisex',
    collectionLabel: 'HEADWEAR & ACCESSORIES',
    price: 35,
    originalPrice: 55,
    image: '/assets/products/bespoke/hat_hero_wood.jpg',
    secondaryImage: '/assets/products/editorial/cap_model_sunset_closeup.jpg',
    gallery: [
      '/assets/products/bespoke/hat_hero_wood.jpg',
      '/assets/products/editorial/cap_model_sunset_closeup.jpg',
      '/assets/products/catalog/hat_white.jpg',
      '/assets/products/catalog/hat_truenavy.jpg',
      '/assets/products/catalog/hat_black.jpg',
    ],
    colors: [
      {
        name: 'Pure White',
        hex: '#FFFFFF',
        image: '/assets/products/bespoke/hat_hero_wood.jpg',
        unbrandedImage: '/assets/products/unbranded/hat_hero_wood.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: { left: '52.5%', top: '46.1%', height: '8.2%', angle: 6 },
      },
      {
        name: 'Deep Midnight Navy',
        hex: '#1E293B',
        image: '/assets/products/catalog/hat_truenavy.jpg',
        unbrandedImage: '/assets/products/unbranded/hat_truenavy.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: HAT_CATALOG_PLACEMENT,
      },
      {
        name: 'Onyx Black',
        hex: '#111827',
        image: '/assets/products/catalog/hat_black.jpg',
        unbrandedImage: '/assets/products/unbranded/hat_black.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: HAT_CATALOG_PLACEMENT,
      },
      {
        name: 'Charcoal Grey Heather',
        hex: '#64748B',
        image: '/assets/products/catalog/hat_greyheather.jpg',
        unbrandedImage: '/assets/products/unbranded/hat_greyheather.jpg',
        logoColor: 'Black Tracer',
        defaultLogoColor: 'black',
        logoPlacement: HAT_CATALOG_PLACEMENT,
      },
      {
        name: 'Magnet Slate',
        hex: '#374151',
        image: '/assets/products/catalog/hat_magnet.jpg',
        unbrandedImage: '/assets/products/unbranded/hat_magnet.jpg',
        logoColor: 'Cyan Tracer',
        defaultLogoColor: 'cyan',
        logoPlacement: HAT_CATALOG_PLACEMENT,
      },
      {
        name: 'True Red',
        hex: '#991B1B',
        image: '/assets/products/catalog/hat_truered.jpg',
        unbrandedImage: '/assets/products/unbranded/hat_truered.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: HAT_CATALOG_PLACEMENT,
      },
      {
        name: 'True Royal',
        hex: '#1D4ED8',
        image: '/assets/products/catalog/hat_trueroyal.jpg',
        unbrandedImage: '/assets/products/unbranded/hat_trueroyal.jpg',
        logoColor: 'White Tracer',
        defaultLogoColor: 'white',
        logoPlacement: HAT_CATALOG_PLACEMENT,
      },
    ],
    sizes: ['S/M', 'L/XL'],
    description: 'Official Flexfit® Cool & Dry Poly Block Mesh Cap engineered for maximum airflow under intense heat. Features breathable honeycomb poly-mesh architecture, moisture-wicking internal sweatband, and silver anti-glare underbill. Customize the front crown with your choice of High Draw mark and thread color.',
    features: [
      'Customizable crown embroidery: Mark + Monogram, Mark-Only, Monogram (HD), Mark + Text, or No Logo',
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
    userType: 'foursome',
    collectionLabel: 'CURATED BUNDLES',
    price: 160,
    originalPrice: 192,
    image: '/assets/products/editorial/foursome_scramble_18th.jpg',
    secondaryImage: '/assets/products/bespoke/men_polo_hero_wood.jpg',
    gallery: [
      '/assets/products/editorial/foursome_scramble_18th.jpg',
      '/assets/products/bespoke/men_polo_hero_wood.jpg',
      '/assets/products/editorial/men_polo_navy_course.jpg',
      '/assets/products/editorial/women_polo_carolina_course.jpg',
      '/assets/products/bespoke/quarter_zip_hero_wood.jpg',
      '/assets/products/bespoke/hat_hero_wood.jpg',
    ],
    colors: [
      {
        name: 'Mixed Foursome Selection',
        hex: '#1E293B',
        image: '/assets/products/bespoke/men_polo_hero_wood.jpg',
        unbrandedImage: '/assets/products/unbranded/men_polo_hero_wood.jpg',
        defaultLogoColor: 'gold',
        logoPlacement: { left: '61.7%', top: '50.6%', height: '6.1%', angle: 32 },
      },
      {
        name: 'All Deep Midnight Navy',
        hex: '#0F172A',
        image: '/assets/products/catalog/men_polo_truenavy.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_truenavy_model_front.jpg',
        defaultLogoColor: 'gold',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'All Carolina Blue',
        hex: '#6BA4B8',
        image: '/assets/products/catalog/men_polo_carolinablue.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_carolinablue_model_front.jpg',
        defaultLogoColor: 'white',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
      {
        name: 'All Crisp White',
        hex: '#FFFFFF',
        image: '/assets/products/catalog/men_polo_white.jpg',
        unbrandedImage: '/assets/products/mens-polo/ST740_white_model_front.jpg',
        defaultLogoColor: 'cyan',
        logoPlacement: MEN_POLO_CATALOG_PLACEMENT,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    description: 'Outfit your regular weekend group in tour-grade performance polos. $40/shirt bulk bundle rate saves $32 immediately. Arrives in a luxury presentation box with any mix of Men’s and Women’s Tour Performance Polos in your preferred sizes, shirt colors, logo styles, and embroidery thread colors.',
    features: [
      'Complete foursome kit includes 4 tour-grade micropique polos with bespoke High Draw embroidery (or optional clean)',
      'Choose any combination of Men’s Cut, Women’s Cut, or Mixed Co-Ed Foursome fits',
      'Arrives in presentation gift packaging with High Draw balls and tees',
      'Save $32 instantly vs single polo pricing ($40 per shirt)',
    ],
    washGuarantee: 'Complete Foursome Guarantee • 100+ Washes per Shirt',
    specs: {
      fabric: '100% Technical Polyester Micropique Across All 4 Polos',
      weight: '4-Polo Luxury Presentation Packaging',
      collar: 'All Polos Feature Stay-Flat Fused Collar Stands',
      fit: 'Independent sizing & cut selection for each player (XS to 4XL)',
      protection: 'UPF 50+ UV Solar Shield on All Garments',
    },
  },
];
