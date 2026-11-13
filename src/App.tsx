import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { FullscreenHero } from './components/FullscreenHero';
import { TierComparisonStrip } from './components/TierComparisonStrip';
import { ShopifyCollections } from './components/ShopifyCollections';
import { WhyHighDraw } from './components/WhyHighDraw';
import { FounderSpotlight } from './components/FounderSpotlight';
import { UserReviews } from './components/UserReviews';
import { CartDrawer } from './components/CartDrawer';
import type { CartItem, ExternalFulfillmentConfirmation } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { AdminConsole } from './components/AdminConsole';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionPage } from './pages/CollectionPage';
import { CraftsmanshipPage } from './pages/CraftsmanshipPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { GuaranteePage } from './pages/GuaranteePage';
import { AboutPage } from './pages/AboutPage';
import { LogoStudioPage } from './pages/LogoStudioPage';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { isOwnerAuthorized, lockOwnerSession } from './lib/auth';
import { resolvePrintifyFulfillment } from './lib/fulfillmentResolver';
import { fulfillStripeCheckoutSession } from './lib/stripe';
import { sendOrderNotificationEmail } from './lib/emailService';
import { PRODUCTS } from './data/products';
import type { Product } from './data/products';

type TierFilter = 'all' | 'weekender' | 'clubhouse' | 'tournament';

type ActiveRoute =
  | { view: 'home' }
  | {
      view: 'collection';
      category: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles';
      tier?: TierFilter;
    }
  | { view: 'product'; product: Product }
  | { view: 'craftsmanship' }
  | { view: 'reviews' }
  | { view: 'guarantee' }
  | { view: 'about' }
  | { view: 'logo-studio' };

const CART_STORAGE_KEY = 'highdraw_cart_v1';

function loadPersistedCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeCartUpsells(items: CartItem[]): CartItem[] {
  const hasNonHeadwear = items.some(i => !i.id.startsWith('headwear-flexfit-mesh'));
  const hasHeadwear = items.some(i => i.id.startsWith('headwear-flexfit-mesh'));
  return items.map(item => {
    if (item.id.startsWith('headwear-flexfit-mesh') && !hasNonHeadwear && item.price === 28) {
      return { ...item, price: 35 };
    }
    if (item.id.startsWith('men-polo-st740') && !hasHeadwear && item.price === 40) {
      return { ...item, price: 48 };
    }
    return item;
  });
}

