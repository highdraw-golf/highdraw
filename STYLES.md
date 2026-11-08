# STYLES.md — High Draw Golf Design System & Accént Motion 1.0

## 1. Brand Identity & Color Philosophy
High Draw Golf Co. operates on honest, tour-grade apparel engineering without the \$120 boutique retail markup.
- **Canvas / Background**: `#FFFFFF` / Surface `#F8F9FA` / Editorial Dark `#15191E` & `#090C10`
- **Primary Ink**: `#090C10` (Dark obsidian charcoal text, never harsh `#000000`)
- **Heritage Green (Clubhouse)**: `#1C2C24`
- **Tour Crimson**: `#B12535`
- **Cyan Tracer (Apex Flight)**: `#38BDF8` / `#00A3FF`
- **Championship Gold**: `#D4AF37` / `#E5A900`
- **Rule Lines**: `#E2E8F0` / Hairline `1px` borders

---

## 2. Typography Rules
- **Display / Editorial Headings**: `font-serif` (`Domine`, Georgia, serif)
- **Body & Functional UI**: `font-sans` (`Inter`, -apple-system, BlinkMacSystemFont, sans-serif)
- **Technical Specs & Currency**: `font-mono` (tabular numerals for prices, GSM, Handicaps)

---

## 3. Accént Motion 1.0 Baseline Invariants (Layer 1)
All animations across High Draw Golf adhere strictly to the 5 mathematical invariants of Accént Motion 1.0:

1. **GPU-Safe Properties Only**:
   - Animate ONLY `transform` (`scale`, `translate`, `rotate`), `opacity`, and `clipPath`.
   - Never animate `width`, `height`, `margin`, `padding`, `top`, or `left` (causes layout thrashing).
2. **Zero-Layout-Shift Bundle (`LazyMotion`)**:
   - Application root wrapped in `<MotionProvider>` using `LazyMotion` with `domAnimation` (~16 KB lightweight footprint).
3. **Mandatory `prefers-reduced-motion` Safety**:
   - All spatial motion (parallax, translation, spring travel) collapses to a gentle 200ms opacity fade when `isReduced` is active.
   - Global stylesheet includes `@media (prefers-reduced-motion: reduce)` hard stop.
4. **Ergonomic Micro-Physics (Tier 1 CSS + Tokens)**:
   - `--duration-fast`: `120ms`
   - `--duration-base`: `200ms`
   - `--duration-slow`: `320ms`
   - `--ease-accent`: `cubic-bezier(0.16, 1, 0.3, 1)`
   - `--ease-editorial`: `cubic-bezier(0.22, 1, 0.36, 1)`
   - Utilities: `.t-press` (`active:scale-[0.97]`), `.t-color` (`200ms`), `.link-swipe` (`editorial 350ms wipe`).
5. **No Perpetual Distraction**:
   - All scroll choreography sets `viewport={{ once: true }}` so elements settle into calm authority.

---

## 4. Tier 2 Editorial Choreography Primitives
- `<RiseLines />`: Line-by-line masked rise (`y: 110% -> 0%`, 0.9s, `cubic-bezier(0.22, 1, 0.36, 1)`, 80ms stagger). Used on hero headlines.
- `<FadeUp />`: Soft 20px settle (`0.75s`, `cubic-bezier(0.22, 1, 0.36, 1)`). Used on subheadlines and CTA buttons.
- `<Hairline />`: Left-origin horizontal rule expansion (`scaleX: 0 -> 1`). Used on section dividers.
- `<Stagger />` & `<StaggerItem />`: Coordinated card grid stagger (50ms child stagger).

---

## 5. Tier 3 Custom Motion Dialect & Domain Primitives (`customExtension`)
High Draw Golf introduces domain-specific motion primitives tailored to golf physics, checkout reassurance, and technical collar memory:

### 1. `StripeSecurityBeacon` (`<StripeSecurityBeacon amount={total} />`)
- **Purpose**: Instills military-grade confidence on checkout and payment surfaces (Cart Drawer and Checkout Modals).
- **Physics**: Soft entrance via `EASE_ACCENT` (320ms), with a subtle 2.2s breathing radar ring around the Stripe Level 1 security indicator.
- **Reduced Motion**: Ring pulse turns off, displaying a calm static encrypted badge.

### 2. `BallFlightReveal` (`<BallFlightReveal />`)
- **Purpose**: Simulates the signature High Draw golf ball trajectory (subtle low-to-high arc with soft apex settle).
- **Physics**: Uses `SPRING_BALL_FLIGHT` (`stiffness: 280`, `damping: 24`, `mass: 0.8`) with `rotate: -3deg -> 0deg` and `x: -16px -> 0px`.

### 3. `StayFlatCollarBadge` (`<StayFlatCollarBadge />`)
- **Purpose**: Interactive reassurance badge for the 100+ Fairway Wash Guarantee.
- **Physics**: Uses `SPRING_STAY_FLAT` (`stiffness: 450`, `damping: 38`) for firm, zero-wobble return to form.

---

## 6. Colophon & Ecosystem Credits
- Motion engine powered by **Accént Motion 1.0** (`https://design.pipes.pink/foundations/motion` · `https://github.com/rorshockbtc/accent-ui`).
- Upstream governance: `rorshockbtc/accent-ui`.
