import React, { useState } from 'react';
import { getColorwayAngles, type Product } from '../data/products';
import { SizeSelector } from '../components/ui/SizeSelector';
import { ColorSwatch } from '../components/ui/ColorSwatch';
import { LogoCustomizer } from '../components/ui/LogoCustomizer';
import {
  getLogoAssetPath,
  formatCustomizationSummary,
  LOGO_STYLE_OPTIONS,
  LOGO_COLOR_OPTIONS,
} from '../components/brand/HighDrawLogo';
import type { LogoStyle, LogoVariant } from '../components/brand/HighDrawLogo';
import { Accordion } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { resolvePrintifyFulfillment } from '../lib/fulfillmentResolver';
import { Star, ShieldCheck, RefreshCw, Truck, ArrowLeft, Check, ShoppingBag, Sparkles, Tag, ZoomIn } from 'lucide-react';

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
  const initialColorObj = product.colors[0];
  const [selectedColor, setSelectedColor] = useState(initialColorObj?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] || product.sizes?.[0] || 'L');
  const [activeAngleIdx, setActiveAngleIdx] = useState<number>(0);
  const [selectedLogoStyle, setSelectedLogoStyle] = useState<LogoStyle>('mark_monogram');
  const [selectedLogoColor, setSelectedLogoColor] = useState<LogoVariant>(
    initialColorObj?.defaultLogoColor || 'cyan'
  );
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

  const activeColorObj =
    product.colors.find(c => c.name === selectedColor) || product.colors[0];

  const colorwayAngles = getColorwayAngles(product, activeColorObj);
  const activeAngle = colorwayAngles[activeAngleIdx] || colorwayAngles[0];

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    setActiveAngleIdx(0);
    setStitchPulseKey(k => k + 1);
    const foundColor = product.colors.find(c => c.name === colorName);
    if (foundColor) {
      if (foundColor.defaultLogoColor) {
        setSelectedLogoColor(foundColor.defaultLogoColor);
      }
    }
  };

  // User Type / Cut Options per product category
  const getUserTypeOptions = () => {
    if (product.category === 'polos') {
      return [
        { id: 'mens', label: "Men's Tour Fit (ST740)", sublabel: 'Structured Comfort Drape • S–4XL' },
        { id: 'womens', label: "Women's Contoured (LST740)", sublabel: 'Tailored Open Y-Neck • XS–4XL' },
      ];
    }
    if (product.category === 'bundles') {
      return [
        { id: '4-mens', label: "4 Men's Tour Polos", sublabel: 'Standard Foursome' },
        { id: '2m-2w', label: "2 Men's + 2 Women's", sublabel: 'Co-Ed Couples Scramble' },
        { id: '3m-1w', label: "3 Men's + 1 Women's", sublabel: 'Mixed Foursome' },
        { id: '4-womens', label: "4 Women's Tour Polos", sublabel: "Ladies' Scramble Kit" },
      ];
    }
    if (product.category === 'outerwear') {
      return [
        { id: 'mens', label: "Men's Athletic Fit", sublabel: 'Standard Layering Cut' },
        { id: 'womens-layer', label: "Women's Relaxed Layer", sublabel: 'Size Down 1 Size for Tailored Fit' },
      ];
    }
    return undefined;
  };

  const handleUserTypeSwitch = (nextType: string) => {
    setUserCutPreference(nextType);
    if (product.category === 'polos') {
      if (nextType === 'womens' && product.id !== 'women-polo-lst740') {
        const womenProd = allProducts.find(p => p.id === 'women-polo-lst740');
        if (womenProd) onSelectProduct(womenProd);
      } else if (nextType === 'mens' && product.id !== 'men-polo-st740') {
        const menProd = allProducts.find(p => p.id === 'men-polo-st740');
        if (menProd) onSelectProduct(menProd);
      }
    }
  };

  const customizationLabel = formatCustomizationSummary(selectedLogoStyle, selectedLogoColor);
  const userTypeOptions = getUserTypeOptions();
  const activeUserTypeLabel = userTypeOptions?.find(u => u.id === userCutPreference)?.label;

  const resolvedFulfillment = resolvePrintifyFulfillment({
    id: product.id,
    color: selectedColor,
    size: selectedSize,
    logoStyle: selectedLogoStyle,
    logoColor: selectedLogoColor,
  });

  const handleAddCurrent = () => {
    const colorWithCustomization = `${selectedColor} • ${customizationLabel}${
      product.category === 'bundles' && activeUserTypeLabel ? ` (${activeUserTypeLabel})` : ''
    }`;
    onAddToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}-${selectedLogoStyle}-${selectedLogoColor}`,
      name: `${product.name} — ${selectedColor}`,
      price: product.price,
      color: colorWithCustomization,
      size: selectedSize,
      image: activeColorObj?.image || product.image,
      logoStyle: selectedLogoStyle,
      logoColor: selectedLogoColor,
      userTypeLabel: activeUserTypeLabel,
      sovereignSku: resolvedFulfillment.sovereignSku,
      printifyProductId: resolvedFulfillment.printifyProductId,
      printifyVariantId: resolvedFulfillment.printifyVariantId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isCap = product.category === 'headwear' || product.id === 'headwear-flexfit-mesh';
  const bundleItem = isCap
    ? {
        id: 'men-polo-st740-Deep Midnight Navy-L',
        name: "Men's Tour Performance Polo — Deep Midnight Navy",
        price: 40,
        regularPrice: 48,
        color: `Deep Midnight Navy • ${customizationLabel}`,
        size: 'L',
        image: '/assets/products/bespoke/men_polo_hero_wood.jpg',
      }
    : {
        id: 'headwear-flexfit-mesh-Pure White-S/M',
        name: 'Tour Performance Poly-Mesh Cap — Pure White',
        price: 28,
        regularPrice: 35,
        color: `Pure White • ${customizationLabel}`,
        size: 'S/M',
        image: '/assets/products/bespoke/hat_hero_wood.jpg',
      };

  const handleAddBundle = () => {
    handleAddCurrent();
    onAddToCart({
      id: bundleItem.id,
      name: bundleItem.name,
      price: bundleItem.price,
      color: bundleItem.color,
      size: bundleItem.size,
      image: bundleItem.image,
      logoStyle: selectedLogoStyle,
      logoColor: selectedLogoColor,
    });
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1500);
  };

  // Determine whether the active main stage angle supports live dynamic embroidery overlay
  const isViewingColorwayPrimary = Boolean(activeAngle?.supportsOverlay);
  const stageImageSrc = activeAngle?.src || activeColorObj?.unbrandedImage || product.image;

  const liveOverlayLogoPath = getLogoAssetPath(selectedLogoStyle, selectedLogoColor);
  const placement = activeAngle?.placementOverride || activeColorObj?.logoPlacement;

  // Adjust aspect ratio scaling for wide logos (monogram / mark_text) so they fit the left chest naturally
  const getAdjustedPlacementStyle = (): React.CSSProperties | undefined => {
    if (!placement) return undefined;
    const baseAngle = placement.angle || 0;
    let heightScale = 1.0;
    if (selectedLogoStyle === 'monogram') heightScale = 0.58;
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

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 3);

  const accordionItems = [
    {
      id: 'engineering',
      title: 'Fabric, Collar & Custom Embroidery Specs',
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
      title: '100+ Washes Tested Guarantee',
      icon: <ShieldCheck size={16} className="text-emerald-700" />,
      content: (
        <div className="space-y-2">
          <p>We engineered the collar stand with fused technical interlining that permanently retains its memory. Wash cold, tumble dry low. If the collar curls into bacon within 30 days, we'll replace it or refund you completely.</p>
          <p className="font-semibold text-[#1C2C24]">Guaranteed zero collar baconing, pilling, or synthetic shine.</p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Complimentary Shipping & Returns',
      icon: <Truck size={16} className="text-[#38BDF8]" />,
      content: (
        <div className="space-y-1.5">
          <p>All orders over $75 include free standard domestic US shipping. Orders dispatch within 24–48 hours from our production facility with automated tracking.</p>
          <p>We offer 30-day hassle-free size exchanges and returns under our 30-Day Fairway Guarantee.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Top Breadcrumb & Back Navigation */}
      <div className="border-b border-slate-200 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-black font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>BACK TO ALL GEAR</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>HOME</span>
            <span>/</span>
            <span className="uppercase">{product.category}</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: Multi-Image Photo Gallery with Live Custom Embroidery Preview & Macro Weave Loupe */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image with Interactive Hover Zoom Loupe */}
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
              className="aspect-[4/3] sm:aspect-[4/3] w-full bg-slate-100 rounded-sm overflow-hidden border border-slate-200 shadow-xs relative select-none cursor-crosshair"
            >
              <img 
                src={stageImageSrc} 
                alt={`${product.name} — ${activeAngle?.label || selectedColor}`} 
                style={{
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  transform: isHoverZooming ? 'scale(1.6)' : 'scale(1)',
                }}
                className="w-full h-full object-cover object-center transition-transform duration-200 ease-out"
              />

              {/* Live Dynamic Embroidery Overlay on Garment Chest/Crown */}
              {isViewingColorwayPrimary && liveOverlayLogoPath && placement && !isHoverZooming && (
                <img
                  key={`${selectedLogoStyle}-${selectedLogoColor}-${stitchPulseKey}`}
                  src={liveOverlayLogoPath}
                  alt="Custom Embroidery Preview"
                  style={getAdjustedPlacementStyle()}
                  className="absolute w-auto object-contain pointer-events-none transition-all duration-300 z-10 animate-in fade-in zoom-in-95"
                />
              )}

              {/* Top-Left Durability & Angle Badge */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="bg-[#1C2C24]/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs flex items-center gap-1.5 shadow-sm">
                  <RefreshCw size={13} className="text-[#38BDF8]" />
                  <span>100+ Washes Tested</span>
                </span>
                <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-sm">
                  <ZoomIn size={11} className="text-[#38BDF8]" />
                  <span>{activeAngle?.label || 'Hover to Inspect 180 GSM Weave'}</span>
                </span>
              </div>

              {/* Bottom-Right Live Embroidery Close-Up Loupe */}
              <div className="absolute bottom-3.5 right-3.5 z-20 bg-black/80 backdrop-blur-md border border-white/20 text-white p-2.5 rounded-xs shadow-xl flex items-center gap-3 max-w-[270px] pointer-events-none">
                <div
                  className="w-12 h-12 rounded-2xs border border-white/30 flex items-center justify-center shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: activeColorObj?.hex || '#1E293B' }}
                >
                  {liveOverlayLogoPath ? (
                    <img
                      src={liveOverlayLogoPath}
                      alt="Selected Logo"
                      className="w-9 h-9 object-contain drop-shadow-xs"
                    />
                  ) : (
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-300 font-bold">
                      NO LOGO
                    </span>
                  )}
                </div>
                <div className="min-w-0 pr-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#38BDF8] block font-bold">
                    SELECTED EMBROIDERY
                  </span>
                  <span className="text-xs font-serif font-bold text-white block truncate">
                    {LOGO_STYLE_OPTIONS.find(s => s.id === selectedLogoStyle)?.shortLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 block truncate">
                    {selectedLogoStyle === 'none'
                      ? 'Clean Unbranded Garment'
                      : `${LOGO_COLOR_OPTIONS.find(c => c.id === selectedLogoColor)?.name} Thread`}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Multi-Angle Colorway Strip (Front, Back, Form, Macro Weave) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <span>STUDIO ANGLES FOR {selectedColor.toUpperCase()} ({colorwayAngles.length} VIEWS)</span>
                <span className="text-[#1C2C24] font-bold">Hover Main Photo to Magnify 1.6&times;</span>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {colorwayAngles.map((shot, idx) => {
                  const isSelected = activeAngleIdx === idx;
                  return (
                    <button
                      key={`${shot.id}-${idx}`}
                      type="button"
                      onClick={() => setActiveAngleIdx(idx)}
                      className={`group rounded-xs overflow-hidden border-2 transition-all cursor-pointer text-left flex flex-col ${
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
                        {shot.supportsOverlay && liveOverlayLogoPath && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#38BDF8] shadow-xs" title="Supports Live Embroidery Overlay" />
                        )}
                      </div>
                      <span className="px-1.5 py-1 text-[9px] font-mono font-bold text-slate-700 truncate block w-full text-center">
                        {shot.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Official 4-Mark Reference Bar under Gallery */}
            <div className="p-4 bg-[#FBFBFA] border border-slate-200 rounded-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                  OFFICIAL HIGH DRAW EMBROIDERY SUITE &bull; CLICK ANY MARK TO PREVIEW LIVE
                </span>
                <span className="text-[10px] font-mono text-[#1C2C24] font-semibold">
                  4 Marks &times; 4 Thread Colors + Optional Clean
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {LOGO_STYLE_OPTIONS.filter(s => s.id !== 'none').map(styleOpt => {
                  const active = selectedLogoStyle === styleOpt.id;
                  const imgSrc = getLogoAssetPath(styleOpt.id, selectedLogoColor);
                  return (
                    <button
                      key={styleOpt.id}
                      type="button"
                      onClick={() => {
                        setSelectedLogoStyle(styleOpt.id);
                        setActiveAngleIdx(0);
                        setStitchPulseKey(k => k + 1);
                      }}
                      className={`p-2.5 rounded-xs border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 t-press ${
                        active
                          ? 'border-[#1C2C24] bg-white shadow-xs'
                          : 'border-slate-200 bg-white/60 hover:bg-white'
                      }`}
                    >
                      <div
                        className="w-full h-12 rounded-2xs flex items-center justify-center px-2 border border-slate-200"
                        style={{ backgroundColor: activeColorObj?.hex || '#1E293B' }}
                      >
                        {imgSrc && (
                          <img src={imgSrc} alt={styleOpt.name} className="max-h-9 max-w-full object-contain" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#1A1F26]">{styleOpt.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Buying Console */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Collection & Brand Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <img src="/assets/brand/logos/mark_monogram_cyan.png" alt="High Draw Mark" className="h-4 w-auto object-contain" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B12535]">
                  {product.collectionLabel} &bull; BESPOKE CUSTOMIZATION
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1F26] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Review Star Proof */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-slate-800">5.0 / 5.0</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500 underline cursor-pointer">48 Course Reviews</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> 94% True to Size
              </span>
            </div>

            {/* Price & Value Breakdown */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl font-black text-[#1A1F26]">${product.price} USD</span>
                <span className="font-mono text-sm text-slate-400 line-through">${product.originalPrice}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-xs">
                SAVE ${product.originalPrice - product.price} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
              </span>
            </div>

            {/* Garment Color Swatches */}
            <ColorSwatch
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={handleColorChange}
              size="md"
            />

            {/* Bespoke Logo Style, Thread Color & Cut Customizer */}
            <LogoCustomizer
              selectedStyle={selectedLogoStyle}
              onSelectStyle={(style) => {
                setSelectedLogoStyle(style);
                setActiveAngleIdx(0);
                setStitchPulseKey(k => k + 1);
              }}
              selectedColor={selectedLogoColor}
              onSelectColor={(color) => {
                setSelectedLogoColor(color);
                setActiveAngleIdx(0);
                setStitchPulseKey(k => k + 1);
              }}
              garmentHex={activeColorObj?.hex || '#1E293B'}
              garmentColorName={selectedColor}
              recommendedColor={activeColorObj?.defaultLogoColor || 'cyan'}
              userTypeSelection={userCutPreference}
              onSelectUserType={handleUserTypeSwitch}
              userTypeOptions={userTypeOptions}
            />

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />

            {/* Bespoke Embroidery & Fulfillment Assurance */}
            <div className="p-3.5 text-xs text-[#1C2C24] bg-[#1C2C24]/5 border border-[#1C2C24]/15 rounded-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                <span>
                  <strong>Your Custom Spec ({selectedColor}, Size {selectedSize}):</strong>{' '}
                  {customizationLabel} &bull; Embroidered to order in the USA
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1C2C24]/10 font-mono text-[10px] text-slate-600">
                <span className="inline-flex items-center gap-1 font-bold text-[#1C2C24]">
                  <Tag size={11} className="text-[#B12535]" />
                  SKU: {resolvedFulfillment.sovereignSku}
                </span>
                <span className="text-slate-500">
                  Factory ID: #{resolvedFulfillment.printifyVariantId} ({resolvedFulfillment.decorationMethod.toUpperCase()})
                </span>
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
                {added ? 'ADDED CUSTOM ORDER TO BAG' : `ADD TO BAG • $${product.price}`}
              </Button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  30-Day Guarantee
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Truck size={14} className="text-[#38BDF8]" />
                  Free Shipping $75+
                </span>
                <span>&bull;</span>
                <span>Ships in 24h</span>
              </div>
            </div>

            {/* Frequently Bought Together Bundle Upsell */}
            <div className="p-4 bg-[#1C2C24]/5 border border-[#1C2C24]/15 rounded-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#B12535]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1C2C24]">
                  Frequently Bought Together (Matching Embroidery)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <img src={bundleItem.image} alt={bundleItem.name} className="w-14 h-14 object-cover rounded-xs border border-slate-200" />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-[#1A1F26] block">{bundleItem.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-700 font-bold">+${bundleItem.price} Bundle Price</span>
                    <span className="text-slate-400 line-through text-[11px]">${bundleItem.regularPrice} Reg</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddBundle}
                  className="px-3 py-2 bg-[#1C2C24] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  {bundleAdded ? 'ADDED' : `+ ADD BOTH ($${product.price + bundleItem.price})`}
                </button>
              </div>
            </div>

            {/* Expandable Accordions */}
            <Accordion items={accordionItems} defaultOpenId="engineering" />

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        <div className="pt-20 border-t border-slate-200 mt-20 space-y-8">
          <div className="flex justify-between items-baseline">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1F26]">
              Complete Your Fairway Kit
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
                <div className="aspect-[4/3] bg-slate-100 rounded-xs overflow-hidden border border-slate-200">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

      {/* Sizing Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

    </div>
  );
};
