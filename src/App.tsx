import { useState } from 'react';
import { Header } from './components/Header';
import { FullscreenHero } from './components/FullscreenHero';
import { PipesCurationModal } from './components/PipesCurationModal';
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
      id: 'polo-navy-01',
      name: 'The Classic Performance Polo — Deep Navy',
      price: 48,
      color: 'Deep Navy',
      size: 'L',
      image: '/assets/lifestyle_golf.jpg',
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPipesOpen, setIsPipesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Store Brand State (Configurable by Brand Owner)
  const [tickerText, setTickerText] = useState('FREE SHIPPING ON ORDERS OVER $75 • TOUR-GRADE DRAPE AT $48');
  const [poloPrice, setPoloPrice] = useState(48);

  // Pipes Curation State (Ken Siri / High Draw Golf Pipe)
  const [activeBoard, setActiveBoard] = useState('Autumn Fairways');
  const [heroImage, setHeroImage] = useState('/assets/lifestyle_golf.jpg');

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
        price: 26,
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
    <div className="min-h-screen bg-white font-sans text-[#32363F] selection:bg-[#B12535] selection:text-white">
      {/* Header with Pipes Curation & Owner Console Trigger */}
      <Header 
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToSection={handleScrollToSection}
        onOpenPipes={() => setIsPipesOpen(true)}
        activeBoard={activeBoard}
        tickerText={tickerText}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        {/* Straight Down / Peter Millar Style Hero */}
        <FullscreenHero 
          heroImage={heroImage}
          onScrollToShop={() => handleScrollToSection('polos')}
          onOpenPipes={() => setIsPipesOpen(true)}
          activeBoard={activeBoard}
        />

        {/* Picture-Heavy Shopify Collections */}
        <div id="polos">
          <ShopifyCollections 
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Direct Value Pillars */}
        <WhyHighDraw />

        {/* Real User Reviews */}
        <UserReviews />
      </main>

      <Footer />

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

      {/* Pipes Curation Modal (Ken Siri / High Draw Golf) */}
      <PipesCurationModal 
        isOpen={isPipesOpen}
        onClose={() => setIsPipesOpen(false)}
        activeBoard={activeBoard}
        onSelectBoard={handleSelectPipesBoard}
      />

      {/* Cart Drawer */}
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