function parseRouteFromLocation(): ActiveRoute {
  if (typeof window === 'undefined') return { view: 'home' };
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const queryTier = params.get('tier')?.toLowerCase();
  const validTier: TierFilter =
    queryTier === 'weekender' || queryTier === 'clubhouse' || queryTier === 'tournament'
      ? queryTier
      : 'all';

  if (path.startsWith('/products/')) {
    const slug = path.replace('/products/', '').replace(/\/$/, '').trim();
    // 1. Exact match by slug or id
    let prod = PRODUCTS.find(p => p.slug === slug || p.id === slug);

    // 2. Intent-based fuzzy fallbacks for friendly/legacy URLs
    if (!prod) {
      if (slug.includes('clubhouse') && slug.includes('women')) {
        prod = PRODUCTS.find(p => p.id === 'women-polo-lk830');
      } else if (slug.includes('clubhouse')) {
        prod = PRODUCTS.find(p => p.id === 'men-polo-k830');
      } else if (slug.includes('women')) {
        prod = PRODUCTS.find(p => p.id.includes('women') || p.slug.includes('women'));
      } else if (slug.includes('zip') || slug.includes('pullover') || slug.includes('fleece') || slug.includes('outerwear')) {
        prod = PRODUCTS.find(p => p.category === 'outerwear' || p.slug.includes('zip'));
      } else if (slug.includes('cap') || slug.includes('hat') || slug.includes('headwear')) {
        prod = PRODUCTS.find(p => p.category === 'headwear');
      } else if (slug.includes('scramble') || slug.includes('foursome') || slug.includes('bundle')) {
        prod = PRODUCTS.find(p => p.category === 'bundles');
      } else if (slug.includes('polo') || slug.includes('men')) {
        prod = PRODUCTS.find(p => p.id === 'men-polo-st740');
      }
    }

    if (prod) return { view: 'product', product: prod };
  }

  if (path.startsWith('/collections/')) {
    const seg = path.replace('/collections/', '').replace(/\/$/, '').trim();
    if (seg === 'weekender' || seg === 'clubhouse' || seg === 'tournament') {
      return { view: 'collection', category: 'all', tier: seg };
    }
    if (['all', 'polos', 'outerwear', 'headwear', 'bundles'].includes(seg)) {
      return { view: 'collection', category: seg as any, tier: validTier };
    }
    return { view: 'collection', category: 'all', tier: validTier };
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
  if (path === '/pages/logo-studio' || path === '/logo-studio') {
    return { view: 'logo-studio' };
  }

  return { view: 'home' };
}

export function App() {
  const [route, setRoute] = useState<ActiveRoute>(parseRouteFromLocation);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadPersistedCart);

  const [activeCategory, setActiveCategory] = useState<'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles'>('all');
  const [activeHomeTier, setActiveHomeTier] = useState<TierFilter>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [externalConfirmation, setExternalConfirmation] = useState<ExternalFulfillmentConfirmation | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(isOwnerAuthorized);
  const handledReturnRef = useRef(false);
  const pendingRetrySessionRef = useRef<{ sessionId: string; orderId: string } | null>(null);

  // Store Brand State (Configurable by Brand Owner via AdminConsole)
  const [tickerText, setTickerText] = useState(
    'FREE US SHIPPING OVER $75 • WEEKENDER ($48) & THE CLUBHOUSE ($66)'
  );
  const [poloPrice, setPoloPrice] = useState(48);
  const [activeBoard, setActiveBoard] = useState('Autumn Fairways');
  const [heroImage, setHeroImage] = useState('/assets/lifestyle_golf.jpg');

  // Persist shopping bag to localStorage so returning or mobile shoppers never lose items
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage quota errors
    }
  }, [cartItems]);

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
    view: 'home' | 'collection' | 'product' | 'craftsmanship' | 'reviews' | 'guarantee' | 'about' | 'logo-studio',
    opts?: {
      category?: 'all' | 'polos' | 'outerwear' | 'headwear' | 'bundles';
      tier?: TierFilter;
      product?: Product;
    }
  ) => {
    let newPath = '/';
    let nextRoute: ActiveRoute = { view: 'home' };

    if (view === 'collection') {
      const cat = opts?.category || 'all';
      const tier = opts?.tier || 'all';
      newPath = tier !== 'all' ? `/collections/${cat}?tier=${tier}` : `/collections/${cat}`;
      nextRoute = { view: 'collection', category: cat, tier };
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
    } else if (view === 'logo-studio') {
      newPath = '/pages/logo-studio';
      nextRoute = { view: 'logo-studio' };
    } else {
      newPath = '/';
      nextRoute = { view: 'home' };
    }

    const currentFull = `${window.location.pathname}${window.location.search}`;
    if (currentFull !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item: CartItem) => {
    setExternalConfirmation(null);
    setCartItems(prev => {
      const existingIdx = prev.findIndex(existing => existing.id === item.id);
      const updated =
        existingIdx > -1
          ? prev.map((existing, idx) =>
              idx === existingIdx
                ? { ...existing, quantity: (existing.quantity || 1) + (item.quantity || 1) }
                : existing
            )
          : [...prev, { ...item, quantity: item.quantity || 1 }];
      return normalizeCartUpsells(updated);
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCartItems(prev =>
      normalizeCartUpsells(
        prev
          .map((item, idx) =>
            idx === index ? { ...item, quantity: (item.quantity || 1) + delta } : item
          )
          .filter(item => (item.quantity || 1) > 0)
      )
    );
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(prev => normalizeCartUpsells(prev.filter((_, i) => i !== index)));
  };

  const runStripeSessionFulfillment = async (sessionId: string, orderId: string) => {
    setIsCartOpen(true);
    setExternalConfirmation({ status: 'verifying', orderId });

    const res = await fulfillStripeCheckoutSession(sessionId, orderId);
    if (res.fulfilled) {
      pendingRetrySessionRef.current = null;
      const itemsSnapshot = [...cartItems];
      setCartItems([]);
      await sendOrderNotificationEmail({
        orderId: res.orderId || orderId,
        customerName: res.recipientFirstName || 'High Draw Golfer',
        customerEmail: 'stripe-verified@highdrawgear.com',
        shippingAddress: res.shipSummary || 'Verified via Stripe Checkout',
        items:
          itemsSnapshot.length > 0
            ? itemsSnapshot
            : [
                {
                  name: 'Verified Stripe Checkout Order',
                  size: '-',
                  price: res.amountTotalDollars || 0,
                },
              ],
        totalAmount: res.amountTotalDollars || 0,
        printifyStatus: res.alreadyFulfilled
          ? `Already Dispatched (${res.printifyOrderId || 'Printify'})`
          : `Queued on Printify (${res.printifyOrderId || 'Printify'})`,
      });
      setExternalConfirmation({
        status: 'confirmed',
        orderId: res.orderId || orderId,
        printifyOrderId: res.printifyOrderId,
        recipientFirstName: res.recipientFirstName,
        shipSummary: res.shipSummary,
      });
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
    } else {
      setExternalConfirmation({
        status: 'error',
        orderId: res.orderId || orderId,
        errorMessage: res.error || 'Unable to verify payment and dispatch Printify order.',
      });
    }
  };

  // Handle Stripe Checkout return URL (`?payment=success&orderId=...&session_id=cs_...` or `?payment=cancelled`)
  useEffect(() => {
    if (typeof window === 'undefined' || handledReturnRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const paymentState = params.get('payment');
    if (!paymentState) return;

    handledReturnRef.current = true;
    const orderId = params.get('orderId') || `HD-${Date.now()}`;
    const sessionId = (params.get('session_id') || '').trim();

    // Immediately scrub session_id and payment params from browser history/address bar
    params.delete('payment');
    params.delete('orderId');
    params.delete('session_id');
    const remainingSearch = params.toString();
    const cleanUrl = `${window.location.pathname}${remainingSearch ? `?${remainingSearch}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', cleanUrl);

    if (paymentState === 'cancelled') {
      setIsCartOpen(true);
      return;
    }

    if (paymentState === 'success' && /^cs_(live|test)_[a-zA-Z0-9_]+$/.test(sessionId)) {
      pendingRetrySessionRef.current = { sessionId, orderId };
      void runStripeSessionFulfillment(sessionId, orderId);
    }
  }, []);

  const handleAddUpsellHat = () => {
    const resolvedCap = resolvePrintifyFulfillment({
      id: 'headwear-flexfit-mesh',
      color: 'Pure White',
      size: 'S/M',
    });
    handleAddToCart({
      id: 'headwear-flexfit-mesh-Pure White-S/M',
      name: 'The Tour Performance Poly-Mesh Cap — Pure White',
      price: 28,
      quantity: 1,
      color: 'Pure White',
      size: 'S/M',
      image: resolvedCap.officialMockupUrl || '/assets/products/bespoke/hat_hero_wood.jpg',
      sovereignSku: resolvedCap.sovereignSku,
      printifyProductId: resolvedCap.printifyProductId,
      printifyVariantId: resolvedCap.printifyVariantId,
    });
  };

  const handleSelectPipesBoard = (boardName: string, image: string) => {
    setActiveBoard(boardName);
    setHeroImage(image);
  };

  const totalBagCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const scrollToHomeTier = (tier: TierFilter) => {
    setActiveHomeTier(tier);
    setActiveCategory('all');
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1F26] selection:bg-[#B12535] selection:text-white">
      <div inert={isCartOpen || undefined}>
      {/* Header with Direct 3-Tier Navigation */}
      <Header
        cartCount={totalBagCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={(view, category, tier) => navigateTo(view, { category, tier })}
        tickerText={tickerText}
      />

      <main className="pt-28">
        {route.view === 'home' && (
          <>
            {/* Flagship Editorial Hero */}
            <FullscreenHero
              heroImage={heroImage}
              onScrollToShop={() => navigateTo('collection', { category: 'all' })}
              onShopMens={() => {
                const menPolo = PRODUCTS.find(p => p.id === 'men-polo-st740');
                if (menPolo) navigateTo('product', { product: menPolo });
                else navigateTo('collection', { category: 'polos', tier: 'weekender' });
              }}
              onShopWomens={() => {
                const womenPolo = PRODUCTS.find(p => p.id === 'women-polo-lst740');
                if (womenPolo) navigateTo('product', { product: womenPolo });
                else navigateTo('collection', { category: 'polos', tier: 'weekender' });
              }}
              onShopClubhouse={() => {
                const clubhousePolo = PRODUCTS.find(p => p.id === 'men-polo-k830');
                if (clubhousePolo) navigateTo('product', { product: clubhousePolo });
                else navigateTo('collection', { category: 'all', tier: 'clubhouse' });
              }}
              onScrollToWhy={() => navigateTo('craftsmanship')}
            />

            {/* 3-Tier Architecture Showcase Strip */}
            <TierComparisonStrip
              onExploreTier={tier => scrollToHomeTier(tier)}
              onSelectWeekenderPolo={() => {
                const p = PRODUCTS.find(item => item.id === 'men-polo-st740');
                if (p) navigateTo('product', { product: p });
              }}
              onSelectClubhousePolo={() => {
                const p = PRODUCTS.find(item => item.id === 'men-polo-k830');
                if (p) navigateTo('product', { product: p });
              }}
            />

            {/* Picture-Heavy Collections with Working Tier + Category Filters & Swatches */}
            <ShopifyCollections
              activeCategory={activeCategory}
              onSelectCategory={cat => setActiveCategory(cat)}
              activeTier={activeHomeTier}
              onSelectTier={tier => setActiveHomeTier(tier)}
              onAddToCart={handleAddToCart}
              onSelectProduct={prod => navigateTo('product', { product: prod })}
            />

            {/* Craftsmanship Showcase (Macro Collar Detail & Direct Pricing Math) */}
            <WhyHighDraw
              onScrollToShop={() => navigateTo('collection', { category: 'polos' })}
            />

            {/* Authentic Co-Founder Spotlight (Dr. Ken Cyree & 47-State Fairways) */}
            <FounderSpotlight
              onLearnMore={() => navigateTo('about')}
              onShopNow={() => navigateTo('collection', { category: 'polos' })}
            />

            {/* Real Golfer Course Reviews */}
            <UserReviews />
          </>
        )}

        {route.view === 'collection' && (
          <CollectionPage
            category={route.category}
            initialTier={route.tier || 'all'}
            products={PRODUCTS}
            onSelectProduct={prod => navigateTo('product', { product: prod })}
            onSelectCategory={(cat, tier) => navigateTo('collection', { category: cat, tier })}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {route.view === 'product' && (
          <ProductDetailPage
            key={route.product.id}
            product={route.product}
            onBackToShop={() =>
              navigateTo('collection', {
                category: route.product.category,
                tier:
                  route.product.tier === 'weekender' ||
                  route.product.tier === 'clubhouse' ||
                  route.product.tier === 'tournament'
                    ? route.product.tier
                    : 'all',
              })
            }
            onAddToCart={handleAddToCart}
            onSelectProduct={prod => navigateTo('product', { product: prod })}
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

        {route.view === 'logo-studio' && (
          isOwnerAuthenticated ? (
            <LogoStudioPage
              onBackToHome={() => navigateTo('home')}
              onLock={() => {
                lockOwnerSession();
                setIsOwnerAuthenticated(false);
                navigateTo('home');
              }}
            />
          ) : (
            <div className="min-h-[70vh] flex items-center justify-center bg-[#1C2C24] px-4 py-20">
              <OwnerAuthModal
                isOpen={true}
                title="Logo Studio — Brand Asset Protection"
                description="High Draw vector SVG and master PNG files are proprietary assets. Please enter the Owner PIN to access the Logo Studio."
                onClose={() => navigateTo('home')}
                onSuccess={() => setIsOwnerAuthenticated(true)}
              />
            </div>
          )
        )}
      </main>

      {/* Fully Functional Footer with Policy Modals & Discrete Admin Link */}
      <Footer
        onNavigate={(view, category) => navigateTo(view, { category })}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
      </div>

      {/* Owner Command Center Modal */}
      {isAdminOpen && (
        isOwnerAuthenticated ? (
          <AdminConsole
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onLock={() => {
              lockOwnerSession();
              setIsOwnerAuthenticated(false);
              setIsAdminOpen(false);
            }}
            tickerText={tickerText}
            onUpdateTicker={setTickerText}
            activeBoard={activeBoard}
            onSelectBoard={handleSelectPipesBoard}
            poloPrice={poloPrice}
            onUpdatePrice={setPoloPrice}
          />
        ) : (
          <OwnerAuthModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onSuccess={() => setIsOwnerAuthenticated(true)}
          />
        )
      )}

      {/* Interactive Cart Drawer with Persistence, Stepper & Free Shipping Bar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCartItems([])}
        onAddUpsellHat={handleAddUpsellHat}
        externalConfirmation={externalConfirmation}
        onClearExternalConfirmation={() => setExternalConfirmation(null)}
        onRetryExternalFulfillment={
          pendingRetrySessionRef.current
            ? () => {
                const pending = pendingRetrySessionRef.current;
                if (pending) void runStripeSessionFulfillment(pending.sessionId, pending.orderId);
              }
            : undefined
        }
      />
    </div>
  );
}

export default App;
