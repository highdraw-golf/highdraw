# High Draw Golf — Fix for Vercel "No Deployments Registered"

When Vercel shows *"No Deployments Registered"* or an empty repository list, it means Vercel needs permission to read repositories from your dad's GitHub account (`highdraw-golf`).

---

## ⚡ Step 1: Connect Vercel to GitHub Account `highdraw-golf` (15 Seconds)

1. Make sure you are logged into Vercel (`kensiri@gmail.com`).
2. Open this direct authorization link:
   👉 **[github.com/apps/vercel/installations/new](https://github.com/apps/vercel/installations/new)**
3. Under *"Where do you want to install Vercel?"*, select **`highdraw-golf`**.
4. Choose **All Repositories** (or select `highdraw`).
5. Click **Install & Authorize**.

---

## ⚡ Step 2: Import & Deploy on Vercel

1. Go back to [vercel.com/new](https://vercel.com/new).
2. You will now see **`highdraw-golf/highdraw`** listed at the top!
3. Click **Import**.
4. Click **Deploy**.

---

## ⚡ Step 3: Add `highdrawgear.com`

Once the deployment finishes (~15 seconds):
1. Click **Go to Dashboard**.
2. Click **Settings** (top right tab) ➔ **Domains**.
3. Type **`highdrawgear.com`** and click **Add**.

Because Namecheap DNS is configured, Vercel will immediately activate the domain!
