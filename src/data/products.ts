import type { LogoStyle, LogoVariant } from '../components/brand/HighDrawLogo';

export interface LogoPlacementSpec {
  left: string;
  top: string;
  height: string;
  angle?: number;
}

export interface ColorwayAngleShot {
  id: 'custom_chest' | 'factory_mockup' | 'model_front' | 'model_back' | 'form_front' | 'form_back' | 'macro_detail' | 'collar_detail' | 'course_drape' | 'weave_macro' | 'action_layer';
  label: string;
  src: string;
  supportsOverlay?: boolean;
  placementOverride?: LogoPlacementSpec;
}

export interface ProductColorway {
  name: string;
  hex: string;
  image?: string;
  unbrandedImage?: string;
  logoColor?: string;
  defaultLogoColor?: LogoVariant;
  logoPlacement?: LogoPlacementSpec;
  angles?: ColorwayAngleShot[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tier?: 'weekender' | 'clubhouse' | 'tournament' | 'core';
  isComingSoon?: boolean;
  badge?: string;
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

/**
 * Dynamically resolves all studio angles (Front, Back, Form, Macro Weave)
 * for any Product + Colorway using the local asset vault — zero manual photo editing required.
 */
export function getColorwayAngles(
  product: Product,
  color: ProductColorway,
  selectedLogoStyle: LogoStyle = 'mark_monogram'
): ColorwayAngleShot[] {
  if (color.angles && color.angles.length > 0) return color.angles;

  const basePlacement = color.logoPlacement || MEN_POLO_CATALOG_PLACEMENT;
  const primarySrc = color.unbrandedImage || color.image || product.image;

  const logoMockupSlug =
    selectedLogoStyle === 'mark_only'
      ? 'mark-only'
      : selectedLogoStyle === 'mark_text'
      ? 'mark-wordmark'
      : 'mark-monogram';

  const colorSlugMap: Record<string, string> = {
    'Deep Midnight Navy': 'true-navy',
    'Carolina Blue': 'carolina-blue',
    'Crisp White': 'white',
    'Pure White': 'white',
    'Onyx Black': 'black',
    'Black': 'black',
    'Forest Green': 'forest-green',
    'Deep Red': 'deep-red',
    'True Red': 'true-red',
    'Graphite': 'graphite',
    'Grey Concrete': 'grey-concrete',
    'True Royal': 'true-royal',
    'True Navy': 'true-navy',
    'Iron Grey': 'iron-grey',
    'Charcoal Grey Heather': 'grey-heather',
    'Magnet Slate': 'magnet',
    'Aegean Blue Heather': 'aegean-blue-heather',
    'Black Heather': 'black-heather',
    'Charcoal Heather': 'charcoal-heather',
    'Dark Teal Heather': 'dark-teal-heather',
    'River Blue Navy Heather': 'river-blue-navy-heather',
  };
  const mockupColorSlug = colorSlugMap[color.name] || 'true-navy';

  // Clubhouse Men's Fine Pique (K830)
  if (product.id === 'men-polo-k830') {
    return [
      {
        id: 'factory_mockup',
        label: `Stitched Studio View (${logoMockupSlug.replace('mark-', '').toUpperCase()})`,
        src: `/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-${logoMockupSlug}--${mockupColorSlug}.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'collar_detail',
        label: 'Fine Pique Collar & Placket',
        src: '/assets/craft_collar_macro.jpg',
        supportsOverlay: false,
      },
      {
        id: 'course_drape',
        label: 'Clubhouse Evening Drape',
        src: '/assets/products/editorial/men_polo_navy_course.jpg',
        supportsOverlay: false,
      },
      {
        id: 'weave_macro',
        label: '57/43 Cotton-Poly Fine Pique',
        src: '/assets/polo_navy_macro.png',
        supportsOverlay: false,
      },
    ];
  }

  // Clubhouse Women's Fine Pique (LK830)
  if (product.id === 'women-polo-lk830') {
    return [
      {
        id: 'factory_mockup',
        label: `Stitched Studio View (${logoMockupSlug.replace('mark-', '').toUpperCase()})`,
        src: `/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-${logoMockupSlug}--${mockupColorSlug}.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'course_drape',
        label: 'Tailored Open Y-Neck Drape',
        src: '/assets/products/editorial/women_polo_carolina_course.jpg',
        supportsOverlay: false,
      },
      {
        id: 'weave_macro',
        label: '57/43 Cotton-Poly Fine Pique',
        src: '/assets/polo_navy_macro.png',
        supportsOverlay: false,
      },
    ];
  }

  // Clubhouse Value Fleece 1/4-Zip (F218)
  if (product.id === 'outerwear-f218-fleece') {
    return [
      {
        id: 'factory_mockup',
        label: `Embroidered Fleece (${logoMockupSlug.replace('mark-', '').toUpperCase()})`,
        src: `/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-${logoMockupSlug}--${mockupColorSlug}.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'action_layer',
        label: 'Twilight Layering Fit',
        src: '/assets/products/editorial/quarter_zip_pullover_action.jpg',
        supportsOverlay: false,
      },
      {
        id: 'collar_detail',
        label: 'Cadet Collar & Coil Zip',
        src: '/assets/products/bespoke/quarter_zip_hero_wood.jpg',
        supportsOverlay: false,
      },
    ];
  }

  // Map human color names to factory file slugs
  const slugMap: Record<string, string> = {
    'Deep Midnight Navy': 'truenavy',
    'Carolina Blue': 'carolinablue',
    'Crisp White': 'white',
    'Pure White': 'white',
    'Onyx Black': 'black',
    'Forest Green': 'forestgreen',
    'Deep Red': 'deepred',
    'True Red': 'truered',
    'Graphite': 'graphite',
    'Grey Concrete': 'greyconcrete',
    'True Royal': 'trueroyal',
    'Charcoal Grey Heather': 'greyheather',
    'Magnet Slate': 'magnet',
    'True Navy / White': 'truenavywhite',
    'Black / White': 'blackwhite',
    'Iron Grey / White': 'irongreywhite',
    'True Royal / White': 'trueroyalwhite',
    'Black / Deep Red': 'blackdeepred',
  };

  const slug = slugMap[color.name] || 'truenavy';

  if (product.id === 'women-polo-lst740') {
    const shots: ColorwayAngleShot[] = [
      {
        id: 'factory_mockup',
        label: `Stitched Studio View (${logoMockupSlug.replace('mark-', '').toUpperCase()})`,
        src: `/assets/products/printify_mockups/high-draw-weekender-women-s-polo-${logoMockupSlug}--${mockupColorSlug}.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'model_back',
        label: 'Rear Drape & Drop-Tail',
        src: `/assets/products/womens-polo/LST740_${slug}_model_back.jpg`,
        supportsOverlay: false,
      },
    ];
    if (slug !== 'white') {
      shots.push({
        id: 'form_front',
        label: 'Tailored Form Silhouette',
        src: `/assets/products/womens-polo/LST740_${slug}_form_front.jpg`,
        supportsOverlay: false,
      });
    }
    shots.push({
      id: 'macro_detail',
      label: '180 GSM Micro-Pique Weave',
      src: '/assets/polo_navy_macro.png',
      supportsOverlay: false,
    });
    return shots;
  }

  if (product.id === 'outerwear-st443') {
    return [
      {
        id: 'custom_chest',
        label: 'Custom Embroidery View',
        src: primarySrc,
        supportsOverlay: true,
        placementOverride: basePlacement,
      },
      {
        id: 'model_front',
        label: 'On-Course Model Fit',
        src: `/assets/products/quarter-zip/ST443_${slug}_model_front.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'model_back',
        label: 'Rear Raglan Shoulder View',
        src: `/assets/products/quarter-zip/ST443_${slug}_model_back.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'form_back',
        label: 'Rear Cadet Collar Stand',
        src: `/assets/products/quarter-zip/ST443_${slug}_form_back.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'macro_detail',
        label: 'Action Layering View',
        src: '/assets/products/editorial/quarter_zip_pullover_action.jpg',
        supportsOverlay: false,
      },
    ];
  }

  if (product.id === 'headwear-flexfit-mesh') {
    return [
      {
        id: 'custom_chest',
        label: 'Custom Crown Embroidery',
        src: primarySrc,
        supportsOverlay: true,
        placementOverride: basePlacement,
      },
      {
        id: 'form_front',
        label: 'Centered Profile View',
        src: `/assets/products/processed/hat_${slug}_centered.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'model_back',
        label: 'Rear Honeycomb Mesh View',
        src: `/assets/products/performance-hat/back-${slug}_hat.jpg`,
        supportsOverlay: false,
      },
      {
        id: 'macro_detail',
        label: 'Sunset Course Detail',
        src: '/assets/products/editorial/cap_model_sunset_closeup.jpg',
        supportsOverlay: false,
      },
    ];
  }

  if (product.id === 'tournament-tour-spec-polo') {
    return [
      {
        id: 'course_drape',
        label: 'Tour Prototype Testing',
        src: '/assets/founder/ken_overcast_apex_swing.jpg',
        supportsOverlay: false,
      },
      {
        id: 'collar_detail',
        label: 'Stay-Flat Collar Architecture',
        src: '/assets/craft_collar_macro.jpg',
        supportsOverlay: false,
      },
      {
        id: 'weave_macro',
        label: 'High-Tensile Micro-Knit',
        src: '/assets/polo_navy_macro.png',
        supportsOverlay: false,
      },
    ];
  }

  // Default: Men's Weekender Performance Polo (ST740) & Foursome Kit
  const menShots: ColorwayAngleShot[] = [
    {
      id: 'factory_mockup',
      label: `Stitched Studio View (${logoMockupSlug.replace('mark-', '').toUpperCase()})`,
      src: `/assets/products/printify_mockups/high-draw-weekender-men-s-polo-${logoMockupSlug}--${mockupColorSlug}.jpg`,
      supportsOverlay: false,
    },
  ];

  if (primarySrc.includes('wood')) {
    menShots.push({
      id: 'custom_chest',
      label: 'Bespoke Table Flatlay',
      src: primarySrc,
      supportsOverlay: true,
      placementOverride: basePlacement,
    });
  }

  menShots.push(
    {
      id: 'form_front',
      label: 'Stay-Flat Collar & Placket',
      src: '/assets/craft_collar_macro.jpg',
      supportsOverlay: false,
    },
    {
      id: 'model_back',
      label: 'On-Course Fairway Drape',
      src:
        slug === 'carolinablue'
          ? '/assets/products/editorial/men_polo_carolina_course.jpg'
          : '/assets/products/editorial/men_polo_navy_course.jpg',
      supportsOverlay: false,
    },
    {
      id: 'macro_detail',
      label: '180 GSM Micro-Pique Weave',
      src: '/assets/polo_navy_macro.png',
      supportsOverlay: false,
    }
  );

  return menShots;
}

export const PRODUCTS: Product[] = [
  {
    id: 'men-polo-st740',
    slug: 'mens-weekender-performance-polo',
    name: "The Weekender Performance Polo — Men's",
    tier: 'weekender',
    badge: 'WEEKENDER COLLECTION',
    category: 'polos',
    userType: 'mens',
    companionProductId: 'women-polo-lst740',
    collectionLabel: "MEN'S WEEKENDER POLOS",
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
    description: 'Feel the fabric. The exact same 180 GSM micro-pique stretch blend as $125 legacy boutique brands, engineered for pure fairway comfort, athletic drape, and moisture-wicking capillary airflow with UPF 50+ UV solar protection. Stitched to order in the USA with your choice of 3 official High Draw chest marks.',
    features: [
      'Customizable 2.5" left-chest embroidery: choose Mark + Monogram (H | D), Mark-Only (Ball Flight Tracer), or Mark + Wordmark (HIGH DRAW)',
      'Tailor-matched contrast thread: Light Blue tracer thread on Crisp White garments and Crisp White thread on dark & rich colorways',
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
    slug: 'womens-weekender-performance-polo',
    name: "The Weekender Performance Polo — Women's",
    tier: 'weekender',
    badge: 'WEEKENDER COLLECTION',
    category: 'polos',
    userType: 'womens',
    companionProductId: 'men-polo-st740',
    collectionLabel: "WOMEN'S WEEKENDER POLOS",
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
    description: 'Feel the fabric. Tour-grade micro-pique stretch blend with a contoured feminine silhouette and open self-fabric Y-neck collar. Engineered for 100+ fairway washes without losing its drape. Crafted to order with your choice of 3 official High Draw chest marks calibrated to 2.25" tall and lower-aligned for a flattering fit.',
    features: [
      'Customizable 2.25" lower-aligned chest mark: choose Mark + Monogram (H | D), Mark-Only (Ball Flight Tracer), or Mark + Wordmark (HIGH DRAW)',
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
    description: 'Official Flexfit® Cool & Dry Poly Block Mesh Cap engineered for maximum airflow under intense heat. Features breathable honeycomb poly-mesh architecture, moisture-wicking internal sweatband, silver anti-glare underbill, and structured High Draw crown embroidery.',
    features: [
      'Structured front crown embroidery featuring the official High Draw mark',
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
  {
    id: 'men-polo-k830',
    slug: 'mens-clubhouse-fine-pique-polo',
    name: "The Clubhouse Fine Pique Polo — Men's",
    tier: 'clubhouse',
    badge: 'THE CLUBHOUSE',
    category: 'polos',
    userType: 'mens',
    companionProductId: 'women-polo-lk830',
    collectionLabel: "MEN'S CLUBHOUSE POLOS",
    price: 66,
    originalPrice: 125,
    image: '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--aegean-blue-heather.jpg',
    secondaryImage: '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-only--river-blue-navy-heather.jpg',
    gallery: [
      '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--aegean-blue-heather.jpg',
      '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-only--river-blue-navy-heather.jpg',
      '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-wordmark--charcoal-heather.jpg',
    ],
    colors: [
      {
        name: 'Aegean Blue Heather',
        hex: '#4A6B82',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--aegean-blue-heather.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'Black Heather',
        hex: '#2B2B2B',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--black-heather.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'Charcoal Heather',
        hex: '#4A4A4A',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--charcoal-heather.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'Dark Teal Heather',
        hex: '#1F4E5B',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--dark-teal-heather.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'River Blue Navy Heather',
        hex: '#22384D',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-men-s-polo-mark-monogram--river-blue-navy-heather.jpg',
        defaultLogoColor: 'white',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'Designed specifically for the post-round 19th hole and dinner at the clubhouse. Crafted from Port Authority’s luxury 57/43 cotton-poly fine pique blend (K830), delivering rich heather tones and a structured tailored drape that moves seamlessly from the final green into the evening dining room without the synthetic sheen of gym apparel.',
    features: [
      'Fine 57% cotton, 43% polyester pique knit delivers supreme natural comfort and breathability',
      '4.3-ounce midweight luxury fabric tailored for clubhouse dining and relaxed evenings',
      'Left chest bespoke High Draw embroidery calibrated to 2.5" tall in crisp white thread',
      'Flat knit collar and 3-button placket with dyed-to-match buttons',
    ],
    washGuarantee: 'Color-Lock Guaranteed • 100+ Washes without fading',
    specs: {
      fabric: '57% Combed Cotton / 43% Technical Polyester Fine Pique Knit',
      weight: '4.3 oz / sq yard Luxury Midweight Hand',
      collar: 'Tailored Flat Knit Collar with Self-Fabric Placket',
      fit: 'Relaxed Modern Tailored Fit for Evening Comfort',
      protection: 'Natural Breathable Cotton-Poly Blend',
    },
  },
  {
    id: 'women-polo-lk830',
    slug: 'womens-clubhouse-fine-pique-polo',
    name: "The Clubhouse Fine Pique Polo — Women's",
    tier: 'clubhouse',
    badge: 'THE CLUBHOUSE',
    category: 'polos',
    userType: 'womens',
    companionProductId: 'men-polo-k830',
    collectionLabel: "WOMEN'S CLUBHOUSE POLOS",
    price: 66,
    originalPrice: 125,
    image: '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-monogram--aegean-blue-heather.jpg',
    secondaryImage: '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-only--charcoal-heather.jpg',
    gallery: [
      '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-monogram--aegean-blue-heather.jpg',
      '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-only--charcoal-heather.jpg',
      '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-wordmark--black-heather.jpg',
    ],
    colors: [
      {
        name: 'Aegean Blue Heather',
        hex: '#4A6B82',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-monogram--aegean-blue-heather.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'Black Heather',
        hex: '#2B2B2B',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-monogram--black-heather.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'Charcoal Heather',
        hex: '#4A4A4A',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-women-s-polo-mark-monogram--charcoal-heather.jpg',
        defaultLogoColor: 'white',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    description: 'A feminine, tailored fine pique polo engineered for evening drinks and dinner at the clubhouse. Built on the Port Authority LK830 with a 57/43 cotton-poly blend, open Y-neck placket, and lower chest placement for an elegant silhouette.',
    features: [
      '57% cotton, 43% polyester fine pique knit with an ultra-soft hand feel',
      'Flattering open Y-neckline and contoured silhouette',
      'Left chest bespoke High Draw white embroidery bottom-aligned at 2.25" tall',
      'Naturally breathable, low-wrinkle luxury blend',
    ],
    washGuarantee: 'Color-Lock Guaranteed • 100+ Washes without fading',
    specs: {
      fabric: '57% Cotton / 43% Polyester Fine Pique',
      weight: '4.3 oz / sq yard Luxury Hand',
      collar: 'Contoured Y-Neck Feminine Collar',
      fit: 'Flattering Contoured Cut tailored for dinner and socializing',
      protection: 'Soft Cotton-Poly Blend Breathability',
    },
  },
  {
    id: 'outerwear-f218-fleece',
    slug: 'clubhouse-value-fleece-quarter-zip',
    name: 'The Clubhouse Value Fleece 1/4-Zip Pullover',
    tier: 'clubhouse',
    badge: 'THE CLUBHOUSE',
    category: 'outerwear',
    userType: 'unisex',
    collectionLabel: 'CLUBHOUSE LAYERING',
    price: 68,
    originalPrice: 135,
    image: '/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-monogram--true-navy.jpg',
    secondaryImage: '/assets/products/editorial/quarter_zip_pullover_action.jpg',
    gallery: [
      '/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-monogram--true-navy.jpg',
      '/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-only--iron-grey.jpg',
      '/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-wordmark--black.jpg',
    ],
    colors: [
      {
        name: 'True Navy',
        hex: '#1E293B',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-monogram--true-navy.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'Iron Grey',
        hex: '#4B5563',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-monogram--iron-grey.jpg',
        defaultLogoColor: 'white',
      },
      {
        name: 'Black',
        hex: '#111827',
        image: '/assets/products/printify_mockups/high-draw-clubhouse-fleece-quarter-zip-mark-monogram--black.jpg',
        defaultLogoColor: 'white',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    description: 'Year-round warmth and coziness for twilight putting contests and clubhouse patio fire pits. Port Authority F218 midweight fleece with twill-taped neck, reverse coil zipper, and open cuffs.',
    features: [
      '8.3-ounce, 100% low-pill polyester midweight fleece',
      'Twill-taped neck and reverse coil zipper with chin guard',
      'Open cuffs and hem for easy layering over polos',
      'Direct High Draw embroidery on left chest',
    ],
    washGuarantee: 'Low-Pill Fleece Guarantee • 100+ Washes',
    specs: {
      fabric: '100% Low-Pill Midweight Polyester Fleece',
      weight: '8.3 oz Heavy Cozy Thermal Hand',
      collar: 'Cadet Collar with Reverse Coil Zipper',
      fit: 'Comfort Layering Fit over polos and sweaters',
      protection: 'Thermal Wind & Chill Resistance',
    },
  },
  {
    id: 'tournament-tour-spec-polo',
    slug: 'tournament-tour-spec-polo',
    name: 'The Tournament Tour-Spec Performance Polo',
    tier: 'tournament',
    isComingSoon: true,
    badge: 'TOURNAMENT EDITION · COMING SOON',
    category: 'polos',
    userType: 'mens',
    collectionLabel: 'TOURNAMENT ALLOCATION',
    price: 110,
    originalPrice: 195,
    image: '/assets/founder/ken_overcast_apex_swing.jpg',
    secondaryImage: '/assets/products/bespoke/men_polo_hero_wood.jpg',
    gallery: [
      '/assets/founder/ken_overcast_apex_swing.jpg',
      '/assets/products/bespoke/men_polo_hero_wood.jpg',
    ],
    colors: [
      {
        name: 'Tour Midnight',
        hex: '#0A1128',
        image: '/assets/products/bespoke/men_polo_hero_wood.jpg',
        defaultLogoColor: 'gold',
      },
      {
        name: 'Tour Ice White',
        hex: '#FFFFFF',
        image: '/assets/products/catalog/men_polo_white.jpg',
        defaultLogoColor: 'cyan',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description: 'In development with tour professionals. Engineered with an ultra-high thread count micro-knit, bonded seamless hems, and extreme 4-way mechanical stretch built to withstand championship pressure.',
    features: [
      'Tour-Spec proprietary micro-knit composite',
      'Zero-drag bonded seams and active collar chassis',
      'Currently in final prototype testing with PGA Tour & mini-tour ball strikers',
      'Private allocation drop coming Summer 2026',
    ],
    washGuarantee: 'Tour Grade Standard • Lifetime Quality Assurance',
    specs: {
      fabric: 'Tour-Spec Proprietary High-Tensile Micro-Knit',
      weight: '3.4 oz Featherlight Competition Chassis',
      collar: 'Laser-Cut Bonded Stay-Flat Collar Stand',
      fit: 'Athletic Competition Tour Tailored Fit',
      protection: 'UPF 50+ Solar Block & Rapid Evaporation',
    },
  },
];
