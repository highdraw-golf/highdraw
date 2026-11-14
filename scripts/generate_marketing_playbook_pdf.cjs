const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');
const brainDir = path.join(
  os.homedir(),
  '.gemini/antigravity/brain/b6b677d3-5fc5-4227-8755-1b0a3091bbb4'
);
const desktopDir = path.join(os.homedir(), 'Desktop');

function loadImageDataUri(fileName) {
  const fullPath = path.join(brainDir, fileName);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required screenshot exhibit for PDF: ${fullPath}`);
  }
  const b64 = fs.readFileSync(fullPath).toString('base64');
  return `data:image/png;base64,${b64}`;
}

async function generatePdf() {
  const pairCartUri = loadImageDataUri('verify_10_two_polo_pair_cart.png');
  const overviewChartUri = loadImageDataUri('mktg_01_overview_charts.png');
  const experimentsUri = loadImageDataUri('mktg_02_experiments_verdicts.png');
  const outreachMapUri = loadImageDataUri('mktg_03_outreach_us_map.png');
  const fbStudioUri = loadImageDataUri('mktg_04_fb_studio_qr.png');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>High Draw Golf Co. — Start-Small ($200/Month) Marketing Playbook &amp; Command Center Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: letter;
    margin: 22mm 19mm 23mm 19mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.66;
    font-size: 9.8pt;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: #0f172a;
    font-weight: 700;
    line-height: 1.22;
    margin-top: 0;
  }

  h1 { font-size: 26pt; margin-bottom: 8pt; letter-spacing: -0.02em; }
  h2 { font-size: 16.5pt; margin-bottom: 9pt; margin-top: 18pt; border-bottom: 1.5pt solid #0f172a; padding-bottom: 4pt; color: #0f172a; }
  h3 { font-size: 12.5pt; margin-bottom: 5pt; margin-top: 13pt; color: #1c2c24; }
  h4 { font-size: 8.8pt; margin-bottom: 4pt; margin-top: 10pt; font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #334155; }

  p {
    margin-top: 0;
    margin-bottom: 9.5pt;
    color: #1e293b;
  }

  ul, ol {
    margin: 0 0 10pt 0;
    padding-left: 16pt;
  }

  li {
    margin-bottom: 4pt;
  }

  .page-break {
    page-break-before: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  /* Cover Page */
  .cover-page {
    min-height: 8.8in;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10pt 4pt 8pt 4pt;
    page-break-after: always;
  }

  .chb-brandmark {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2.5pt solid #0f172a;
    padding-bottom: 11pt;
  }

  .chb-left {
    display: flex;
    align-items: center;
    gap: 11pt;
  }

  .chb-symbol {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 19pt;
    background: #0f172a;
    color: #ffffff;
    padding: 4pt 9pt;
    border-radius: 4pt;
    letter-spacing: -0.05em;
  }

  .chb-meta {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #475569;
    font-weight: 600;
  }

  .hbr-case-id {
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    color: #475569;
  }

  .cover-title-area {
    margin-top: 20pt;
    margin-bottom: 14pt;
  }

  .doc-tag {
    display: inline-block;
    background: #1c2c24;
    color: #fde022;
    font-size: 7.8pt;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 4pt 9pt;
    border-radius: 3pt;
    margin-bottom: 11pt;
  }

  .cover-subtitle {
    font-size: 11pt;
    color: #334155;
    line-height: 1.58;
    max-width: 98%;
    margin-top: 8pt;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }

  .abstract-box {
    background: #f8fafc;
    border-top: 2pt solid #1c2c24;
    border-bottom: 2pt solid #1c2c24;
    padding: 13pt 16pt;
    margin-top: 14pt;
  }

  .abstract-title {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #1c2c24;
    margin-bottom: 5pt;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 11pt;
    background: #ffffff;
    border: 1pt solid #cbd5e1;
    border-radius: 6pt;
    padding: 11pt 15pt;
    margin-top: 14pt;
  }

  .meta-item-label {
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 2pt;
  }

  .meta-item-val {
    font-size: 9pt;
    color: #0f172a;
    font-weight: 700;
  }

  .cover-footer {
    border-top: 1pt solid #cbd5e1;
    padding-top: 8pt;
    display: flex;
    justify-content: space-between;
    font-size: 7.8pt;
    color: #64748b;
  }

  /* Callouts & Cards */
  .callout {
    background: #f8fafc;
    border-left: 4pt solid #1c2c24;
    padding: 10pt 14pt;
    margin: 11pt 0;
    border-radius: 0 5pt 5pt 0;
  }

  .callout-gold {
    background: #fffbeb;
    border-left: 4pt solid #d97706;
  }

  .callout-blue {
    background: #f0f9ff;
    border-left: 4pt solid #0284c7;
  }

  .callout-red {
    background: #fef2f2;
    border-left: 4pt solid #b91c1c;
  }

  .callout-title {
    font-family: 'Inter', sans-serif;
    font-size: 8.6pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 3pt;
    color: #0f172a;
  }

  .calc-box {
    background: #0f172a;
    color: #f8fafc;
    border-radius: 6pt;
    padding: 11pt 15pt;
    margin: 11pt 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.3pt;
    line-height: 1.55;
  }

  .calc-box-title {
    color: #38bdf8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 7.8pt;
    margin-bottom: 5pt;
    border-bottom: 0.5pt solid #334155;
    padding-bottom: 4pt;
  }

  .glossary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10pt;
    margin: 10pt 0;
  }

  .glossary-card {
    background: #f8fafc;
    border: 1pt solid #cbd5e1;
    border-radius: 6pt;
    padding: 10pt 12pt;
  }

  .glossary-term {
    font-weight: 700;
    font-size: 9pt;
    color: #1c2c24;
    margin-bottom: 3pt;
  }

  .glossary-def {
    font-size: 8.4pt;
    color: #334155;
    line-height: 1.48;
    margin: 0;
  }

  .exhibit-header {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1c2c24;
    margin-top: 12pt;
    margin-bottom: 2pt;
  }

  .exhibit-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 12pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 5pt;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 5pt 0 12pt 0;
    font-size: 8.3pt;
  }

  th, td {
    padding: 6pt 7pt;
    text-align: left;
    border-bottom: 1pt solid #cbd5e1;
    vertical-align: top;
    line-height: 1.4;
  }

  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-top: 1.5pt solid #0f172a;
    border-bottom: 1.5pt solid #0f172a;
  }

  tr:nth-child(even) td {
    background-color: #fafafa;
  }

  .num {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    white-space: nowrap;
  }

  .figure-box {
    border: 1pt solid #cbd5e1;
    border-radius: 6pt;
    background: #ffffff;
    padding: 8pt;
    margin: 9pt 0 12pt 0;
  }

  .figure-box img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 4pt;
    border: 0.5pt solid #e2e8f0;
  }

  .figure-caption {
    margin-top: 5pt;
    font-size: 7.9pt;
    color: #475569;
    font-family: 'Inter', sans-serif;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.3pt;
    background: #f1f5f9;
    padding: 1pt 4pt;
    border-radius: 3pt;
    color: #0f172a;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div>
    <div class="chb-brandmark">
      <div class="chb-left">
        <div class="chb-symbol">:-]</div>
        <div class="chb-meta">
          Colon Hyphen Bracket Advisory<br>
          Digital Growth &amp; Unit Economics Briefing
        </div>
      </div>
      <div class="hbr-case-id">
        CASE REF: CHB-2026-HDG-MKT<br>
        EDITION: MONTH 1 START-SMALL OS
      </div>
    </div>

    <div class="cover-title-area">
      <div class="doc-tag">For Dr. Ken Cyree &bull; High Draw Golf Co.</div>
      <h1>Start Small, Measure Everything:<br>The $200/Month High Draw Marketing Playbook</h1>
      <p class="cover-subtitle">
        A plain-English blueprint for launching High Draw’s first disciplined marketing tests on a $150–$250 monthly budget, paired with the new automatic <strong>2-Polo Pair ($86 Free Shipping)</strong> conversion hook and your PIN-protected, cloud-synced <strong>Central Marketing Command Center</strong>.
      </p>
    </div>

    <div class="abstract-box">
      <div class="abstract-title">Executive Thesis — Why This Works Before Spending Real Money</div>
      <p style="margin-bottom:0;">
        High Draw currently has zero marketing data. On a single $48 Weekender polo (+$8 shipping), our net cash margin before advertising is only <strong>$21.79</strong> — meaning cold Facebook ads promoting a single shirt almost always lose money because acquiring a stranger online typically costs $25–$40. To protect Ken’s capital before running a single ad, we upgraded the website and Stripe Checkout so any two polos automatically become a <strong>2-Polo Pair (-$5/shirt + Free US Shipping = $86)</strong>, doubling safe ad headroom to <strong>$36.51–$46.99 per order</strong>. Paired with a single $10/day 15-day Facebook Sales test ($150) and two seeded physical samples ($44), every dollar and hour is automatically graded <strong>SCALE</strong>, <strong>ITERATE</strong>, <strong>FOLLOW UP</strong>, or <strong>KILL</strong> inside <code>highdrawgear.com/admin/marketing</code>.
      </p>
    </div>

    <div class="cover-meta-grid">
      <div>
        <div class="meta-item-label">Month 1 Capital Cap</div>
        <div class="meta-item-val">$150 – $250 ($200 Rec.)</div>
      </div>
      <div>
        <div class="meta-item-label">Founder Time Load</div>
        <div class="meta-item-val">4.5 Hours / Week</div>
      </div>
      <div>
        <div class="meta-item-label">Category Positioning</div>
        <div class="meta-item-val">Tour-Grade Work-to-Course</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <span>Prepared for Dr. Ken Cyree, Lori Cyree &amp; Kyle Cyree</span>
    <span>www.highdrawgear.com/admin/marketing</span>
  </div>
</div>

<!-- SECTION 1: MACRO INDUSTRY & CATEGORY ANALYSIS -->
<h2>1. Industry Review: The Made-to-Order &amp; DTC Golf Apparel Shift</h2>
<p>
  Over the last decade, the golf apparel landscape underwent a structural transformation. Understanding these industry shifts reveals exactly why High Draw’s operational model is uniquely positioned for capital efficiency:
</p>

<div class="glossary-grid">
  <div class="glossary-card">
    <div class="glossary-term">1. The $125 Pro-Shop "Markup Fatigue"</div>
    <p class="glossary-def">
      Legacy resort brands (Peter Millar, Greyson, RLX) pushed polo prices from $85 up to $115–$145. Core golfers who play 20+ rounds a year have developed acute markup fatigue and actively seek challenger brands offering identical micro-pique drape without paying a 300% resort markup.
    </p>
  </div>
  <div class="glossary-card">
    <div class="glossary-term">2. On-Demand Just-in-Time Manufacturing</div>
    <p class="glossary-def">
      Historically, launching a golf label required a $40,000–$75,000 offshore bulk order (1,500 units min.) that sat in a garage. Mismatched sizing curves (excess S or 3XL) bled cash. High Draw’s zero-inventory print-and-embroider model eliminates dead stock and delivers immediate positive cash flow.
    </p>
  </div>
  <div class="glossary-card">
    <div class="glossary-term">3. Post-2020 "Work-to-Course" Dressing</div>
    <p class="glossary-def">
      Hybrid corporate culture permanently established performance pique polos as everyday business attire. High Draw’s restrained 2.25" tonal chest embroidery and classic solids ("Take Play to Work") bridge the boardroom and fairway seamlessly.
    </p>
  </div>
  <div class="glossary-card">
    <div class="glossary-term">4. The Grassroots Seeding Multiplier</div>
    <p class="glossary-def">
      DTC brands can no longer rely purely on paid social ads due to rising digital customer acquisition costs. Modern winners ignite momentum by putting physical shirts on influential foursome buddies and scramble organizers, turning every round into a living trunk show.
    </p>
  </div>
</div>

<!-- SECTION 2: COMPETITIVE LANDSCAPE -->
<h2>2. Competitive Landscape &amp; Positioning Matrix</h2>
<p>
  The golf apparel market is segregated into four clear tiers. High Draw enters as a disciplined value-luxury bridge:
</p>

<div class="exhibit-header">Exhibit 1 — Market Segmentation &amp; Competitive Tiers</div>
<table>
  <thead>
    <tr>
      <th>Market Tier</th>
      <th>Key Players</th>
      <th>Price Point</th>
      <th>Vulnerabilities &amp; Market Gaps</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Legacy Luxury Pro-Shop</strong></td>
      <td>Peter Millar, Greyson, Holderness &amp; Bourne, G/FORE</td>
      <td class="num">$115 – $145</td>
      <td>Priced out of everyday 2-shirt rotation purchases; reliant on exclusive green-grass accounts.</td>
    </tr>
    <tr>
      <td><strong>2. Modern DTC Challengers</strong></td>
      <td>Rhoback, Bad Birdie, Swannies, Criquet</td>
      <td class="num">$84 – $98</td>
      <td>Rhoback is creeping toward $100; Bad Birdie leans into loud Hawaiian prints unwearable at traditional clubs or offices.</td>
    </tr>
    <tr>
      <td><strong>3. Athletic Value / Modern Direct</strong></td>
      <td><strong>★ HIGH DRAW GOLF ★</strong>, Primo Golf, Sunday Swagger</td>
      <td class="num">$48 – $66<br>($86 Pair)</td>
      <td>High Draw’s sweet spot: tour-grade 180 GSM micro-pique &amp; structured collar at half the pro-shop price.</td>
    </tr>
    <tr>
      <td><strong>4. Big-Box Commodity</strong></td>
      <td>Amazon Generics, Walter Hagen (Dick's), Target</td>
      <td class="num">$25 – $40</td>
      <td>Flimsy ribbed collars that curl after 2 washes; boxy cuts; zero brand cachet or prestige.</td>
    </tr>
  </tbody>
</table>

<!-- SECTION 3: COURSE SEGMENTATION TRADEOFFS -->
<h2>3. Course Segmentation Tradeoffs: Private vs. High-End Public</h2>
<p>
  How High Draw frames its message across different course environments determines ad conversion and brand perception:
</p>

<div class="exhibit-header">Exhibit 2 — Positioning Across Course Environments</div>
<table>
  <thead>
    <tr>
      <th>Course Environment</th>
      <th>Golfer Psychology &amp; Preferences</th>
      <th>Ad &amp; Outreach Conversion Dynamics</th>
      <th>High Draw Strategic Play</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Exclusive Private / Country Club</strong></td>
      <td>Traditional, status-conscious, logo-protective. Members charge shirts with their *own* club crest to member accounts. Reject humor or loud prints.</td>
      <td>Cold ad conversion is low without social proof. High conversion via <strong>1-to-1 sample gifting to outing chairs &amp; club pros</strong>.</td>
      <td>Pitch the <strong>Saturday Foursome Kit ($160)</strong> or custom crest packages for member-guest gifts and charity scrambles.</td>
    </tr>
    <tr>
      <td><strong>High-End Daily Fee / Municipal</strong></td>
      <td>Value-aware, plays 10–25 rounds/year. Buys online or at PGA Tour Superstore. Considers $125 shirts an overpriced markup.</td>
      <td>Extremely receptive to digital offer hooks (e.g. <strong>"2-Polo Pair $86 Free Shipping"</strong>) and founder direct-to-consumer savings.</td>
      <td>Primary target for <strong>Meta Facebook Ads ($10/day)</strong> using the "Two Tour Polos for $86" and "3.8-Index Founder Fit" ad angles.</td>
    </tr>
  </tbody>
</table>

<div class="callout callout-gold avoid-break">
  <div class="callout-title">The Strategic Sweet Spot: "The Transitional Modern Player"</div>
  <p style="margin-bottom:0;">
    High Draw should neither position itself as a pretentious private-club snob label nor as a discount commodity shirt. The winning posture is: <strong>"Tour-grade collar engineering and micro-pique drape for serious golfers who refuse to pay a $125 retail gouge."</strong>
  </p>
</div>

<!-- SECTION 4: REAL-WORLD AD SCHEDULING & AD CONSIDERATIONS -->
<div class="page-break"></div>
<h2>4. Facebook Ad Flighting, Seasonality &amp; Real-World Factors</h2>

<h3>Best Days to Advertise: Behavioral Purchasing Patterns</h3>
<ul>
  <li><strong>Thursday Evening &rarr; Friday Afternoon (High Planning Intent):</strong> Golfers make weekend tee times, check weather, message foursome group chats, and scroll social feeds. Cognitive proximity to golf peaks.</li>
  <li><strong>Sunday 4:00 PM &rarr; 10:00 PM (Peak Checkout Window):</strong> The single highest converting e-commerce window. Having just played 18 holes, golfers relax on the couch, reflecting on poor-fitting or worn-out shirts.</li>
  <li><strong>Algorithmic Continuous Delivery Rule:</strong> While purchase intent peaks Thu–Sun, <strong>do not manually pause campaigns on Monday mornings</strong>. Pausing resets Meta’s machine learning auction loop. Instead, run the $10/day sprint <em>continuously for 15 days</em>, starting on a <strong>Thursday at 6:00 AM</strong> so initial optimization happens during peak intent.</li>
</ul>

<h3>Real-World Environmental &amp; Operational Factors</h3>
<div class="glossary-grid">
  <div class="glossary-card">
    <div class="glossary-term">Winter Seasonality &amp; Sunbelt Geo-Fencing</div>
    <p class="glossary-def">
      Between November and March, northern courses are frozen. In Meta Ads Manager, restrict geographic delivery strictly to active year-round golf states: <strong>Florida, Georgia, Texas, Arizona, California, the Carolinas, Alabama, and Mississippi</strong>.
    </p>
  </div>
  <div class="glossary-card">
    <div class="glossary-term">Core Size Curve Concentration (L &amp; XL)</div>
    <p class="glossary-def">
      Golfers aged 35–65 overwhelmingly wear <strong>Large (42–44") and XL (46–48")</strong>. Medium is steady, while Small and 3XL represent less than 12% of total demand. Focus all ad imagery and sample inventory on Men’s Large in core evergreen colorways (Navy, White, Black, Carolina Blue).
    </p>
  </div>
</div>

<!-- SECTION 5: CHALLENGER BENCHMARKS -->
<h2>5. What Successful Challenger Golf Brands Actually Did</h2>
<p>
  Every independent golf apparel brand that broke into the $10M–$100M tier started without big agency retainers or PGA Tour patch sponsorships. Their early traction came from matching high-margin bundle offers with relentless grassroots proof and tight attribution.
</p>

<div class="exhibit-header">Exhibit 3 — Challenger Golf Growth Playbook Comparison</div>
<div class="exhibit-title">How Modern Golf Labels Earned Early Orders Without Burning Cash</div>
<table>
  <thead>
    <tr>
      <th>Challenger Brand</th>
      <th>Early Move That Worked</th>
      <th>What Failed / Wasted Cash</th>
      <th>High Draw $200/mo Application</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Holderness &amp; Bourne</strong></td>
      <td>Hand-delivered trunk shows and 1-to-1 sample shirts to respected club amateurs and tournament directors to prove structured collar fit.</td>
      <td>Polished magazine-style graphics without close-up collar and fabric motion performed poorly in cold feeds.</td>
      <td>Ken gives <strong>2 wholesale Size L sample polos/month</strong> ($21.50 ea) to warm scramble chairs &amp; club connectors.</td>
    </tr>
    <tr>
      <td><strong>Rhoback</strong></td>
      <td>Seeded shirts to small 3k–20k follower golf creators and weekend foursome buddies with unique personal promo codes.</td>
      <td>Gifting shirts without a trackable promo code or 7-day follow-up left them blind on what actually drove orders.</td>
      <td>Every sample logged in Command Center CRM gets a live Stripe code (e.g. <code>KEN15</code>) + automatic <strong>7-day Follow-Up</strong> flag.</td>
    </tr>
    <tr>
      <td><strong>Primo Golf</strong></td>
      <td>Raw 30-second iPhone videos from the founder holding the garment, calling out "$125 pro-shop markups" side-by-side.</td>
      <td>Sending cold paid traffic to a $48 single item stalls because shipping costs and low AOV squeeze net margin below Facebook CPMs.</td>
      <td>Phone clips of Ken explaining the <strong>3.8-index fit + $86 2-Polo Pair</strong> keep creative cost at $0 while raising AOV.</td>
    </tr>
    <tr>
      <td><strong>Criquet &amp; Swannies</strong></td>
      <td>Sold multi-unit tournament &amp; alumni packages (24–48 shirts) around crisp left-chest embroidery and classic colors.</td>
      <td>Cold-calling 200 random head pros instead of working warm university, business school, and charity networks first.</td>
      <td>Ken spends <strong>2 hrs/week</strong> messaging warm Ole Miss, academic, and civic charity outing leads — zero ad spend.</td>
    </tr>
  </tbody>
</table>

<!-- SECTION 6: MULTI-STAGE REVENUE EXPECTATIONS -->
<div class="page-break"></div>
<h2>6. Multi-Stage Revenue Expectations &amp; Growth Milestones</h2>
<p>
  Because High Draw operates on a disciplined self-funding model without venture capital burn, revenue growth follows an <strong>operational staircase</strong>:
</p>

<div class="exhibit-header">Exhibit 4 — High Draw Growth &amp; Profit Milestones (12–24 Month Outlook)</div>
<table>
  <thead>
    <tr>
      <th>Growth Stage</th>
      <th>Timeline</th>
      <th>Monthly Volume</th>
      <th>Gross Sales</th>
      <th>Mktg Outlay</th>
      <th>Net Cash Profit</th>
      <th>Key Milestone Trigger</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Phase 1: Lean Validation</strong></td>
      <td>Months 1–3</td>
      <td class="num">12 – 25 shirts</td>
      <td class="num">$600 – $1,250</td>
      <td class="num">$150 – $200</td>
      <td class="num">+$100 to +$320</td>
      <td>Prove $86 Pair conversion; validate 3 ad angles; close 1st buddy scramble order.</td>
    </tr>
    <tr>
      <td><strong>Phase 2: Grassroots Momentum</strong></td>
      <td>Months 4–6</td>
      <td class="num">35 – 70 shirts</td>
      <td class="num">$1,800 – $3,600</td>
      <td class="num">$300 – $500</td>
      <td class="num">+$450 to +$1,000</td>
      <td>Reach 100-shirt milestone; unlock bulk blank pricing (+$5/shirt margin jump).</td>
    </tr>
    <tr>
      <td><strong>Phase 3: Tournament &amp; Scramble Scale</strong></td>
      <td>Months 7–12</td>
      <td class="num">100 – 250 shirts</td>
      <td class="num">$5,000 – $13,000</td>
      <td class="num">$800 – $1,500</td>
      <td class="num">+$1,400 to +$4,300</td>
      <td>Land 2–3 recurring alumni outings / charity tournaments (24–48 shirts each).</td>
    </tr>
    <tr>
      <td><strong>Phase 4: Mature Regional Brand</strong></td>
      <td>Year 2</td>
      <td class="num">300 – 600 shirts</td>
      <td class="num">$16,000 – $32,000</td>
      <td class="num">$2,500 – $4,500</td>
      <td class="num">+$5,000 to +$10,500/mo</td>
      <td>Custom woven neck-tags; expansion into Sunbelt club pro-shop tournament consignment.</td>
    </tr>
  </tbody>
</table>

<!-- SECTION 7: UNIT ECONOMICS & 2-POLO PAIR HOOK -->
<h2>7. Why We Shipped the Automatic &ldquo;2-Polo Pair ($86)&rdquo; Hook</h2>
<p>
  Because a single shirt pays $5.50+ in Printify postage while carrying Stripe’s $0.30 base fee and single-item ad acquisition cost, convincing a cold Facebook shopper to buy <strong>2 polos instead of 1</strong> transforms our unit economics overnight.
</p>

<div class="exhibit-header">Exhibit 5 — High Draw Per-Order Contribution Margin (CM1)</div>
<div class="exhibit-title">Safe Advertising Room Before Losing Cash (Live Catalog Pricing)</div>
<table>
  <thead>
    <tr>
      <th>Cart Configuration</th>
      <th>Checkout Revenue</th>
      <th>Printify Blank + Postage</th>
      <th>Stripe Fee</th>
      <th>Max Safe CAC (CM1)</th>
      <th>Strategic Verdict</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1&times; Weekender Tour Polo + Ship</td>
      <td class="num">$56.00</td>
      <td class="num">$32.28</td>
      <td class="num">$1.93</td>
      <td class="num">$21.79</td>
      <td>Too tight for cold Facebook ads ($28–$40 avg CPA).</td>
    </tr>
    <tr>
      <td><strong>2-Polo Tour Pair (-$10 + Free Ship)</strong></td>
      <td class="num">$86.00</td>
      <td class="num">$46.70</td>
      <td class="num">$2.79</td>
      <td class="num">$36.51</td>
      <td><strong>Workhorse Facebook Offer (+68% more CAC headroom).</strong></td>
    </tr>
    <tr>
      <td><strong>Mixed Tour + Clubhouse Pair</strong></td>
      <td class="num">$104.00</td>
      <td class="num">$53.69</td>
      <td class="num">$3.32</td>
      <td class="num">$46.99</td>
      <td><strong>High-margin upgrade path across men’s &amp; women’s cuts.</strong></td>
    </tr>
    <tr>
      <td><strong>Saturday Foursome Scramble Kit</strong></td>
      <td class="num">$160.00</td>
      <td class="num">$95.55</td>
      <td class="num">$4.94</td>
      <td class="num">$59.51</td>
      <td>Highest dollar cash contribution; ideal for buddy &amp; outing pitches.</td>
    </tr>
  </tbody>
</table>

<div class="figure-box avoid-break">
  <img src="${pairCartUri}" alt="High Draw Cart Drawer showing automatic 2-Polo Pair discount (-$10) and $86 Free US Shipping" />
  <div class="figure-caption">
    <strong>Exhibit 6 (Verified Staging Build):</strong> When any shopper mixes two Weekender or Clubhouse polos (men’s or women’s), High Draw’s Cart Drawer and Stripe Checkout automatically apply <code>-$5/polo</code> (-$10 total) and unlock <strong>Free US Shipping</strong> at $86 — with zero coupon friction required.
  </div>
</div>

<!-- SECTION 8: MONTH 1 BUDGET & WEEKLY TIME -->
<div class="page-break"></div>
<h2>8. Month 1 Budget Plan ($150–$250) &amp; Founder Weekly Cadence</h2>
<p>
  With a recommended Month 1 ceiling of <strong>$200</strong> (adjustable inside the Command Center from $150 to $1,000), every dollar goes into one of three capital-efficient buckets:
</p>

<div class="exhibit-header">Exhibit 7 — Month 1 Allocation Tiers ($150 Minimum, $200 Recommended, $250 Cap)</div>
<table>
  <thead>
    <tr>
      <th>Allocation Bucket</th>
      <th>$150 Lean Tier</th>
      <th>$200 Recommended</th>
      <th>$250 Stretch Tier</th>
      <th>Operational Goal</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Facebook Ads Sales Sprint</strong></td>
      <td class="num">$120 (12 days)</td>
      <td class="num">$150 (15 days)</td>
      <td class="num">$150 (15 days)</td>
      <td>One uninterrupted $10/day CBO Sales campaign testing 3 ad angles against Purchase conversion.</td>
    </tr>
    <tr>
      <td><strong>2. Physical Sample Polos</strong></td>
      <td class="num">$22 (1 shirt)</td>
      <td class="num">$44 (2 shirts)</td>
      <td class="num">$86 (4 shirts)</td>
      <td>Order Size L samples at wholesale (~$21.50/ea) for warm tournament directors &amp; micro-connectors.</td>
    </tr>
    <tr>
      <td><strong>3. QR Golf-Bag Cards</strong></td>
      <td class="num">$8</td>
      <td class="num">$6</td>
      <td class="num">$14</td>
      <td>Print Command Center QR codes linked to <code>KEN15</code> so golf buddies scan &amp; buy right off the bag.</td>
    </tr>
  </tbody>
</table>

<div class="calc-box avoid-break">
  <div class="calc-box-title">Ken’s Focused 4.5-Hour Weekly Operating Rhythm (Interactive Checklist Inside App)</div>
  Mon / Wed (2.0 hrs) &rarr; Send 5 warm 1-to-1 texts/emails to alumni, business &amp; charity scramble organizers.<br>
  Thu / Sat (1.0 hr)  &rarr; Wear High Draw during your round; hand out 2 QR Bag Cards when guys ask about the collar.<br>
  Friday    (0.75 hr) &rarr; Shoot two 30-second vertical iPhone videos outdoors explaining fit, fabric, and the $86 Pair.<br>
  Sunday    (0.75 hr) &rarr; Open highdrawgear.com/admin/marketing: check Sunday CFO Digest, update click spend, Kill or Scale.
</div>

<h2>9. Exact Step-by-Step Facebook Ads Setup (No Agency Needed)</h2>
<div class="callout callout-red avoid-break">
  <div class="callout-title">Rule #1: NEVER Click the &ldquo;Boost Post&rdquo; Button</div>
  <p style="margin-bottom:0;">
    Clicking Instagram or Facebook’s &ldquo;Boost Post&rdquo; button optimizes for cheap passive likes and bot clicks, not buyers. Always build inside <strong>Meta Ads Manager (adsmanager.facebook.com)</strong>.
  </p>
</div>

<ol>
  <li><strong>Paste your Meta Pixel ID once:</strong> Open Tab 4 (<em>FB Ads &amp; QR Studio</em>) inside High Draw’s Command Center, paste your 15-digit Meta Pixel ID, and click <strong>Save &amp; Sync Pixel</strong>. High Draw automatically fires <code>PageView</code>, <code>ViewContent</code>, <code>AddToCart</code>, <code>InitiateCheckout</code>, and <code>Purchase</code>.</li>
  <li><strong>Campaign Setup:</strong> Click <em>Create</em> &rarr; Choose <strong>Sales</strong> objective &rarr; Set Conversion Location to <strong>Website</strong> &rarr; Event = <strong>Purchase</strong> &rarr; Turn Advantage+ Campaign Budget ON at <strong>$10.00 / day</strong>.</li>
  <li><strong>Ad Set Audience &amp; Placements:</strong> Location = <strong>Sunbelt / Active US Golf States</strong>, Age = <strong>35–65+</strong>, Detailed Targeting = <em>Golf, Country club, PGA Tour</em>. Switch Placements to Manual and <strong>UNCHECK Audience Network</strong> (prevents accidental mobile game clicks).</li>
  <li><strong>Load 3 Contrast Ads Using Tracked UTM Links:</strong> Use Tab 4 to copy ready-made UTM links (<code>?utm_source=facebook&amp;utm_medium=paid_social&amp;utm_campaign=fb_m1_pair86&amp;utm_content=...</code>) and upload:
    <ul>
      <li><strong>Ad A (Offer Hook):</strong> <em>&ldquo;Two Tour-Grade Polos. $86 Total + Free Shipping.&rdquo;</em></li>
      <li><strong>Ad B (Founder Proof):</strong> <em>&ldquo;A 3.8-Index Retired Business Dean Fixed Golf Polo Fit.&rdquo;</em></li>
      <li><strong>Ad C (Work-to-Course):</strong> <em>&ldquo;Boardroom Sharp at 9 AM. 18 Holes Ready at 4 PM.&rdquo;</em></li>
    </ul>
  </li>
</ol>

<!-- SECTION 10: COMMAND CENTER VISUAL GUIDE -->
<div class="page-break"></div>
<h2>10. Central Marketing Command Center Tour</h2>
<p>
  Visit <code>https://www.highdrawgear.com/admin/marketing</code> on any laptop, tablet, or phone and enter your Owner PIN. Because High Draw runs on Vercel’s Free Tier and Kyle &amp; Ken do not need extra SaaS accounts or GitHub tokens, <strong>Cloud Sync compresses and stores your experiment ledger automatically inside High Draw’s existing Stripe account</strong> (under an internal system record <code>ledger-sync@internal.highdrawgear.com</code>). Edits you make on your iPad appear immediately on Kyle’s MacBook.
</p>

<div class="figure-box avoid-break">
  <img src="${overviewChartUri}" alt="Executive Overview Tab — Sunday CFO Digest, 100-Shirt Milestone, and Revenue vs Outlay Recharts" />
  <div class="figure-caption">
    <strong>Tab 1 — Executive Overview:</strong> Displays the Sunday CFO Digest, live progress toward the 100-shirt wholesale blank milestone (+$6/shirt margin jump), weekly sales vs. marketing outlay charts, contribution waterfall, CAC ceiling comparison ($46 max), and storefront funnel conversion steps.
  </div>
</div>

<div class="figure-box avoid-break">
  <img src="${experimentsUri}" alt="Experiments and Automated CFO Verdicts Scatterplot and Responsive Ledger Table" />
  <div class="figure-caption">
    <strong>Tab 2 — What’s Tried &amp; Verdicts:</strong> Plots every ad campaign and grassroots seeding push on an Outlay-vs.-Net-Cash ROI Quadrant alongside automated rules (<strong>KILL</strong> &ge;$75 spend with 0 sales; <strong>ITERATE</strong> single-shirt AOV to the $86 Pair; <strong>SCALE</strong> &ge;3 profitable orders under CAC ceiling).
  </div>
</div>

<div class="page-break"></div>

<div class="figure-box avoid-break">
  <img src="${outreachMapUri}" alt="Outreach CRM and Live US Demand Footprint Map" />
  <div class="figure-caption">
    <strong>Tab 3 — Outreach CRM &amp; US Demand Map:</strong> Tracks charity scrambles, alumni outings, and golf connectors alongside a live US state demand choropleth populated directly from verified Stripe shipping addresses — flagging any seeded sample past 7 days for immediate follow-up.
  </div>
</div>

<div class="figure-box avoid-break">
  <img src="${fbStudioUri}" alt="Facebook Ads Studio, Meta Pixel Connector, 1-Click Stripe Promo Minter, and 300-DPI QR Generator" />
  <div class="figure-caption">
    <strong>Tab 4 — FB Ads &amp; QR Studio:</strong> One screen to wire your Meta Pixel, mint live Stripe Checkout promo codes (like <code>KEN15</code> or <code>SCRAMBLE20</code>), copy tracked UTM links, and download 300-DPI QR PNG codes for golf bag inserts.
  </div>
</div>

<div class="callout callout-blue avoid-break">
  <div class="callout-title">Sunday Evening CFO Review Checklist (15 Minutes Total)</div>
  <p style="margin-bottom:0;">
    1. Open <code>highdrawgear.com/admin/marketing</code> &rarr; Confirm green <strong>Cloud Synced</strong> badge in header.<br>
    2. Check <strong>Sunday CFO Digest</strong> alerts and follow up on any 7-day sample lead.<br>
    3. Update <code>Cash Spent ($)</code> &amp; <code>Clicks</code> on running Facebook ads (Stripe orders &amp; Printify COGS sync automatically!).<br>
    4. Obey the verdict: pause <strong>KILL</strong> tests at $75, push <strong>SCALE</strong> winners +25%, keep total monthly outlay inside cap.
  </p>
</div>

</body>
</html>
`;

  console.log('Launching headless Chromium for Colon Hyphen Bracket PDF...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  const pdfFileName = 'High_Draw_Start_Small_Marketing_Playbook_Colon_Hyphen_Bracket.pdf';
  const outPublic = path.join(publicDir, pdfFileName);
  const outBrain = path.join(brainDir, pdfFileName);
  const outDesktop = path.join(desktopDir, pdfFileName);

  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0.72in',
      bottom: '0.72in',
      left: '0.72in',
      right: '0.72in',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #64748b; display: flex; justify-content: space-between; padding: 0 0.72in; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 0.5pt solid #cbd5e1; padding-bottom: 4pt;">
        <span><strong>COLON HYPHEN BRACKET [:-]</strong> &bull; START-SMALL MARKETING PLAYBOOK</span>
        <span>HIGH DRAW GOLF CO. // DR. KEN CYREE</span>
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; font-size: 8pt; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #64748b; display: flex; justify-content: space-between; padding: 0 0.72in; border-top: 0.5pt solid #cbd5e1; padding-top: 4pt;">
        <span>Case Ref: CHB-2026-HDG-MKT &bull; Dr. Ken Cyree, Lori Cyree &amp; Kyle Cyree</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  fs.writeFileSync(outPublic, pdfBuffer);
  fs.writeFileSync(outBrain, pdfBuffer);
  console.log('Saved to Public:', outPublic);
  console.log('Saved to Brain:', outBrain);

  try {
    fs.writeFileSync(outDesktop, pdfBuffer);
    console.log('Saved to Desktop:', outDesktop);
  } catch (err) {
    console.warn('Could not write to desktop:', err.message);
  }

  await browser.close();
}

generatePdf().catch((err) => {
  console.error('Marketing Playbook PDF generation failed:', err);
  process.exit(1);
});
