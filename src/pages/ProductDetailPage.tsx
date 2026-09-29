import React, { useState, useEffect } from 'react';
import type { Product } from '../data/products';
import { SizeSelector } from '../components/ui/SizeSelector';
import { ColorSwatch } from '../components/ui/ColorSwatch';
import { Accordion } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { Star, ShieldCheck, RefreshCw, Truck, ArrowLeft, Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBackToShop: () => void;
  onAddToCart: (item: { id: string; name: string; price: number; color: string; size: string; image: string }) => void;
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
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'True Navy');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'L');
  const [activeImage, setActiveImage] = useState(product.image);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  useEffect(() => {
    setSelectedColor(product.colors[0]?.name || '');
    setActiveImage(product.image);
    setSelectedSize(product.sizes[0] || 'L');
  }, [product.id]);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const foundColor = product.colors.find(c => c.name === colorName);
    if (foundColor && foundColor.image) {
      setActiveImage(foundColor.image);
    }
  };

  const handleAddCurrent = () => {
    onAddToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: `${product.name} — ${selectedColor}`,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      image: activeImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isCap = product.category === 'headwear' || product.id === 'headwear-flexfit-mesh';
  const bundleItem = isCap
    ? {
        id: 'mens-tour-performance-polo-True Navy-L',
        name: "Men's Tour Performance Polo — True Navy",
        price: 40,
        regularPrice: 48,
        color: 'True Navy',
        size: 'L',
        image: '/assets/products/bespoke/men_polo_hero_wood.jpg',
      }
    : {
        id: 'tour-performance-poly-mesh-cap-Pure White-S/M',
        name: 'Tour Performance Poly-Mesh Cap — Pure White',
        price: 28,
        regularPrice: 35,
        color: 'Pure White',
        size: 'S/M',
        image: '/assets/products/bespoke/hat_hero_wood.jpg',
      };

  const handleAddBundle = () => {
    // Add current item
    onAddToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: `${product.name} — ${selectedColor}`,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      image: activeImage,
    });
    // Add companion bundle item
    onAddToCart({
      id: bundleItem.id,
      name: bundleItem.name,
      price: bundleItem.price,
      color: bundleItem.color,
      size: bundleItem.size,
      image: bundleItem.image,
    });
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1500);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 3);

  const accordionItems = [
    {
      id: 'engineering',
      title: 'Fabric & Collar Engineering',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT: Multi-Image Photo Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="aspect-[4/3] sm:aspect-[4/3] w-full bg-slate-100 rounded-sm overflow-hidden border border-slate-200 shadow-xs relative">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#1C2C24]/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs flex items-center gap-1.5 shadow-sm">
                  <RefreshCw size={13} className="text-[#38BDF8]" />
                  <span>100+ Washes Tested</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[4/3] rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === img
                      ? 'border-[#1C2C24] shadow-sm'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Buying Console (High-Converting Luxury Shopify Pattern) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Collection & Brand Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <img src="/assets/brand/logo_tracer_cyan.png" alt="Tracer" className="h-3.5 w-auto object-contain" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B12535]">
                  {product.collectionLabel} &bull; TOUR PERFORMANCE
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
                SAVE ${product.originalPrice - product.price} (58% OFF)
              </span>
            </div>

            {/* Color Swatches */}
            <ColorSwatch
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={handleColorChange}
              size="md"
            />

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />

            {/* Urgency Stock Ticker */}
            <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Low Stock: Only 14 remaining in <strong>Size {selectedSize}</strong></span>
            </div>

            {/* Primary Add to Bag CTA */}
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddCurrent}
                icon={added ? <Check size={18} /> : <ShoppingBag size={18} />}
              >
                {added ? 'ADDED TO YOUR BAG' : `ADD TO BAG • $${product.price}`}
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
                  Frequently Bought Together
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
