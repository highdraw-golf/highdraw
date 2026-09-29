# High Draw Golf — Resolving Vercel "Blocked" & 308 Domain Errors

This guide resolves the two specific issues preventing your site and domain `highdrawgear.com` from linking on Vercel.

---

## 🛑 Problem 1: Why Vercel Says "Blocked"

Vercel marks a deployment as **Blocked** for two common reasons:

### Cause A: Vercel GitHub App Authorization Needed
If Vercel cannot access the GitHub repository `highdraw-golf/highdraw`:
1. Open an incognito browser window logged into `highdrawgear@gmail.com` and GitHub `highdraw-golf`.
2. Open this link: [github.com/apps/vercel/installations/new](https://github.com/apps/vercel/installations/new).
3. Select the `highdraw-golf` account and choose **All Repositories**.
4. Click **Install & Authorize**.

### Cause B: Deployment Protection Is On
1. Go to your project page in Vercel (`high-draw-golf`).
2. Click **Settings** (top right tab) ➔ Click **Deployment Protection** on the left menu.
3. Turn **Vercel Authentication** to **Disabled / OFF**.
4. Click **Save**.

---

## 🔄 Problem 2: Why You Get a "308 Error" or "Already Existing / Buy" on Domains

When you click **Domains** from the top global Vercel menu bar, Vercel tries to **buy or transfer** the domain, causing a `308 Permanent Redirect` error if the domain is already assigned elsewhere.

### The Correct Path to Add `highdrawgear.com`:

```
Vercel Dashboard ➔ Projects ➔ Click "high-draw-golf" ➔ Settings ➔ Domains
```

1. Do **NOT** use the top menu bar `Domains` button.
2. Click directly on your project card **`high-draw-golf`**.
3. In the top tabs of that project, click **`Settings`**.
4. On the left sidebar menu of Settings, click **`Domains`**.
5. Type **`highdrawgear.com`** and click **Add**.

---

## 🌐 The Exact DNS Records to Enter at Your Registrar (GoDaddy, Namecheap, etc.)

Log into the registrar where you bought `highdrawgear.com` (e.g. GoDaddy, Namecheap, Google Domains) and enter these 2 DNS records:

| Record Type | Name / Host | Value / Target | Description |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` | Points `highdrawgear.com` to Vercel |
| **CNAME Record** | `www` | `cname.vercel-dns.com` | Points `www.highdrawgear.com` to Vercel |

### If Vercel Displays a Verification TXT Warning:
If Vercel says *"Domain is used by another account"*, add a 3rd record:
- **Type**: `TXT`
- **Name**: `_vercel`
- **Value**: *(Copy the exact verification code displayed on screen in Vercel)*

Once saved, Vercel will automatically verify the domain, issue your free SSL certificate, and unblock the site!
