import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FullscreenHero } from './components/FullscreenHero';
import { ShopifyCollections } from './components/ShopifyCollections';
import { WhyHighDraw } from './components/WhyHighDraw';
import { UserReviews } from './components/UserReviews';
import { CartDrawer } from './components/CartDrawer';
import type { CartItem } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { AdminConsole } from './components/AdminConsole';

export function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'polo-cypress-01',
      name: 'The Heritage Cypress Micro-Pique Polo',
      price: 48,
      color: 'Cypress Green',
      size: 'L',
      image: '/assets/polo_cypress_green.jpg',
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Store Brand State (Configurable by Brand Owner via AdminConsole)
  const [tickerText, setTickerText] = useState('FREE SHIPPING ON ORDERS OVER $75 • TOUR-GRADE DRAPE AT $48');
  const [poloPrice, setPoloPrice] = useState(48);
  const [activeBoard, setActiveBoard] = useState('Autumn Fairways');
  const [heroImage, setHeroImage] = useState('/assets/lifestyle_golf.jpg');

  // Keyboard shortcut for Brand Owner console (Ctrl+Shift+O / Cmd+Shift+O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryAndScroll = (category: 'polos' | 'outerwear' | 'headwear' | 'bundles') => {
    setActiveCategory(category);
    const collectionsEl = document.getElementById('collections');
    if (collectionsEl) {
      collectionsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddUpsellHat = () => {
    setCartItems((prev) => [
      ...prev,
      {
        id: 'hat-upsell-01',
        name: 'The High Draw Structured Visor Rope Cap',
        price: 32,
        color: 'Vintage White / Navy Rope',
        size: 'ONE SIZE',
        image: '/assets/hat_rope_white.png',
      },
    ]);
  };

  const handleSelectPipesBoard = (boardName: string, image: string) => {
    setActiveBoard(boardName);
    setHeroImage(image);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1F26] selection:bg-[#B12535] selection:text-white">
      {/* Header with Far-Left Logo, Working Nav Links (Pipes & Owner Console Removed) */}
      <Header 
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
        onScrollToSection={handleScrollToSection}
        tickerText={tickerText}
      />

      <main className="pt-20">
        {/* Straight Down / Peter Millar Style Hero */}
        <FullscreenHero 
          heroImage={heroImage}
          onScrollToShop={() => handleSelectCategoryAndScroll('polos')}
          onScrollToWhy={() => handleScrollToSection('why')}
        />

        {/* Picture-Heavy Shopify Collections with Working Filters & Swatches */}
        <ShopifyCollections 
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onAddToCart={handleAddToCart}
        />

        {/* Redesigned Craftsmanship Showcase (Macro Collar Detail & $48 Math) */}
        <WhyHighDraw 
          onScrollToShop={() => handleSelectCategoryAndScroll('polos')}
        />

        {/* Real Golfer Course Reviews with Authentic Photography */}
        <UserReviews />
      </main>

      {/* Fully Functional Footer with Policy Modals & Discreet Admin Link */}
      <Footer 
        onSelectCategoryAndScroll={handleSelectCategoryAndScroll}
        onScrollToSection={handleScrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Owner Command Center Modal (Zero-Code Management for Dad) */}
      <AdminConsole
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        tickerText={tickerText}
        onUpdateTicker={setTickerText}
        activeBoard={activeBoard}
        onSelectBoard={handleSelectPipesBoard}
        poloPrice={poloPrice}
        onUpdatePrice={setPoloPrice}
      />

      {/* Interactive Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onAddUpsellHat={handleAddUpsellHat}
      />
    </div>
  );
}

export default App;
