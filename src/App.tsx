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
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionPage } from './pages/CollectionPage';
import { CraftsmanshipPage } from './pages/CraftsmanshipPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { GuaranteePage } from './pages/GuaranteePage';
import { AboutPage } from './pages/AboutPage';
import { PRODUCTS } from './data/products';
import type { Product } from './data/products';

type ActiveRoute =
  | { view: 'home' }
  | { view: 'collection'; category: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles' }
  | { view: 'product'; product: Product }
  | { view: 'craftsmanship' }
  | { view: 'reviews' }
  | { view: 'guarantee' }
  | { view: 'about' };

function parseRouteFromLocation(): ActiveRoute {
  if (typeof window === 'undefined') return { view: 'home' };
  const path = window.location.pathname.toLowerCase();

  if (path.startsWith('/products/')) {
    const slug = path.replace('/products/', '').replace(/\/$/, '').trim();
    const prod = PRODUCTS.find(p => p.slug === slug || p.id === slug);
    if (prod) return { view: 'product', product: prod };
  }

  if (path.startsWith('/collections/')) {
    const cat = path.replace('/collections/', '').replace(/\/$/, '').trim();
    if (['all', 'polos', 'outerwear', 'headwear', 'bundles'].includes(cat)) {
      return { view: 'collection', category: cat as any };
    }
    return { view: 'collection', category: 'all' };
  }

  if (path === '/pages/craftsmanship' || path === '/craftsmanship') {
    return { view: 'craftsmanship' };
  }
  if (path === '/pages/reviews' || path === '/reviews') {
    return { view: 'reviews' };
  }
  if (path === '/pages/guarantee' || path === '/guarantee') {
    return { view: 'guarantee' };
  }
  if (path === '/pages/about' || path === '/about') {
    return { view: 'about' };
  }

  return { view: 'home' };
}

export function App() {
  const [route, setRoute] = useState<ActiveRoute>(parseRouteFromLocation);

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

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRouteFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const navigateTo = (
    view: 'home' | 'collection' | 'product' | 'craftsmanship' | 'reviews' | 'guarantee' | 'about',
    opts?: {
      category?: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles';
      product?: Product;
    }
  ) => {
    let newPath = '/';
    let nextRoute: ActiveRoute = { view: 'home' };

    if (view === 'collection') {
      const cat = opts?.category || 'polos';
      newPath = `/collections/${cat}`;
      nextRoute = { view: 'collection', category: cat };
      setActiveCategory(cat);
    } else if (view === 'product' && opts?.product) {
      newPath = `/products/${opts.product.slug}`;
      nextRoute = { view: 'product', product: opts.product };
    } else if (view === 'craftsmanship') {
      newPath = '/pages/craftsmanship';
      nextRoute = { view: 'craftsmanship' };
    } else if (view === 'reviews') {
      newPath = '/pages/reviews';
      nextRoute = { view: 'reviews' };
    } else if (view === 'guarantee') {
      newPath = '/pages/guarantee';
      nextRoute = { view: 'guarantee' };
    } else if (view === 'about') {
      newPath = '/pages/about';
      nextRoute = { view: 'about' };
    } else {
      newPath = '/';
      nextRoute = { view: 'home' };
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onNavigate={(view, category) => navigateTo(view, { category })}
        tickerText={tickerText}
      />

      <main className="pt-20">
        {route.view === 'home' && (
          <>
            {/* Straight Down / Peter Millar Style Hero */}
            <FullscreenHero 
              heroImage={heroImage}
              onScrollToShop={() => navigateTo('collection', { category: 'polos' })}
              onScrollToWhy={() => navigateTo('craftsmanship')}
            />

            {/* Picture-Heavy Shopify Collections with Working Filters & Swatches */}
            <ShopifyCollections 
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
              }}
              onAddToCart={handleAddToCart}
              onSelectProduct={(prod) => navigateTo('product', { product: prod })}
            />

            {/* Redesigned Craftsmanship Showcase (Macro Collar Detail & $48 Math) */}
            <WhyHighDraw 
              onScrollToShop={() => navigateTo('collection', { category: 'polos' })}
            />

            {/* Real Golfer Course Reviews with Authentic Photography */}
            <UserReviews />
          </>
        )}

        {route.view === 'collection' && (
          <CollectionPage
            category={route.category}
            products={PRODUCTS}
            onSelectProduct={(prod) => navigateTo('product', { product: prod })}
            onSelectCategory={(cat) => navigateTo('collection', { category: cat })}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {route.view === 'product' && (
          <ProductDetailPage
            product={route.product}
            onBackToShop={() => navigateTo('collection', { category: route.product.category })}
            onAddToCart={handleAddToCart}
            onSelectProduct={(prod) => navigateTo('product', { product: prod })}
            allProducts={PRODUCTS}
          />
        )}

        {route.view === 'craftsmanship' && (
          <CraftsmanshipPage
            onBackToHome={() => navigateTo('home')}
            onGoToShop={() => navigateTo('collection', { category: 'polos' })}
          />
        )}

        {route.view === 'reviews' && (
          <ReviewsPage
            onBackToHome={() => navigateTo('home')}
            onGoToShop={() => navigateTo('collection', { category: 'polos' })}
          />
        )}

        {route.view === 'guarantee' && (
          <GuaranteePage
            onBackToHome={() => navigateTo('home')}
            onGoToShop={() => navigateTo('collection', { category: 'polos' })}
          />
        )}

        {route.view === 'about' && (
          <AboutPage
            onBackToHome={() => navigateTo('home')}
            onGoToShop={() => navigateTo('collection', { category: 'polos' })}
          />
        )}
      </main>

      {/* Fully Functional Footer with Policy Modals & Discrete Admin Link */}
      <Footer 
        onNavigate={(view, category) => navigateTo(view, { category })}
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
