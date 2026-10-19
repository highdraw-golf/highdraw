const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const brainDir = '/Users/kyle/.gemini/antigravity/brain/b6b677d3-5fc5-4227-8755-1b0a3091bbb4';
const publicDir = '/Users/kyle/Developer/antigravity/high-draw-golf/public';
const desktopDir = '/Users/kyle/Desktop';

const img1Path = path.join(brainDir, '.user_uploaded/media_1792359242640_cf9eecc6.png');
const img2Path = path.join(brainDir, '.user_uploaded/media_1792359242657_5e252660.png');
const img3Path = path.join(brainDir, 'dad_pov_anchored.png');

const img1Base64 = fs.readFileSync(img1Path).toString('base64');
const img2Base64 = fs.readFileSync(img2Path).toString('base64');
const img3Base64 = fs.existsSync(img3Path) ? fs.readFileSync(img3Path).toString('base64') : '';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>High Draw Golf Co. — HBR Strategic Case Study &amp; Operating Proposal</title>
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
    line-height: 1.72;
    font-size: 10.2pt;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: #0f172a;
    font-weight: 700;
    line-height: 1.25;
    margin-top: 0;
  }

  h1 { font-size: 27pt; margin-bottom: 8pt; letter-spacing: -0.02em; }
  h2 { font-size: 17.5pt; margin-bottom: 10pt; margin-top: 22pt; border-bottom: 1.5pt solid #0f172a; padding-bottom: 5pt; color: #0f172a; }
  h3 { font-size: 13pt; margin-bottom: 6pt; margin-top: 16pt; color: #1c2c24; }
  h4 { font-size: 9.5pt; margin-bottom: 4pt; margin-top: 12pt; font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #334155; }

  p {
    margin-top: 0;
    margin-bottom: 10.5pt;
    color: #1e293b;
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
    padding: 12pt 6pt 10pt 6pt;
    page-break-after: always;
  }

  .chb-brandmark {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2.5pt solid #0f172a;
    padding-bottom: 12pt;
  }

  .chb-left {
    display: flex;
    align-items: center;
    gap: 12pt;
  }

  .chb-symbol {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 20pt;
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
    margin-top: 24pt;
    margin-bottom: 18pt;
  }

  .doc-tag {
    display: inline-block;
    background: #1c2c24;
    color: #38bdf8;
    font-size: 7.8pt;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 4pt 9pt;
    border-radius: 3pt;
    margin-bottom: 12pt;
  }

  .cover-subtitle {
    font-size: 11.5pt;
    color: #334155;
    line-height: 1.6;
    max-width: 98%;
    margin-top: 10pt;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }

  .abstract-box {
    background: #f8fafc;
    border-top: 2pt solid #1c2c24;
    border-bottom: 2pt solid #1c2c24;
    padding: 14pt 18pt;
    margin-top: 18pt;
  }

  .abstract-title {
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #1c2c24;
    margin-bottom: 6pt;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12pt;
    background: #ffffff;
    border: 1pt solid #cbd5e1;
    border-radius: 6pt;
    padding: 12pt 16pt;
    margin-top: 18pt;
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
    font-size: 9.2pt;
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
    padding: 11pt 15pt;
    margin: 13pt 0;
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
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4pt;
    color: #0f172a;
  }

  /* Formula / Calculation Box */
  .calc-box {
    background: #0f172a;
    color: #f8fafc;
    border-radius: 6pt;
    padding: 12pt 16pt;
    margin: 13pt 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    line-height: 1.6;
  }

  .calc-box-title {
    color: #38bdf8;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 8pt;
    margin-bottom: 6pt;
    border-bottom: 0.5pt solid #334155;
    padding-bottom: 4pt;
  }

  /* Glossary / Plain English Box */
  .glossary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11pt;
    margin: 12pt 0;
  }

  .glossary-card {
    background: #f8fafc;
    border: 1pt solid #cbd5e1;
    border-radius: 6pt;
    padding: 11pt 13pt;
  }

  .glossary-term {
    font-weight: 700;
    font-size: 9.5pt;
    color: #1c2c24;
    margin-bottom: 4pt;
  }

  .glossary-def {
    font-size: 8.8pt;
    color: #334155;
    line-height: 1.55;
    margin: 0;
  }

  /* Tables (HBR Exhibit Style) */
  .exhibit-header {
    font-family: 'Inter', sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1c2c24;
    margin-top: 14pt;
    margin-bottom: 2pt;
  }

  .exhibit-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 12.5pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 6pt;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 6pt 0 14pt 0;
    font-size: 8.6pt;
  }

  th, td {
    padding: 6.5pt 8pt;
    text-align: left;
    border-bottom: 1pt solid #cbd5e1;
    vertical-align: top;
    line-height: 1.45;
  }

  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    font-size: 7.8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-top: 1.5pt solid #0f172a;
    border-bottom: 1.5pt solid #0f172a;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  .num {
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.2pt;
  }

  .exhibit-source {
    font-size: 7.8pt;
    font-style: italic;
    color: #64748b;
    margin-top: -8pt;
    margin-bottom: 14pt;
  }

  /* Image Layouts */
  .image-comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14pt;
    margin: 14pt 0;
  }

  .image-box {
    border: 1pt solid #cbd5e1;
    border-radius: 6pt;
    padding: 10pt;
    text-align: center;
    background: #ffffff;
  }

  .image-box img {
    max-height: 155pt;
    max-width: 90%;
    object-fit: contain;
    margin-bottom: 6pt;
  }

  .image-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 3pt;
  }

  .image-caption {
    font-size: 8.2pt;
    color: #475569;
    line-height: 1.4;
  }

  .badge-tag {
    display: inline-block;
    font-size: 7pt;
    font-weight: 700;
    padding: 2pt 5.5pt;
    border-radius: 3pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 5pt;
  }
  .badge-pass { background: #dcfce7; color: #15803d; }
  .badge-warn { background: #fef3c7; color: #b45309; }
  .badge-fail { background: #fee2e2; color: #b91c1c; }

  .section-lead {
    font-size: 11pt;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: #334155;
    margin-bottom: 12pt;
    line-height: 1.48;
  }

  .prompt-card {
    background: #f8fafc;
    border: 1pt solid #94a3b8;
    border-left: 4pt solid #0f172a;
    border-radius: 4pt;
    padding: 10pt 14pt;
    margin-bottom: 11pt;
  }

  .prompt-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.8pt;
    font-weight: 700;
    color: #1c2c24;
    text-transform: uppercase;
    margin-bottom: 4pt;
  }

  .prompt-text {
    font-family: 'Inter', sans-serif;
    font-size: 8.8pt;
    font-style: italic;
    color: #0f172a;
    background: #ffffff;
    border: 0.5pt solid #cbd5e1;
    padding: 8pt 10pt;
    border-radius: 3pt;
    margin: 0;
    line-height: 1.5;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 10pt;
    padding-left: 18pt;
  }

  li {
    margin-bottom: 4.5pt;
    line-height: 1.62;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div class="chb-brandmark">
    <div class="chb-left">
      <div class="chb-symbol">:-]</div>
      <div>
        <div style="font-weight:700; font-size:11pt; letter-spacing:0.05em; color:#0f172a;">COLON HYPHEN BRACKET</div>
        <div class="chb-meta">Harvard Business School / Kenan-Flagler Style Case Study &amp; Operating Proposal</div>
      </div>
    </div>
    <div class="hbr-case-id">
      CASE REF: CHB-2026-HDG<br>
      REV: OCTOBER 18, 2026
    </div>
  </div>

  <div class="cover-title-area">
    <div class="doc-tag">EXECUTIVE CASE STUDY &amp; COMMERCIAL OPERATING PLAN</div>
    <h1>High Draw Golf Co.: Scaling a Modern Golf Apparel Venture</h1>
    <div style="font-family:'Cormorant Garamond', serif; font-size:17pt; font-style:italic; color:#1c2c24; margin-top:4pt;">
      Evaluating Manufacturing Mechanics, Product Focus vs. Variety, Mid-Market ($48–$58) vs. Premium Pricing, and the Path from First Shirt to Strategic Acquisition
    </div>

    <div class="abstract-box">
      <div class="abstract-title">Case Abstract &amp; Executive Dilemma</div>
      <p style="font-size:9.5pt; margin-bottom:6pt; line-height:1.55;">
        In Autumn 2026, <strong>Dr. Ken Cyree</strong>—Professor of Finance, former Dean of the School of Business Administration at the University of Mississippi, and a 3.8-handicap senior golfer—entered discovery discussions with his son, <strong>Kyle Cyree</strong> (MBA, UNC Kenan-Flagler; full-stack software engineer; former commercial embroidery technician), and wife <strong>Lori Cyree</strong> regarding the launch of <strong>High Draw Golf Co.</strong> (<code>highdrawgear.com</code>).
      </p>
      <p style="font-size:9.5pt; margin-bottom:0; line-height:1.55;">
        Even before payment processing was activated, organic demand surfaced: a golfing friend and his wife reached out asking to buy High Draw shirts, and an informal poll of Ken's golfing circle revealed passionate opinions across three logo concepts. Yet fundamental strategic questions remained unresolved: <em>Can an on-demand golf brand make meaningful money, or will Ken simply end up giving shirts away? Should High Draw focus on 1–2 superior products (like Peter Millar and Holderness &amp; Bourne) or offer dozens of customized options across print-on-demand vendors? Why does small text embroidery fail on stretchy performance shirts while succeeding on classic club shirts like Old Waverly? And what exact unit economics are required to grow from a $1,500 pilot into a $300,000–$500,000 annual profit engine or $15M+ acquisition target?</em>
      </p>
    </div>

    <div class="cover-meta-grid">
      <div>
        <div class="meta-item-label">Co-Founder &amp; Principal</div>
        <div class="meta-item-val">Dr. Ken Cyree (3.8 Index)</div>
        <div style="font-size:8pt; color:#475569; margin-top:2pt;">Product Fit, Club Network &amp; Financial Governance (1–2 hrs/wk)</div>
      </div>
      <div>
        <div class="meta-item-label">Advisor &amp; Buyer Lens</div>
        <div class="meta-item-val">Lori Cyree</div>
        <div style="font-size:8pt; color:#475569; margin-top:2pt;">"Take Play to Work" Line (Long-Sleeve Polos &amp; Dress Shirts) &amp; Sizing</div>
      </div>
      <div>
        <div class="meta-item-label">Co-Founder &amp; Architect</div>
        <div class="meta-item-val">Kyle Cyree (MBA, UNC)</div>
        <div style="font-size:8pt; color:#475569; margin-top:2pt;">E-Commerce, Embroidery QA, Ad Funnels &amp; Vendor Automation</div>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    <div>Colon Hyphen Bracket LLC &bull; Prepared for the Cyree Family</div>
    <div>Includes Plain-English Manufacturing Guide, Pro Forma Calculations &amp; DeepSeek AI Prompts</div>
  </div>
</div>

<!-- SECTION 1: THE FAMILY DEBATE & REAL-WORLD TRACTION -->
<div>
  <h2>1. The Cyree Family Case: Early Signals &amp; Questioning Assumptions</h2>
  <div class="section-lead">
    Synthesizing the September–October 2026 family discussions: Why each family member spotted a critical piece of the puzzle—and why challenging standard internet business myths is essential.
  </div>

  <p>
    Most business plans are written in a vacuum before a single customer has seen the product. High Draw Golf Co. is already past that point. Between September 27 and October 18, 2026, Kyle launched the initial storefront at <code>highdrawgear.com</code>, and the family's real-world reactions—combined with feedback from Ken's golfing circle—surfaced five foundational insights that define this business:
  </p>

  <ol>
    <li><strong>Immediate Organic Pull (September 30):</strong> Before a single dollar was spent on advertising, one of Ken's friends proactively reached out asking to buy High Draw shirts for himself and his wife. In venture analysis, unprompted inbound interest from a stylish peer is the earliest indicator of product-market fit.</li>
    <li><strong>Channel Positioning — Protecting Pro-Shop Relationships (Ken's Insight, September 28):</strong> Reviewing the website copy, Ken immediately flagged a critical strategic error: <em>"I will need to tweak a little to not diss the country club markups most likely since I will potentially sell to them... Maybe instead of Country Club markups call it retail markups?"</em> Ken is 100% right. Green-grass country club pro shops are our highest-margin wholesale partners in Year 2. We must position High Draw against bloated <strong>"Big-Box Retail &amp; $30M Tour Endorsement Markups"</strong>—never against local club pros.</li>
    <li><strong>The Senior Athletic Fit Gap (Ken's Insight, September 28):</strong> As a 3.8-handicap senior golfer wearing a Size Large, Ken articulated what millions of avid golfers over 45 want: <em>"As a senior golfer, I want a shirt that fits around my shoulders and my torso"</em>—athletic and sharp without clinging to the midsection like European skinny-fit shirts or billowing like a tent.</li>
    <li><strong>Logo Scale &amp; "Take Play to Work" Expansion (Lori's Insights, September 28 &amp; October 18):</strong> Lori immediately noticed two things that men often overlook: first, that oversized chest logos look loud and need to be refined down to a classic 2.0–2.25 inch scale; second, that <strong>spouses love buying versatile apparel that transitions from the course to the office</strong>: <em>"I think a long sleeve polo might sell well, as well as a button down dress shirt with the logo. Take play to work... I used to buy long sleeved Ole Miss polos for Ken. That way we saved on dry cleaning, he was more comfortable, and he looked like a team player."</em></li>
    <li><strong>The Production &amp; Embroidery Debate (October 16–17):</strong> When Ken polled six golfing buddies on the logos, <strong>1 picked the swoosh alone, 2 picked <code>H/D</code>, and 3 picked the full words <code>High Draw</code></strong>. Ken naturally concluded: <em>"It makes sense to offer all three and let the customer choose."</em> Meanwhile, Kyle—drawing on a full year of hands-on experience working in a commercial embroidery and screen-printing shop—warned that stitching tiny letters on thin performance fabric creates severe quality defects, and offering every combination of logo, thread color, and shirt color creates a mathematical explosion of hundreds of product variants.</li>
  </ol>

  <div class="callout callout-gold avoid-break">
    <div class="callout-title">The Purpose of This Study</div>
    <p style="margin-bottom:0;">
      Dr. Cyree is an expert in finance and banking, not textile factories or e-commerce software. Conversely, generic AI reports often throw around unexplained buzzwords and rosy revenue projections without showing the underlying math. The pages that follow explain <strong>every manufacturing, embroidery, pricing, and marketing mechanic in plain English</strong>, backed by transparent calculations, industry case studies (Peter Millar, Holderness &amp; Bourne, Rhoback), and a realistic pro forma model.
    </p>
  </div>
</div>

<!-- SECTION 2: PLAIN-ENGLISH MANUFACTURING & EMBROIDERY GUIDE -->
<div class="page-break">
  <h2>2. Plain-English Guide: How On-Demand Manufacturing &amp; Embroidery Work</h2>
  <div class="section-lead">
    Demystifying the factory floor: Why Kyle had to use a Sharpie marker in his old embroidery shop, why Ken's "Prairie Club" shirt has uneven letters, and why the "Neck Tag Problem" matters.
  </div>

  <p>
    To make sound business decisions about which shirts and logos to offer, every partner needs to understand what physically happens inside a print-on-demand facility (like Printify, Printful, or Apliiq) versus a traditional golf brand factory.
  </p>

  <h3>1. Why Embroidery Is Harder Than Printing (The "Bobbin &amp; Sharpie" Reality)</h3>
  <p>
    When you print a logo on a t-shirt or a golf ball, an inkjet or screen-printing press simply sprays microscopic droplets of ink onto the surface. Ink has zero weight, zero tension, and can print letters as small as a pinhead.
  </p>
  <p>
    <strong>Embroidery is completely different—it is physical construction using heavy thread and steel needles on a moving, stretchy surface.</strong> Here are the four physical realities Kyle dealt with when working full-time in an embroidery shop:
  </p>

  <div class="glossary-grid avoid-break">
    <div class="glossary-card">
      <div class="glossary-term">A. Top Thread vs. Bottom Bobbin (The White Flecks)</div>
      <p class="glossary-def">
        An embroidery machine works like a heavy-duty sewing machine. It uses two threads that lock together: the <strong>colored top thread</strong> (say, Navy or Green) going down through the needle, and a <strong>white "bobbin" thread</strong> spinning underneath the shirt that catches the top thread to tie a knot. When the needle tries to stitch tiny letters (under 1/4 inch tall), the tension pulls the white bottom thread up to the top of the shirt—leaving ugly white dots and uneven letter heights (the exact flaw visible on Ken's <em>Prairie Club</em> shirt). In a local shop, a worker fixes those white flecks by hand with a colored Sharpie marker. In an automated Printify warehouse, nobody checks—they just mail the flawed shirt to the customer.
      </p>
    </div>

    <div class="glossary-card">
      <div class="glossary-term">B. The "Brooch / Cardboard Patch" Effect</div>
      <p class="glossary-def">
        Modern summer golf shirts are ultra-thin and stretchy so they breathe in 95-degree Mississippi heat. If you put a large, wide logo with 9,000+ tight stitches onto a thin, stretchy shirt, the thread weighs more than the fabric. Instead of draping smoothly across your chest, the logo sits stiffly like a heavy metal brooch or cardboard coaster pinned to your chest, pulling the shirt placket sideways when the top button is unbuttoned.
      </p>
    </div>

    <div class="glossary-card">
      <div class="glossary-term">C. Why "Old Waverly" Worked vs. Thin Poly</div>
      <p class="glossary-def">
        Ken rightly noted that his <em>Old Waverly</em> shirt has ~2-inch lettering that looks fine. Why? First, traditional club logos use simpler block or open letters where letters don't overlap (unlike the slanted <code>D-R-A-W</code> in our draft where the serif feet touch each other). Second, country club pro shops buy shirts in batches of 144 from specialized golf embroiderers (like Imperial or Ahead) who adjust the needle tension by hand for that exact fabric before running the batch.
      </p>
    </div>

    <div class="glossary-card">
      <div class="glossary-term">D. The "Sport-Tek Neck Tag" Problem</div>
      <p class="glossary-def">
        When you order a shirt from Printify or Printful, they pull a blank shirt made by another company (like Sport-Tek, Gildan, or Port Authority), stitch your logo on the chest, and mail it. When the buyer opens the shirt, <strong>the label inside the neck still says "Sport-Tek."</strong> For a $30 charity scramble shirt, nobody cares. But if someone pays $55–$75 expecting a "High Draw" brand shirt and sees a cheap wholesale tag inside the neck, they feel tricked.
      </p>
    </div>
  </div>

  <div class="exhibit-header">Exhibit 1</div>
  <div class="exhibit-title">Comparison of Apparel Production Channels &amp; Capabilities (2026)</div>
  <table class="avoid-break">
    <thead>
      <tr>
        <th style="width:18%;">Supplier / Channel</th>
        <th style="width:24%;">How It Works</th>
        <th style="width:22%;">Available Products (Men's, Women's, Long-Sleeve)</th>
        <th style="width:18%;">Embroidery &amp; Tag Quality</th>
        <th style="width:18%;">Best Role for High Draw</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Printify</strong><br><em>(Online Broker Network)</em></td>
        <td>Software middleman that routes orders to random third-party print shops around the country.</td>
        <td>Very limited golf polos; poor women's golf cuts; almost no quality long-sleeve polos. Great for t-shirts, mugs, towels.</td>
        <td><strong>Low-to-Medium:</strong> Inconsistent embroidery tension; leaves factory neck tags in.</td>
        <td><strong>Testing &amp; Printed Gifts Only:</strong> Good for Ken's 1-shirt test, printed tees, and golf towels.</td>
      </tr>
      <tr>
        <td><strong>Printful</strong><br><em>(Owned Factories in NC &amp; TX)</em></td>
        <td>Owns its own industrial warehouses and embroidery machines in Charlotte and Dallas.</td>
        <td>Carries Adidas, Under Armour, and Sport-Tek polos (Men's &amp; Women's), hats, and dress shirts under one roof.</td>
        <td><strong>Good (Automated):</strong> Better quality control than Printify, though still automated.</td>
        <td><strong>Automated Online Orders:</strong> Best single-vendor option so orders ship in 1 box.</td>
      </tr>
      <tr>
        <td><strong>Contract Shop + SanMar Wholesale</strong><br><em>(e.g., Ink Ninjas / Local Shop)</em></td>
        <td>We buy wholesale blanks (Nike, Greg Norman, TravisMathew, Port Authority) and have a dedicated shop stitch them in batches of 12–36.</td>
        <td><strong>Full Catalog Access:</strong> Men's, Women's, Long-Sleeve Polos, and Lori's No-Iron Button-Down Dress Shirts!</td>
        <td><strong>Superior:</strong> Human operator checks every shirt; can add custom High Draw neck labels.</td>
        <td><strong>Clubhouse / Friend / Tournament Orders:</strong> Best quality &amp; highest profit margin.</td>
      </tr>
    </tbody>
  </table>
  <div class="exhibit-source">Source: Internal supply chain audit of Printify, Printful, Apliiq, and SanMar wholesale catalogs (October 2026).</div>
</div>

<!-- SECTION 3: PRODUCT SELECTION & THE "1,440 VARIANT TRAP" -->
<div class="page-break">
  <h2>3. Product Selection &amp; The "1,440 Variant Trap" Calculation</h2>
  <div class="section-lead">
    Why offering 3 logos in 4 colors across multiple shirts creates an operational logjam—and how we give Ken's friends choices without breaking the business.
  </div>

  <p>
    In the family chat on October 16–17, a classic product strategy disagreement emerged:
  </p>
  <ul>
    <li><strong>Ken's View (Customer Choice):</strong> Since 1 friend liked the swoosh, 2 liked <code>H/D</code>, and 3 liked the words <code>High Draw</code>, why not put all three logos on the site and let customers pick whichever logo color (White, Navy, Green, Yellow) they want on their shirt?</li>
    <li><strong>Kyle's View (Operational &amp; Consumer Psychology):</strong> Printify and Shopify do not have a magic "change thread color" button. Every single combination has to be built, uploaded, priced, and wired up by hand—and giving shoppers 100 choices causes "analysis paralysis" where they buy nothing.</li>
  </ul>

  <p>
    Let's look at the actual mathematics of what happens inside Printify/Shopify when you multiply logos, thread colors, shirt colors, sizes, and Lori's new shirt styles:
  </p>

  <div class="calc-box avoid-break">
    <div class="calc-box-title">Calculation 1: The Combinatorial Variant Explosion</div>
    <strong>Scenario A: Unrestricted Customer Customization (Everything Available on Everything)</strong><br>
    &bull; 3 Logo Designs (Swoosh Only, H/D Monogram, Full "High Draw" Text)<br>
    &bull; &times; 4 Logo Thread Colors (White, Navy, Cypress Green, Gold/Yellow)<br>
    &bull; &times; 6 Shirt Colors (Navy, White, Baby Blue, Cypress Green, Grey, Black)<br>
    &bull; &times; 5 Garment Sizes (Small, Medium, Large, XL, 2XL)<br>
    = <strong>360 Unique Variations per Shirt Style!</strong><br><br>
    If offered across 4 Garment Styles (1. Men's Polo, 2. Women's Polo, 3. Long-Sleeve Polo, 4. Button-Down Dress Shirt):<br>
    360 Variations &times; 4 Garment Styles = <strong>1,440 Separate Product SKUs to Build &amp; Maintain!</strong><br>
    <em>Time required at 4 minutes per SKU setup: <strong>96 Hours of Manual Data Entry</strong> (plus high risk of a customer ordering a Navy logo on a Navy shirt).</em>
  </div>

  <div class="calc-box avoid-break" style="background:#1c2c24;">
    <div class="calc-box-title" style="color:#fde047;">Calculation 2: The Curated "Simple / Classic / Statement" Solution</div>
    <strong>Scenario B: Designer-Locked Color Pairing (How Peter Millar &amp; Ralph Lauren Do It)</strong><br>
    Instead of asking the customer to be a graphic designer, <strong>we lock each shirt color to its best-looking logo thread color</strong> (e.g., Navy Shirt always comes with Crisp White/Cyan logo; Baby Blue Shirt comes with White or Navy; White Shirt comes with Navy/Green).<br><br>
    &bull; 3 Curated Editions ("The Minimalist Swoosh", "The H/D Club Crest", "The High Draw Signature")<br>
    &bull; &times; 1 Pre-Matched Thread Color per Shirt (0 bad combinations possible)<br>
    &bull; &times; 4 Core Shirt Colors (Navy, White, Baby Blue, Cypress Green)<br>
    &bull; &times; 5 Garment Sizes (S–2XL)<br>
    = <strong>60 Clean Variations total (95% reduction in complexity, 0% chance of ugly color clashes).</strong>
  </div>

  <h3>Resolving the "Full Words vs. H/D" Debate Using Real Placement</h3>
  <p>
    How do we honor the 3 friends in Ken's poll who liked the words <code>High Draw</code> without suffering the "Prairie Club" bobbin thread mess on the chest? Ken actually suggested a brilliant idea in the chat on October 16: <strong><em>"The other option is to put it on the right sleeve."</em></strong>
  </p>
  <p>
    Look at how top tour brands (like FootJoy, Titleist, and Holderness &amp; Bourne) use dual placement:
  </p>
  <ul>
    <li><strong>Option 1 (Left Chest):</strong> The clean, unmistakable <strong><code>H / D</code> 3D Shot Tracer</strong> (or Minimalist Swoosh) at a refined <strong>2.0-inch height</strong> (answering Lori's note that the logo looked too big in the first mockups).</li>
    <li><strong>Option 2 (Right Sleeve or Back Yoke below Collar):</strong> The words <code>HIGH DRAW</code> stitched cleanly in a straight horizontal line (where letters don't slant into each other), OR offering the full <code>HIGH / DRAW</code> tracer as a dedicated "Classic Edition" polo on slightly heavier pique fabric that can support the extra stitches!</li>
  </ul>

  <div class="exhibit-header">Exhibit 2</div>
  <div class="exhibit-title">The Cyree Family Product Assortment &amp; Availability Matrix</div>
  <table class="avoid-break">
    <thead>
      <tr>
        <th style="width:20%;">Product Line</th>
        <th style="width:18%;">Target Buyer</th>
        <th style="width:25%;">Best Underlying Blank Garment</th>
        <th style="width:15%;">Unit Cost &rarr; Price</th>
        <th style="width:22%;">Why It Wins (Family Insight)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Men's Tour Performance Polo</strong><br><em>(The Flagship)</em></td>
        <td>Ken's Circle &amp; Avid Golfers</td>
        <td><strong>Sport-Tek PosiCharge Micro-Pique</strong> (Everyday) or <strong>Adidas / Greg Norman</strong> (Reserve)</td>
        <td class="num">$21.50 &rarr; <strong>$54.00</strong><br><em>($88 Reserve)</em></td>
        <td><strong>Ken's Spec:</strong> Fits comfortably around shoulders and torso (Size L); stay-flat self-collar; breathable micro-pique.</td>
      </tr>
      <tr>
        <td><strong>2. Women's Performance Polo</strong><br><em>(Couples &amp; Club)</em></td>
        <td>Golfing Couples (Ken's Friend &amp; Wife)</td>
        <td><strong>Sport-Tek Ladies PosiCharge Micro-Pique</strong> or <strong>Adidas Women's Polo</strong></td>
        <td class="num">$21.50 &rarr; <strong>$54.00</strong></td>
        <td><strong>Sept 30 Chat:</strong> Ken's friend and his wife both play; matching fabric and colors to the men's line makes couples orders easy.</td>
      </tr>
      <tr style="background:#f0fdf4;">
        <td><strong>3. "Take Play to Work" Long-Sleeve Polo &amp; Button-Down</strong></td>
        <td>Wives Buying for Husbands &amp; Executives</td>
        <td><strong>Port Authority Easy-Care / Wrinkle-Resistant Dress Shirt &amp; Long-Sleeve Pique Polo</strong></td>
        <td class="num">$26.50 &rarr; <strong>$64.00</strong></td>
        <td><strong>Lori's Insight (Oct 18):</strong> Saves on dry cleaning, comfortable all day at the office or university, looks sharp and team-oriented.</td>
      </tr>
      <tr>
        <td><strong>4. "19th Hole" Printed Tees, Hats &amp; Towels</strong></td>
        <td>Holiday / Father's Day Gift Buyers</td>
        <td><strong>Comfort Colors 1717 Heavy Cotton Tee</strong> + <strong>Imperial/Otto Rope Hat</strong></td>
        <td class="num">$14.00 &rarr; <strong>$34.00</strong></td>
        <td><strong>Kyle's Insight:</strong> Can print the full <code>HIGH / DRAW</code> logo big and sharp with zero embroidery thread issues; zero sizing stress for gifts.</td>
      </tr>
    </tbody>
  </table>
  <div class="exhibit-source">Source: Compiled from Cyree family product discussions (Sept 27 – Oct 18, 2026) and wholesale supplier catalogs.</div>
</div>

<!-- SECTION 4: INDUSTRY CASE PARALLELS (PETER MILLAR, HOLDERNESS & BOURNE, RHOBACK) -->
<div class="page-break">
  <h2>4. HBR Industry Case Parallels: How Golf Brands Actually Grow</h2>
  <div class="section-lead">
    Comparing High Draw's choices against Peter Millar, Holderness &amp; Bourne, and Rhoback: Is it better to focus on 1–2 great products or sell everything? Should we price at $52 or $110?
  </div>

  <p>
    To answer whether High Draw should focus on one or two core products versus a wide array of print-on-demand items—and how our $48–$58 pricing compares to $115 luxury brands—let us examine the historical growth trajectories of three benchmark companies.
  </p>

  <div class="exhibit-header">Exhibit 3</div>
  <div class="exhibit-title">Strategic Case Comparison: Peter Millar vs. Holderness &amp; Bourne vs. Rhoback vs. High Draw</div>
  <table class="avoid-break">
    <thead>
      <tr>
        <th style="width:16%;">Metric / Dimension</th>
        <th style="width:21%;">Peter Millar<br><em>(Founded 2001, Raleigh, NC)</em></th>
        <th style="width:21%;">Holderness &amp; Bourne<br><em>(Founded 2015 by 2 MBAs)</em></th>
        <th style="width:21%;">Rhoback<br><em>(Founded 2016 by UVA MBAs)</em></th>
        <th style="width:21%; background:#f0fdf4;">High Draw Golf Co.<br><em>(The Cyree Model)</em></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Initial Product Focus</strong></td>
        <td>Started with <strong>1 product</strong> (cashmere sweater), then <strong>1 signature polo</strong> (Summer Comfort).</td>
        <td>Spent 18 months perfecting <strong>1 single polo</strong> with a structured dress-shirt collar and tailored fit.</td>
        <td>Started with <strong>1 performance polo</strong> and <strong>1 quarter-zip</strong> with a signature dog crest.</td>
        <td style="background:#f0fdf4;"><strong>Focused Core:</strong> 1 Short-Sleeve Polo, 1 "Take Play to Work" Long-Sleeve/Button-Down, 1 Hat, 3 Gift Tees.</td>
      </tr>
      <tr>
        <td><strong>Retail Price Point</strong></td>
        <td>$110 – $135</td>
        <td>$110 – $125</td>
        <td>$98 – $118</td>
        <td style="background:#f0fdf4;"><strong>$48 – $64 Everyday</strong><br>($88 Reserve Tier)</td>
      </tr>
      <tr>
        <td><strong>Primary Early Distribution</strong></td>
        <td>Seeded through Sea Island and Southern country club pro shops via personal relationships.</td>
        <td>Word-of-mouth in private club locker rooms and Member-Guest tournament tee gifts.</td>
        <td>Instagram/Facebook ads targeting wives/girlfriends buying gifts, plus college athlete seeding.</td>
        <td style="background:#f0fdf4;"><strong>Hybrid:</strong> Ken's golfing circle &amp; club outings + Kyle's online spouse-gifting ads.</td>
      </tr>
      <tr>
        <td><strong>Why Customers Switched to Them</strong></td>
        <td>Softness of fabric and Southern country club lifestyle prestige.</td>
        <td>Solved the "floppy bacon collar" and baggy belly fit of older golf brands.</td>
        <td>Athletic stretch fabric, recognizable logo, and fun social media personality.</td>
        <td style="background:#f0fdf4;"><strong>Value + Fit:</strong> $115 shoulder/torso fit &amp; crisp collar at a fair $54 price—without paying for PGA Tour TV ads.</td>
      </tr>
      <tr>
        <td><strong>Ultimate Outcome</strong></td>
        <td>Acquired by luxury giant <strong>Richemont</strong>; $500M+ annual revenue.</td>
        <td>In 1,000+ top private pro shops; multi-million private equity growth.</td>
        <td>$50M+ annual direct-to-consumer powerhouse.</td>
        <td style="background:#f0fdf4;"><strong>Goal:</strong> Self-funding growth &rarr; $300k–$500k profit or strategic buyout.</td>
      </tr>
    </tbody>
  </table>
  <div class="exhibit-source">Source: Harvard Business School / Industry case archives and company disclosures.</div>

  <h3>Key Takeaway 1: Product Discipline Always Beats "Print-on-Demand Scatter"</h3>
  <p>
    Look at Row 1 of Exhibit 3: <strong>Not a single successful golf brand started by uploading 40 random products across 5 different suppliers.</strong> Why? Because if a golfer buys a shirt and loves the way a "Large" fits around his shoulders and torso, he wants to come back two months later and buy two more colors in that <em>exact same shirt</em>. If our website is a confusing hodgepodge of 15 different shirt manufacturers, we never build repeat loyalty.
  </p>
  <p>
    Therefore, High Draw should lock in <strong>one consistent Men's Polo blank, one Women's Polo blank, and Lori's "Take Play to Work" Long-Sleeve/Button-Down</strong>—while using print-on-demand t-shirts and towels purely as low-cost gift add-ons.
  </p>

  <h3>Key Takeaway 2: The Economics of $54 Mid-Market vs. $110 Luxury Pricing</h3>
  <p>
    Why do Peter Millar, Holderness &amp; Bourne, and Rhoback charge $110 for a shirt that costs $14–$18 to make? There are two reasons:
  </p>
  <ol>
    <li><strong>The Pro-Shop Wholesale Cut (50%):</strong> When a country club pro shop puts a $110 Peter Millar shirt on its rack, the pro shop buys it from Peter Millar for <strong>$55 wholesale</strong> and keeps the other $55 to pay for the pro shop's staff and rent. If Peter Millar priced their shirt at $48 retail, they would have to sell it to the pro shop for $24—leaving almost no profit!</li>
    <li><strong>The Facebook Ad Acquisition Cost ($35):</strong> As we saw earlier, paying Facebook $35 in advertising to acquire a new online customer works great when you make $65 profit on a $110 shirt, but loses money if a stranger only buys one $48 shirt ($26 profit).</li>
  </ol>

  <div class="callout callout-blue avoid-break">
    <div class="callout-title">How High Draw Wins at $48–$64 (The "Bundle &amp; Direct" Formula)</div>
    <p style="margin-bottom:0;">
      Dr. Cyree wants our everyday shirts priced between <strong>$48 and $64</strong> so normal golfers and friends feel they are getting a great deal. We make the math work in three ways:<br>
      <strong>1. Online Multi-Buy Bundles:</strong> One polo is $54, or <strong>"2 Polos for $98"</strong> (or "1 Polo + 1 Long-Sleeve Work Polo for $108"). By getting the average online cart over $95, our gross profit per order jumps to <strong>$50+</strong>, easily covering advertising costs.<br>
      <strong>2. Moving to Wholesale Batch Costs ($16/shirt) at 100+ Units:</strong> Just as Ken noted on September 30 (<em>"It will not make sense until shirt sales are 100+"</em>), once we order in batches of 72–100 shirts for local pro shops or tournaments, our cost drops from $22 down to ~$15–$16, allowing us to sell wholesale to clubs at $30–$32 while they retail it at $60–$65!<br>
      <strong>3. The "Clubhouse Reserve" Tier ($88):</strong> For wealthy club golfers who equate higher price with higher prestige (and want the ultra-dense <code>HIGH DRAW</code> embroidery on a premium blank), we offer a dedicated $88 Reserve shirt right alongside our $54 Everyday shirt.
    </p>
  </div>
</div>

<!-- SECTION 5: REALISTIC PRO FORMA & UNIT CALCULATIONS -->
<div class="page-break">
  <h2>5. Financial Calculations, Break-Even Math &amp; 12-Month Pro Forma</h2>
  <div class="section-lead">
    Transparent, step-by-step financial calculations showing unit margins, marketing return math, and monthly cash flows for Year 1.
  </div>

  <p>
    As a Professor of Finance, Dr. Cyree knows that a financial table is only as good as the assumptions behind it. Below are the explicit unit-level calculations before we roll them up into the 12-month income statement.
  </p>

  <div class="calc-box avoid-break">
    <div class="calc-box-title">Calculation 3: Unit Margin &amp; Break-Even Math</div>
    <strong>A. Single Everyday Polo Sale ($54.00 Retail — Word-of-Mouth / Direct Link):</strong><br>
    &nbsp;&nbsp;$54.00 Retail + $5.00 Shipping Paid by Buyer = $59.00 Collected<br>
    &nbsp;&nbsp;&minus; $21.50 Blank Polo &amp; Left-Chest Embroidery (Printful/Contract)<br>
    &nbsp;&nbsp;&minus; $4.50 Actual Postage &amp; Poly-Mailer Bag<br>
    &nbsp;&nbsp;&minus; $2.01 Stripe Credit Card Fee (2.9% + $0.30)<br>
    &nbsp;&nbsp;= <strong>$30.99 Net Contribution Margin per Shirt (57.4% of Retail)</strong><br><br>
    <strong>B. "Take Play to Work" Bundle (1 Short-Sleeve Polo + 1 Long-Sleeve Polo = $108.00):</strong><br>
    &nbsp;&nbsp;$108.00 Collected (Free Shipping included for orders over $95)<br>
    &nbsp;&nbsp;&minus; $47.50 Combined Blank &amp; Embroidery Cost ($21.50 + $26.00)<br>
    &nbsp;&nbsp;&minus; $6.50 Combined Single-Box Postage<br>
    &nbsp;&nbsp;&minus; $3.43 Stripe Credit Card Fee<br>
    &nbsp;&nbsp;= <strong>$50.57 Net Contribution Margin before Ads (46.8% Net)</strong><br>
    &nbsp;&nbsp;&minus; $32.00 Average Facebook Ad Cost to Acquire 1 New Gift Buyer<br>
    &nbsp;&nbsp;= <strong>+$18.57 Pure Profit on the Very First Ad-Driven Order!</strong><br><br>
    <strong>C. Total Startup Break-Even Point:</strong><br>
    &nbsp;&nbsp;Initial Setup &amp; Sample Budget = $1,200 to $1,500<br>
    &nbsp;&nbsp;$1,350 &divide; $30.99 Profit per Direct Shirt = <strong>44 Shirts Sold to Recover 100% of Startup Costs.</strong>
  </div>

  <div class="exhibit-header">Exhibit 4</div>
  <div class="exhibit-title">12-Month Pro Forma Income Statement (Conservative Year-1 Operating Plan)</div>
  <table class="avoid-break">
    <thead>
      <tr>
        <th>Line Item</th>
        <th class="num">Q1 (Months 1–3)<br><em>Samples &amp; Friends</em></th>
        <th class="num">Q2 (Months 4–6)<br><em>Spring &amp; Father's Day</em></th>
        <th class="num">Q3 (Months 7–9)<br><em>Fall &amp; Work Line</em></th>
        <th class="num">Q4 (Months 10–12)<br><em>Christmas Gifting</em></th>
        <th class="num">Year 1 Total<br><em>(Base Case)</em></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Total Orders (Online + Bulk)</strong></td>
        <td class="num">35 Orders</td>
        <td class="num">165 Orders</td>
        <td class="num">135 Orders</td>
        <td class="num">265 Orders</td>
        <td class="num"><strong>600 Orders</strong></td>
      </tr>
      <tr>
        <td><strong>Total Garment Units Shipped</strong></td>
        <td class="num">55 Units</td>
        <td class="num">310 Units</td>
        <td class="num">270 Units</td>
        <td class="num">490 Units</td>
        <td class="num"><strong>1,125 Units</strong></td>
      </tr>
      <tr>
        <td>1. Men's &amp; Women's Everyday Polos ($54)</td>
        <td class="num">$1,620</td>
        <td class="num">$7,560</td>
        <td class="num">$5,940</td>
        <td class="num">$10,800</td>
        <td class="num"><strong>$25,920</strong></td>
      </tr>
      <tr>
        <td>2. Lori's "Take Play to Work" Long-Sleeve/Dress ($64)</td>
        <td class="num">$640</td>
        <td class="num">$3,200</td>
        <td class="num">$3,840</td>
        <td class="num">$7,680</td>
        <td class="num"><strong>$15,360</strong></td>
      </tr>
      <tr>
        <td>3. Clubhouse Reserve Polos ($88)</td>
        <td class="num">$440</td>
        <td class="num">$2,640</td>
        <td class="num">$1,760</td>
        <td class="num">$3,520</td>
        <td class="num"><strong>$8,360</strong></td>
      </tr>
      <tr>
        <td>4. 19th Hole Tees, Hats &amp; Towels ($32 avg)</td>
        <td class="num">$320</td>
        <td class="num">$2,560</td>
        <td class="num">$1,600</td>
        <td class="num">$5,440</td>
        <td class="num"><strong>$9,920</strong></td>
      </tr>
      <tr>
        <td>5. Local Tournament / Club Batch Orders (2 events)</td>
        <td class="num">$0</td>
        <td class="num">$3,200</td>
        <td class="num">$3,600</td>
        <td class="num">$0</td>
        <td class="num"><strong>$6,800</strong></td>
      </tr>
      <tr style="border-top:1.5pt solid #0f172a; font-weight:700;">
        <td><strong>Total Gross Revenue</strong></td>
        <td class="num"><strong>$3,020</strong></td>
        <td class="num"><strong>$19,160</strong></td>
        <td class="num"><strong>$16,740</strong></td>
        <td class="num"><strong>$27,440</strong></td>
        <td class="num"><strong>$66,360</strong></td>
      </tr>
      <tr>
        <td>Cost of Goods Sold (Blanks, Embroidery, Postage)</td>
        <td class="num">($1,450)</td>
        <td class="num">($8,620)</td>
        <td class="num">($7,530)</td>
        <td class="num">($12,350)</td>
        <td class="num"><strong>($29,950)</strong></td>
      </tr>
      <tr style="font-weight:700; background:#f8fafc;">
        <td><strong>Gross Profit (54.9% Blended Margin)</strong></td>
        <td class="num"><strong>$1,570</strong></td>
        <td class="num"><strong>$10,540</strong></td>
        <td class="num"><strong>$9,210</strong></td>
        <td class="num"><strong>$15,090</strong></td>
        <td class="num" style="color:#15803d;"><strong>$36,410</strong></td>
      </tr>
      <tr>
        <td>Sample Shirts for Ken &amp; Friends (Seeding)</td>
        <td class="num">($550)</td>
        <td class="num">($200)</td>
        <td class="num">($200)</td>
        <td class="num">($200)</td>
        <td class="num"><strong>($1,150)</strong></td>
      </tr>
      <tr>
        <td>Facebook / Instagram Advertising (Capped)</td>
        <td class="num">($450)</td>
        <td class="num">($3,150)</td>
        <td class="num">($2,250)</td>
        <td class="num">($4,950)</td>
        <td class="num"><strong>($10,800)</strong></td>
      </tr>
      <tr>
        <td>Stripe Fees (3.2%), Domain, LLC &amp; Software</td>
        <td class="num">($295)</td>
        <td class="num">($730)</td>
        <td class="num">($650)</td>
        <td class="num">($995)</td>
        <td class="num"><strong>($2,670)</strong></td>
      </tr>
      <tr style="border-top:1.5pt solid #0f172a; border-bottom:2pt solid #0f172a; font-weight:700; background:#f1f5f9;">
        <td><strong>Net Operating Cash Profit (Pre-Tax)</strong></td>
        <td class="num"><strong>+$275</strong></td>
        <td class="num" style="color:#15803d;"><strong>+$6,460</strong></td>
        <td class="num" style="color:#15803d;"><strong>+$6,110</strong></td>
        <td class="num" style="color:#15803d;"><strong>+$8,945</strong></td>
        <td class="num" style="color:#15803d; font-size:9.2pt;"><strong>+$21,790</strong></td>
      </tr>
    </tbody>
  </table>
  <div class="exhibit-source">Note: Q1 requires only ~12 orders per month (less than 3 shirts a week) to be cash-flow positive, completely eliminating downside risk.</div>
</div>

<!-- SECTION 6: THE DREAM CLAUSE ($300K-$500K PROFIT & ACQUISITION TARGET) -->
<div class="page-break">
  <h2>6. The "Dream Clause": Scaling to $300k–$500k Profit &amp; M&amp;A Exit</h2>
  <div class="section-lead">
    What happens once we cross 100+ shirts and prove the model? The exact financial bridge from a $21,000 Year-1 side business to a $450,000/year profit machine and a $15M–$30M buyout target.
  </div>

  <p>
    In the family chat on September 30, when Kyle shared how custom neck labeling and bulk manufacturing work, Ken replied with spot-on executive instinct: <strong><em>"Interesting. It is probably the way to move as quickly as it makes sense. It will not make sense until shirt sales are 100+ or something like that."</em></strong>
  </p>
  <p>
    Ken hit the exact inflection point. In the apparel business, <strong>0 to 100 shirts is the "Validation Phase"</strong> (where we use Printify/Printful so we don't risk money). <strong>100 to 1,000 shirts is the "Wholesale Batch Phase."</strong> And <strong>2,500+ shirts is the "Custom Mill Phase"</strong>—where profit margins explode and the company becomes a real acquisition target.
  </p>

  <div class="exhibit-header">Exhibit 5</div>
  <div class="exhibit-title">The Four-Stage Financial Bridge to $450k Annual Profit &amp; $20M+ Buyout</div>
  <table class="avoid-break">
    <thead>
      <tr>
        <th style="width:16%;">Stage &amp; Trigger</th>
        <th style="width:24%;">How Production Changes</th>
        <th class="num" style="width:14%;">Cost / Shirt</th>
        <th class="num" style="width:14%;">Annual Units</th>
        <th class="num" style="width:16%;">Annual Revenue</th>
        <th class="num" style="width:16%;">Annual Net Profit</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Stage 1: Validation</strong><br><em>(0 to 100 Shirts)</em></td>
        <td>100% On-Demand (Printify / Printful). Zero inventory stored. Testing logos &amp; fits with Ken's circle.</td>
        <td class="num">$21.50 – $26.50</td>
        <td class="num">100 – 1,125</td>
        <td class="num">$6,000 – $66,360</td>
        <td class="num" style="color:#15803d;"><strong>$2,000 – $21,790</strong></td>
      </tr>
      <tr>
        <td><strong>Stage 2: Batch Scale</strong><br><em>(100 to 3,500 Shirts)</em><br><strong>Ken's 100+ Trigger</strong></td>
        <td>We order wholesale blanks in batches of 72–144 with custom High Draw neck tags and professional contract embroidery.</td>
        <td class="num"><strong>$15.50 – $18.00</strong><br><em>(Saves $6/shirt)</em></td>
        <td class="num">3,500</td>
        <td class="num">$225,000</td>
        <td class="num" style="color:#15803d;"><strong>$88,000</strong></td>
      </tr>
      <tr style="background:#f0fdf4;">
        <td><strong>Stage 3: The Cash Cow</strong><br><em>(10,000 to 18,000 Shirts)</em><br><strong>The $300k–$500k Goal</strong></td>
        <td><strong>Custom Factory Cut-and-Sew</strong> (Peru/Portugal mill makes our exact Senior Athletic Fit &amp; "Take Play to Work" shirts) + 80 Country Club Pro Shops + Collegiate Licensing.</td>
        <td class="num"><strong>$11.20 – $13.50</strong><br><em>(78% Gross Margin)</em></td>
        <td class="num"><strong>16,500</strong><br><em>(45 shirts/day)</em></td>
        <td class="num"><strong>$1,150,000</strong></td>
        <td class="num" style="color:#15803d; font-weight:700;"><strong>$435,000 / yr</strong></td>
      </tr>
      <tr>
        <td><strong>Stage 4: M&amp;A Exit</strong><br><em>(120,000+ Units/yr)</em><br><strong>Acquisition Target</strong></td>
        <td>Omnichannel Golf Lifestyle Brand (Polos, Long-Sleeves, Dress Shirts, Q-Zips, Shorts) in 400+ pro shops &amp; nationwide online.</td>
        <td class="num">$9.80 – $12.00</td>
        <td class="num">150,000</td>
        <td class="num">$11,500,000</td>
        <td class="num" style="color:#1c2c24; font-weight:700;"><strong>$2,450,000 / yr</strong><br><em>($22M–$28M Exit)</em></td>
      </tr>
    </tbody>
  </table>
  <div class="exhibit-source">Calculations based on standard apparel manufacturing tiers and golf M&amp;A multiples (2.0x–2.4x Revenue / 9x–11x EBITDA).</div>

  <h3>How Realistic Is Stage 3 ($435,000 Profit) and Stage 4 ($22M+ Buyout)?</h3>
  <p>
    Let's break down what it actually takes to hit <strong>Stage 3 ($435,000 a year in net profit)</strong> so Dr. Cyree can judge its plausibility:
  </p>
  <ul>
    <li><strong>It does NOT require becoming as big as Nike or FootJoy.</strong> Selling 16,500 shirts a year across the entire United States is only <strong>45 shirts per day</strong>.</li>
    <li><strong>Where do 45 shirts a day come from?</strong>
      <ol>
        <li><strong>Country Club Pro Shops (15 shirts/day):</strong> If High Draw is placed in just <strong>60 country club pro shops</strong> across Mississippi, Tennessee, Alabama, Georgia, and North Carolina (like Old Waverly, Collierville clubs, and resort courses), and each pro shop sells just <em>two shirts a week</em>, that equals 6,240 shirts a year! Because our custom mill cost in Stage 3 is $11.50, we sell to the pro shop at $28.00 wholesale (they retail it at $58–$65), making <strong>$16.50 pure profit per shirt ($102,960/year)</strong> with zero advertising cost.</li>
        <li><strong>Collegiate / SEC "Take Play to Work" Line (10 shirts/day):</strong> Lori's long-sleeve polo and button-down dress shirt concept—licensed or color-themed for Ole Miss (Powder Blue / Red / Navy) and other Southern alumni networks—selling 10 shirts a day to alumni and business professionals adds <strong>3,650 shirts a year ($155,000 profit)</strong>.</li>
        <li><strong>Online Spouse &amp; Holiday Gifting (20 shirts/day):</strong> Automated Facebook/Instagram gift ads and repeat customers buying 20 shirts/bundles a day nationwide adds <strong>6,600 shirts a year ($180,000+ profit)</strong>.</li>
      </ol>
    </li>
    <li><strong>Why Strategic Buyers Acquire Brands Like This:</strong> When Callaway bought <em>TravisMathew</em> ($125.5M) and Richemont bought <em>Peter Millar</em>, they didn't buy factories—they bought a <strong>loyal customer base of golfers and executives</strong>. A brand that owns the <strong>"Senior Athletic Fit &amp; Take Play to Work"</strong> niche at a smart $54–$65 price point fills the biggest gap in golf retail today.</li>
  </ul>
</div>

<!-- SECTION 7: IMMEDIATE ACTION PLAN & DEEPSEEK AI PROMPTS FOR DR. CYREE -->
<div class="page-break">
  <h2>7. Action Plan &amp; DeepSeek AI Prompts for Dr. Cyree</h2>
  <div class="section-lead">
    How we move from discussion to our first 100 shirts—plus ready-to-use prompts Dr. Cyree can paste into DeepSeek or ChatGPT to independently stress-test this entire business plan.
  </div>

  <h3>The Immediate 4-Step Game Plan (Cost: Under $300 to Start)</h3>
  <ol>
    <li><strong>Step 1: Ken's Personal Printify Test Order (This Week — ~$65):</strong> Just as Ken suggested in the chat, order 2–3 test shirts directly from the Printify account Kyle set up—testing both the <code>H/D</code> logo and the <code>High Draw</code> wordmark at 2.25 inches wide (and testing right-sleeve placement). Wear them, wash them twice, and show them to your stylish golfing friend and his wife.</li>
    <li><strong>Step 2: Banking &amp; Checkout Activation (1 Hour):</strong> Once Ken likes the physical shirt, open the LLC online bank account (Mercury) and Stripe account so Kyle can turn on live credit card and Apple Pay checkout on <code>highdrawgear.com</code>.</li>
    <li><strong>Step 3: Curate the Launch Storefront (No Analysis Paralysis):</strong> Lock in our 4 core shirt colors (Navy, White, Baby Blue, Cypress Green) with pre-matched contrast logos across our <strong>Men's Polo, Women's Polo, and Lori's Long-Sleeve / Button-Down "Take Play to Work" line</strong>.</li>
    <li><strong>Step 4: The First 100-Shirt Milestone:</strong> Fulfill our first 50–100 orders via automated on-demand delivery while tracking customer feedback. The moment we cross 100 shirts sold (Ken's benchmark), we unlock bulk wholesale pricing and custom High Draw neck labels.</li>
  </ol>

  <hr style="border:none; border-top:1.5pt solid #cbd5e1; margin:16pt 0;">

  <h3>Appendix: Copy-Paste Prompts for Dr. Cyree to Use in DeepSeek / AI</h3>
  <p>
    In the family chat on October 16, Kyle suggested: <em>"You could also use DeepSeek for free and get its opinions and create ideas/research."</em> Below are five tailored prompts Dr. Cyree can copy and paste directly into <strong>DeepSeek</strong> (<code>chat.deepseek.com</code>), ChatGPT, or Gemini to get an independent second opinion and formulate his own critiques or counter-proposals:
  </p>

  <div class="prompt-card avoid-break">
    <div class="prompt-label">Prompt 1: Stress-Testing the Financial Model (The Finance Professor Prompt)</div>
    <p class="prompt-text">
      "I am a finance professor and former Business School Dean evaluating a startup golf apparel brand with my son (an MBA and software engineer). We plan to sell performance golf polos at $54 (or 2 for $98) and long-sleeve/button-down 'work-to-course' shirts at $64, using print-on-demand initially ($21.50 landed cost per polo) before moving to bulk wholesale at 100+ units. Act as a skeptical retail CFO: what are the biggest hidden financial traps in direct-to-consumer golf apparel, what is a realistic Customer Acquisition Cost (CAC) on Facebook ads in 2026, and what unit metrics should I demand we hit before investing more than $1,500?"
    </p>
  </div>

  <div class="prompt-card avoid-break">
    <div class="prompt-label">Prompt 2: The Senior Golfer Fit &amp; "Take Play to Work" Market Opportunity</div>
    <p class="prompt-text">
      "I am a 3.8-handicap senior golfer. Most modern golf shirts are either cut too tight for 25-year-olds or are boxy and sloppy, and my wife pointed out that long-sleeve golf polos and wrinkle-free button-downs ('Take Play to Work') are great because they save on dry cleaning and are comfortable at the office. Analyze the US golf apparel market for men aged 45–70: how underserved is the 'athletic shoulder/comfortable torso' fit, and which wholesale blank shirts (from SanMar, Printify, or Printful) best fit that profile?"
    </p>
  </div>

  <div class="prompt-card avoid-break">
    <div class="prompt-label">Prompt 3: Resolving the Logo &amp; Embroidery Debate</div>
    <p class="prompt-text">
      "My son (who worked in a commercial embroidery shop) and I are debating our golf shirt logo. Our graphic shows a golf shot tracer curving right-to-left toward a pin. When I polled 6 golf buddies, 3 liked spelling out the full words 'HIGH DRAW' across the tracer, 2 liked just the initials 'H / D', and 1 liked just the tracer swoosh. My son warns that embroidering 8 small slanted letters on thin stretchy polyester in a 2.5-inch chest space causes bobbin thread pull-through and fabric puckering, whereas I have an Old Waverly club shirt where 2-inch lettering looks fine to me. Who is right, and what is the smartest way to design and place our logos (chest vs. right sleeve vs. printed tees)?"
    </p>
  </div>

  <div class="prompt-card avoid-break">
    <div class="prompt-label">Prompt 4: How to Sell Into Country Club Pro Shops Without Undercutting Them</div>
    <p class="prompt-text">
      "We want to sell our golf shirts online for $48–$58, but I also have strong relationships at private country clubs and want the option to sell our shirts in green-grass pro shops eventually. Explain the wholesale economics of country club pro shops (keystone markup, Mill River plans, tournament tee gifts). If our shirt is $54 online, how do we price and position our brand so club pros view us as a partner rather than a threat?"
    </p>
  </div>

  <div class="prompt-card avoid-break">
    <div class="prompt-label">Prompt 5: Formulating My Own Counter-Thesis for Our Next Family Meeting</div>
    <p class="prompt-text">
      "Based on the history of golf brands like Peter Millar, Holderness &amp; Bourne, and Rhoback, help me write a 5-point 'Co-Founder's Charter' to present to my son. Include: (1) our product focus rule (how many styles/colors we launch with), (2) our quality control standard on physical samples, (3) our rule on humorous t-shirts vs. serious club polos, and (4) our financial milestones at 25, 100, and 500 shirts sold."
    </p>
  </div>

  <div style="margin-top:20pt; border-top:1.5pt solid #0f172a; padding-top:10pt; display:flex; justify-content:space-between; align-items:center;">
    <div>
      <div style="font-family:'Cormorant Garamond', serif; font-size:12pt; font-weight:700; color:#0f172a;">Colon Hyphen Bracket LLC</div>
      <div style="font-size:7.5pt; text-transform:uppercase; letter-spacing:0.1em; color:#64748b;">Harvard Business Review Style Case Study &bull; Prepared for the Cyree Family</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:'JetBrains Mono', monospace; font-size:9pt; font-weight:700; color:#1c2c24;">:-] CHB-2026-HDG</div>
      <div style="font-size:7.5pt; color:#64748b;">October 18, 2026</div>
    </div>
  </div>
</div>

</body>
</html>
`;

async function generatePdf() {
  console.log('Launching headless Chromium via Playwright...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Setting document HTML with HBR Case Study, Cyree Family Chat insights, and DeepSeek prompts...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  const pdfFileName = 'High_Draw_Executive_Strategic_Plan_Colon_Hyphen_Bracket.pdf';
  const outPublic = path.join(publicDir, pdfFileName);
  const outBrain = path.join(brainDir, pdfFileName);
  const outDesktop = path.join(desktopDir, pdfFileName);

  console.log('Rendering print-quality HBR Case Study PDF...');
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
        <span><strong>COLON HYPHEN BRACKET [:-]</strong> &bull; HBR STRATEGIC CASE STUDY</span>
        <span>HIGH DRAW GOLF CO. // THE CYREE FAMILY</span>
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; font-size: 8pt; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #64748b; display: flex; justify-content: space-between; padding: 0 0.72in; border-top: 0.5pt solid #cbd5e1; padding-top: 4pt;">
        <span>Case Ref: CHB-2026-HDG &bull; Dr. Ken Cyree, Lori Cyree &amp; Kyle Cyree</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `
  });

  fs.writeFileSync(outPublic, pdfBuffer);
  console.log('Saved to Public:', outPublic);

  fs.writeFileSync(outBrain, pdfBuffer);
  console.log('Saved to Brain:', outBrain);

  try {
    fs.writeFileSync(outDesktop, pdfBuffer);
    console.log('Saved to Desktop:', outDesktop);
  } catch (err) {
    console.warn('Could not write to desktop:', err.message);
  }

  await browser.close();
  console.log('HBR Case Study PDF generation complete!');
}

generatePdf().catch(err => {
  console.error('PDF Generation Failed:', err);
  process.exit(1);
});
