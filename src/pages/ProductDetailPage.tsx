import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { getColorwayAngles, type Product } from '../data/products';
import { SizeSelector } from '../components/ui/SizeSelector';
import { ColorSwatch } from '../components/ui/ColorSwatch';
import { LogoCustomizer } from '../components/ui/LogoCustomizer';
import {
  getLogoAssetPath,
  formatCustomizationSummary,
  CHEST_LOGO_STYLE_OPTIONS,
  LOGO_COLOR_OPTIONS,
} from '../components/brand/HighDrawLogo';
import type { LogoStyle, LogoVariant } from '../components/brand/HighDrawLogo';
import { Accordion } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { resolvePrintifyFulfillment, getFactoryThreadColor } from '../lib/fulfillmentResolver';
import { DURATION, EASE_ACCENT } from '../lib/motion/tokens';
import { useMotionPreference } from '../components/motion/MotionProvider';
import {
  Star,
  ShieldCheck,
  RefreshCw,
  Truck,
  ArrowLeft,
  Check,
  ShoppingBag,
  Sparkles,
  Tag,
  ZoomIn,
  Bell,
  Share2,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBackToShop: () => void;
  onAddToCart: (item: {
    id: string;
    name: string;
    price: number;
    color: string;
    size: string;
    image: string;
    logoStyle?: LogoStyle;
    logoColor?: LogoVariant;
    userTypeLabel?: string;
    sovereignSku?: string;
    printifyProductId?: string;
    printifyVariantId?: number;
  }) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBackToShop,
  onAddToCart,
  onSelectProduct,
  allProducts,
}) => {
  const { isReduced } = useMotionPreference();
  const initialColorObj = product.colors[0];
  const [selectedColor, setSelectedColor] = useState(initialColorObj?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] || product.sizes?.[0] || 'L');
  const [activeAngleIdx, setActiveAngleIdx] = useState<number>(0);
  const [selectedLogoStyle, setSelectedLogoStyle] = useState<LogoStyle>('mark_monogram');

  const initialThread = getFactoryThreadColor(product.id as any, initialColorObj?.name || '').variant;
  const [selectedLogoColor, setSelectedLogoColor] = useState<LogoVariant>(initialThread);

  const [stitchPulseKey, setStitchPulseKey] = useState<number>(0);
  const [isHoverZooming, setIsHoverZooming] = useState<boolean>(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [userCutPreference, setUserCutPreference] = useState<string>(
    product.userType === 'womens'
      ? 'womens'
      : product.userType === 'foursome'
      ? '4-mens'
      : 'mens'
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  const handleShareProduct = async () => {
    const canonicalShareUrl = `https://www.highdrawgear.com/products/${product.slug}`;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${product.name} | High Draw Golf`,
          text: `${product.name} ($${product.price}) — ${product.washGuarantee}`,
          url: canonicalShareUrl,
        });
        return;
      } catch {
        // User cancelled or native share unsupported; fall back to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(canonicalShareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const activeColorObj =
    product.colors.find(c => c.name === selectedColor) || product.colors[0];

  const colorwayAngles = getColorwayAngles(product, activeColorObj, selectedLogoStyle);
  const activeAngle = colorwayAngles[activeAngleIdx] || colorwayAngles[0];

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    setActiveAngleIdx(0);
    setStitchPulseKey(k => k + 1);
    const matched = getFactoryThreadColor(product.id as any, colorName);
    setSelectedLogoColor(matched.variant);
  };

  // User Type / Cut Options per product tier & category
  const getUserTypeOptions = () => {
    if (product.isComingSoon) return undefined;
    if (product.category === 'polos') {
      if (product.tier === 'clubhouse') {
        return [
          { id: 'mens', label: "Men's Clubhouse Cut (K830)", sublabel: '57/43 Fine Pique • XS–4XL' },
          { id: 'womens', label: "Women's Clubhouse Cut (LK830)", sublabel: 'Contoured Y-Neck • XS–4XL' },
        ];
      }
      return [
        { id: 'mens', label: "Men's Weekender Fit (ST740)", sublabel: 'Structured Comfort Drape • S–4XL' },
        { id: 'womens', label: "Women's Weekender Fit (LST740)", sublabel: 'Tailored Open Y-Neck • XS–4XL' },
      ];
    }
    if (product.category === 'bundles') {
      return [
        { id: '4-mens', label: "4 Men's Weekender Polos", sublabel: 'Standard Foursome' },
        { id: '2m-2w', label: "2 Men's + 2 Women's", sublabel: 'Co-Ed Couples Scramble' },
        { id: '3m-1w', label: "3 Men's + 1 Women's", sublabel: 'Mixed Foursome' },
        { id: '4-womens', label: "4 Women's Weekender Polos", sublabel: "Ladies' Scramble Kit" },
      ];
    }
    if (product.category === 'outerwear') {
      return [
        { id: 'mens', label: "Men's Comfort Layering", sublabel: 'Standard Fit • XS–6XL' },
        { id: 'womens-layer', label: "Women's Relaxed Layer", sublabel: 'Size Down 1 Size for Tailored Fit' },
      ];
    }
    return undefined;
  };

  const handleUserTypeSwitch = (nextType: string) => {
    setUserCutPreference(nextType);
    if (product.category === 'polos' && product.companionProductId) {
      const wantsWomens = nextType === 'womens';
      const isCurrentlyWomens = product.userType === 'womens';
      if (wantsWomens !== isCurrentlyWomens) {
        const companion = allProducts.find(p => p.id === product.companionProductId);
        if (companion) {
          onSelectProduct(companion);
          return;
        }
      }
    }
  };

  const resolvedFulfillment = resolvePrintifyFulfillment({
    id: product.id,
    color: selectedColor,
    size: selectedSize,
    logoStyle: selectedLogoStyle,
    logoColor: selectedLogoColor,
  });

  const customizationLabel = formatCustomizationSummary(selectedLogoStyle, resolvedFulfillment.logoColor);
  const userTypeOptions = getUserTypeOptions();
  const activeUserTypeLabel = userTypeOptions?.find(u => u.id === userCutPreference)?.label;

  const isCap = product.category === 'headwear' || product.id === 'headwear-flexfit-mesh';
  const decorationSpecLabel = isCap
    ? 'Structured Front Crown Mark'
    : product.userType === 'womens'
    ? '2.25" Lower-Aligned Chest Mark'
    : '2.5" Centered Left-Chest Embroidery';

  const stageImageSrc = activeAngle?.src || resolvedFulfillment.officialMockupUrl || activeColorObj?.image || product.image;
  const isViewingColorwayPrimary = Boolean(activeAngle?.supportsOverlay);
  const liveOverlayLogoPath = getLogoAssetPath(selectedLogoStyle, resolvedFulfillment.logoColor);
  const placement = activeAngle?.placementOverride || activeColorObj?.logoPlacement;

  const getAdjustedPlacementStyle = (): React.CSSProperties | undefined => {
    if (!placement) return undefined;
    const baseAngle = placement.angle || 0;
    let heightScale = 1.0;
    if (selectedLogoStyle === 'mark_text') heightScale = 0.85;
    const numericHeight = parseFloat(placement.height) || 4.0;
    return {
      left: placement.left,
      top: placement.top,
      height: `${(numericHeight * heightScale).toFixed(2)}%`,
      transform: `translate(-20%, -10%) rotate(${baseAngle}deg)`,
      filter: 'drop-shadow(0px 1px 1.5px rgba(0,0,0,0.45))',
    };
  };

  const handleAddCurrent = () => {
    if (product.isComingSoon) return;
    const colorWithCustomization = isCap
      ? selectedColor
      : `${selectedColor} • ${customizationLabel}${
          product.category === 'bundles' && activeUserTypeLabel ? ` (${activeUserTypeLabel})` : ''
        }`;
    onAddToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}-${selectedLogoStyle}-${resolvedFulfillment.logoColor}`,
      name: `${product.name} — ${selectedColor}`,
      price: product.price,
      color: colorWithCustomization,
      size: selectedSize,
      image: resolvedFulfillment.officialMockupUrl || activeColorObj?.image || product.image,
      logoStyle: selectedLogoStyle,
      logoColor: resolvedFulfillment.logoColor,
      userTypeLabel: activeUserTypeLabel,
      sovereignSku: resolvedFulfillment.sovereignSku,
      printifyProductId: resolvedFulfillment.printifyProductId,
      printifyVariantId: resolvedFulfillment.printifyVariantId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const bundleItem = isCap
    ? {
        id: 'men-polo-st740-Deep Midnight Navy-L-mark_monogram-white',
        name: "The Weekender Performance Polo — Deep Midnight Navy",
        price: 40,
        regularPrice: 48,
        color: 'Deep Midnight Navy • Mark + Monogram • Crisp White',
        size: 'L',
        image: '/assets/products/printify_mockups/high-draw-weekender-men-s-polo-mark-monogram--true-navy.jpg',
      }
    : {
        id: 'headwear-flexfit-mesh-Pure White-S/M',
        name: 'The Tour Performance Poly-Mesh Cap — Pure White',
        price: 28,
        regularPrice: 35,
        color: 'Pure White',
        size: 'S/M',
        image: '/assets/products/bespoke/hat_hero_wood.jpg',
      };

  const handleAddBundle = () => {
    handleAddCurrent();
    const resolvedBundle = resolvePrintifyFulfillment({
      id: bundleItem.id,
      color: bundleItem.color,
      size: bundleItem.size,
      logoStyle: selectedLogoStyle,
    });
    onAddToCart({
      id: bundleItem.id,
      name: bundleItem.name,
      price: bundleItem.price,
      color: bundleItem.color,
      size: bundleItem.size,
      image: bundleItem.image,
      logoStyle: selectedLogoStyle,
      logoColor: resolvedBundle.logoColor,
      sovereignSku: resolvedBundle.sovereignSku,
      printifyProductId: resolvedBundle.printifyProductId,
      printifyVariantId: resolvedBundle.printifyVariantId,
    });
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1600);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem('highdraw_tournament_waitlist') || '[]');
      existing.push({ email: waitlistEmail.trim(), size: selectedSize, at: new Date().toISOString() });
      localStorage.setItem('highdraw_tournament_waitlist', JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    setWaitlistJoined(true);
  };

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && !p.isComingSoon)
    .slice(0, 3);

  const accordionItems = [
    {
      id: 'engineering',
      title: 'Fabric, Collar & Tailored Embroidery Specs',
      icon: <RefreshCw size={16} className="text-[#38BDF8]" />,
      content: (
        <div className="space-y-2.5">
          <p>{product.description}</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-500">
            {product.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-[11px] bg-slate-50 p-2.5 rounded">
            <div><span className="text-slate-400">Fabric:</span> {product.specs.fabric}</div>
            <div><span className="text-slate-400">Collar:</span> {product.specs.collar}</div>
            <div><span className="text-slate-400">Weight:</span> {product.specs.weight}</div>
            <div><span className="text-slate-400">Solar:</span> {product.specs.protection}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'guarantee',
      title: '100+ Washes Tested Fairway Guarantee',
      icon: <ShieldCheck size={16} className="text-emerald-700" />,
      content: (
        <div className="space-y-2">
          <p>We engineered our collars and plackets to retain crisp structure round after round. Wash cold, tumble dry low. If the collar curls into bacon within 30 days, we will replace it or refund you completely.</p>
          <p className="font-semibold text-[#1C2C24]">Guaranteed zero collar baconing, pilling, or synthetic gym shine.</p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Complimentary Shipping & Easy Exchanges',
      icon: <Truck size={16} className="text-[#38BDF8]" />,
      content: (
        <div className="space-y-1.5">
          <p>All orders over $75 include free domestic US shipping. Custom-embroidered garments are stitched to order in the USA and dispatch within 2–3 business days with automated tracking.</p>
          <p>Protected by our 30-Day Fairway Fit &amp; Wash Guarantee.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="border-b border-slate-200 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-black font-bold uppercase tracking-wider cursor-pointer t-press"
          >
            <ArrowLeft size={16} />
            <span>BACK TO COLLECTION</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span>HOME</span>
              <span>/</span>
              <span className="uppercase">{product.tier || product.category}</span>
              <span>/</span>
              <span className="text-slate-700 font-semibold">{product.name}</span>
            </div>
            <button
              type="button"
              onClick={handleShareProduct}
              aria-label="Share product link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white hover:border-[#1C2C24] text-slate-700 hover:text-[#1C2C24] font-mono text-[11px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              {linkCopied ? <Check size={13} className="text-emerald-700" /> : <Share2 size={13} />}
              <span>{linkCopied ? 'LINK COPIED' : 'SHARE LINK'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* LEFT: Multi-Image Studio Stage with Crossfade & 1.6x Weave Loupe */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onMouseEnter={() => setIsHoverZooming(true)}
              onMouseLeave={() => setIsHoverZooming(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomCoords({
                  x: Math.max(0, Math.min(100, x)),
                  y: Math.max(0, Math.min(100, y)),
                });
              }}
              className="aspect-[4/3] w-full bg-[#F7F7F6] rounded-sm overflow-hidden border border-slate-200 shadow-xs relative select-none cursor-crosshair"
            >
              <AnimatePresence mode="wait">
                <m.img
                  key={`${stageImageSrc}-${stitchPulseKey}`}
                  src={stageImageSrc}
                  alt={`${product.name} — ${activeAngle?.label || selectedColor}`}
                  initial={isReduced ? { opacity: 1 } : { opacity: 0.25, scale: 0.99 }}
                  animate={{ opacity: 1, scale: isHoverZooming ? 1.6 : 1 }}
                  exit={isReduced ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_ACCENT }}
                  style={{
                    transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Optional Overlay on Unbranded Bespoke Table Shots */}
              {isViewingColorwayPrimary && liveOverlayLogoPath && placement && !isHoverZooming && (
                <img
                  key={`${selectedLogoStyle}-${resolvedFulfillment.logoColor}-${stitchPulseKey}`}
                  src={liveOverlayLogoPath}
                  alt="Custom Embroidery Preview"
                  style={getAdjustedPlacementStyle()}
                  className="absolute w-auto object-contain pointer-events-none transition-transform duration-200 z-10"
                />
              )}

              {/* Top-Left Tier & Zoom Indicator */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="bg-[#1C2C24]/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs flex items-center gap-1.5 shadow-sm">
                  <RefreshCw size={13} className="text-[#38BDF8]" />
                  <span>{product.badge || '100+ Washes Tested'}</span>
                </span>
                <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-sm">
                  <ZoomIn size={11} className="text-[#38BDF8]" />
                  <span>{activeAngle?.label || 'Hover to Magnify Weave'}</span>
                </span>
              </div>

              {/* Bottom-Right Live Swatch Loupe */}
              {!isCap && !product.isComingSoon && (
                <div className="absolute bottom-3.5 right-3.5 z-20 bg-black/80 backdrop-blur-md border border-white/20 text-white p-2.5 rounded-xs shadow-xl flex items-center gap-3 max-w-[270px] pointer-events-none">
                  <div
                    className="w-11 h-11 rounded-2xs border border-white/30 flex items-center justify-center shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: activeColorObj?.hex || '#1E293B' }}
                  >
                    {liveOverlayLogoPath && (
                      <img
                        src={liveOverlayLogoPath}
                        alt="Selected Logo"
                        className="w-8 h-8 object-contain drop-shadow-xs"
                      />
                    )}
                  </div>
                  <div className="min-w-0 pr-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#38BDF8] block font-bold">
                      {decorationSpecLabel}
                    </span>
                    <span className="text-xs font-serif font-bold text-white block truncate">
                      {CHEST_LOGO_STYLE_OPTIONS.find(s => s.id === selectedLogoStyle)?.shortLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 block truncate">
                      {LOGO_COLOR_OPTIONS.find(c => c.id === resolvedFulfillment.logoColor)?.name} Thread
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Multi-Angle Thumbnail Strip */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <span>STUDIO ANGLES FOR {selectedColor.toUpperCase()} ({colorwayAngles.length} VIEWS)</span>
                <span className="text-[#1C2C24] font-bold hidden sm:inline">Hover Main Photo to Magnify 1.6&times;</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {colorwayAngles.map((shot, idx) => {
                  const isSelected = activeAngleIdx === idx;
                  return (
                    <button
                      key={`${shot.id}-${idx}`}
                      type="button"
                      onClick={() => setActiveAngleIdx(idx)}
                      className={`group rounded-xs overflow-hidden border-2 transition-all cursor-pointer text-left flex flex-col t-press ${
                        isSelected
                          ? 'border-[#1C2C24] shadow-sm bg-white'
                          : 'border-slate-200 opacity-75 hover:opacity-100 bg-slate-50'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
                        <img
                          src={shot.src}
                          alt={shot.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="px-1.5 py-1 text-[9px] font-mono font-bold text-slate-700 truncate block w-full text-center">
                        {shot.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Buying Console */}
          <div className="lg:col-span-5 space-y-5">
            {/* Collection & Tier Header */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <img src="/assets/brand/logos/mark_monogram_cyan.png" alt="High Draw Mark" className="h-4 w-auto object-contain" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B12535]">
                  {product.collectionLabel}
                </span>
                {product.tier && product.tier !== 'core' && (
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-2xs bg-[#1C2C24] text-[#38BDF8] font-bold">
                    {product.tier.toUpperCase()} TIER
                  </span>
                )}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1F26] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Social Proof Row */}
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-slate-800">5.0 / 5.0</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500">48 Verified Golfer Reviews</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> True to Size
              </span>
            </div>

            {/* Price & Direct Value Comparison */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-black text-[#1A1F26]">${product.price} USD</span>
                <span className="font-mono text-sm text-slate-400 line-through">${product.originalPrice}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-xs whitespace-nowrap">
                {product.isComingSoon
                  ? 'SUMMER 2026 DROP'
                  : `SAVE $${product.originalPrice - product.price} DIRECT`}
              </span>
            </div>

            {/* Garment Color Swatches */}
            <ColorSwatch
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={handleColorChange}
              size="md"
            />

            {/* Bespoke 3-Mark Chest Selector (Shown for Apparel, Hidden on Pure Cap & Prototype) */}
            {!isCap && !product.isComingSoon && (
              <LogoCustomizer
                selectedStyle={selectedLogoStyle}
                onSelectStyle={(style) => {
                  setSelectedLogoStyle(style);
                  setActiveAngleIdx(0);
                  setStitchPulseKey(k => k + 1);
                }}
                selectedColor={resolvedFulfillment.logoColor}
                garmentHex={activeColorObj?.hex || '#1E293B'}
                garmentColorName={selectedColor}
                recommendedColor={resolvedFulfillment.logoColor}
                userTypeSelection={userCutPreference}
                onSelectUserType={handleUserTypeSwitch}
                userTypeOptions={userTypeOptions}
                decorationSpecLabel={decorationSpecLabel}
              />
            )}

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />

            {/* Coming Soon Allocation Waitlist vs Active Add to Bag */}
            {product.isComingSoon ? (
              <div className="p-5 bg-[#0D1520] text-white rounded-xs border border-slate-800 space-y-3.5 shadow-lg">
                <div className="flex items-center gap-2 text-[#38BDF8] font-mono text-[11px] uppercase tracking-widest font-bold">
                  <Bell size={14} />
                  <span>PRIVATE TOUR ALLOCATION WAITLIST</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Tournament Tour-Spec Polo is currently in final on-course testing for our Summer 2026 release. Reserve priority access for your preferred size ({selectedSize}).
                </p>
                {waitlistJoined ? (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xs text-xs text-emerald-200 flex items-center gap-2 font-semibold">
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span>You&rsquo;re on the priority allocation list for Size {selectedSize}. We&rsquo;ll email you before public release.</span>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={e => setWaitlistEmail(e.target.value)}
                      placeholder="Enter your email for early access..."
                      className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#38BDF8]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer t-press whitespace-nowrap"
                    >
                      NOTIFY ME
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                {/* Tailored Spec Summary */}
                <div className="p-3.5 text-xs text-[#1C2C24] bg-[#1C2C24]/5 border border-[#1C2C24]/15 rounded-xs space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                    <span>
                      <strong>Your Custom Order ({selectedColor}, Size {selectedSize}):</strong>{' '}
                      {isCap ? 'Structured Performance Crown Mark' : customizationLabel} &bull; Crafted to order in the USA
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#1C2C24]/10 font-mono text-[10px] text-slate-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#1C2C24]">
                      <Tag size={11} className="text-[#B12535]" />
                      Tailor Spec: {resolvedFulfillment.sovereignSku}
                    </span>
                    <span className="text-emerald-700 font-semibold">In Stock &amp; Ready to Stitch</span>
                  </div>
                </div>

                {/* Primary Add to Bag CTA */}
                <div className="space-y-3 pt-1">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddCurrent}
                    icon={added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  >
                    {added ? 'ADDED TO YOUR BAG' : `ADD TO BAG • $${product.price}`}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium flex-wrap">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-700" />
                      30-Day Fairway Guarantee
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Truck size={14} className="text-[#38BDF8]" />
                      {product.price >= 75
                        ? 'Unlocks FREE US Shipping!'
                        : `Add $${75 - product.price} more for Free Shipping`}
                    </span>
                  </div>
                </div>

                {/* Frequently Bought Together Bundle Upsell (Unlocks $75 Free Shipping!) */}
                <div className="p-4 bg-[#1C2C24]/5 border border-[#1C2C24]/15 rounded-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#B12535]" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C2C24]">
                        Pair &amp; Unlock Free Shipping ($75+)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-2xs">
                      FREE SHIPPING
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={bundleItem.image} alt={bundleItem.name} className="w-14 h-14 object-cover rounded-xs border border-slate-200" />
                    <div className="flex-1 text-xs min-w-0">
                      <span className="font-bold text-[#1A1F26] block truncate">{bundleItem.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-emerald-700 font-bold">+${bundleItem.price} Bundle Rate</span>
                        <span className="text-slate-400 line-through text-[11px]">${bundleItem.regularPrice}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBundle}
                      className="px-3 py-2 bg-[#1C2C24] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xs cursor-pointer t-press shrink-0"
                    >
                      {bundleAdded ? 'ADDED!' : `+ ADD BOTH ($${product.price + bundleItem.price})`}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Expandable Accordions */}
            <Accordion items={accordionItems} defaultOpenId="engineering" />
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="pt-20 border-t border-slate-200 mt-20 space-y-8">
          <div className="flex justify-between items-baseline">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F26]">
              Complete Your Fairway &amp; Clubhouse Kit
            </h3>
            <button
              onClick={onBackToShop}
              className="text-xs font-bold text-[#B12535] hover:underline uppercase tracking-wider cursor-pointer"
            >
              View Full Collection &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="group cursor-pointer space-y-3"
              >
                <div className="aspect-[4/3] bg-slate-100 rounded-xs overflow-hidden border border-slate-200 relative">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {rel.badge && (
                    <span className="absolute top-3 left-3 bg-[#1C2C24]/90 text-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-2xs">
                      {rel.badge}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B12535] block">
                    {rel.collectionLabel}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#1A1F26] group-hover:text-[#B12535] transition-colors">
                    {rel.name}
                  </h4>
                  <div className="flex items-baseline gap-2 font-mono text-sm">
                    <span className="font-bold text-[#1A1F26]">${rel.price}</span>
                    <span className="text-slate-400 line-through text-xs">${rel.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add-to-Bag Conversion Bar (390x844 Thumb Zone) */}
      {!product.isComingSoon && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/96 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-[#1A1F26] block truncate">
              {selectedColor} &bull; Size {selectedSize}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block truncate">
              {isCap ? 'Tour Cap' : CHEST_LOGO_STYLE_OPTIONS.find(s => s.id === selectedLogoStyle)?.shortLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddCurrent}
            className="px-5 py-3 bg-[#B12535] hover:bg-[#8e1d29] text-white font-bold text-xs uppercase tracking-wider rounded-xs shadow-md flex items-center gap-2 shrink-0 t-press cursor-pointer"
          >
            {added ? <Check size={15} /> : <ShoppingBag size={15} />}
            <span>{added ? 'ADDED!' : `ADD • $${product.price}`}</span>
          </button>
        </div>
      )}

      {/* Sizing Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
};
