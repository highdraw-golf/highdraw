# High Draw Golf — Dad's Isolated Account Launch Guide

This guide ensures **High Draw Golf** is deployed 100% on your dad's dedicated GitHub, Vercel, and Gmail accounts (`kensiri@gmail.com`), completely isolated from your personal developer accounts to avoid quota or billing overlap.

---

## Step 1: Set Up Dad's GitHub Account & Repository

1. Open an incognito browser window and go to [github.com/signup](https://github.com/signup).
2. Create a GitHub account using your dad's Gmail (`kensiri@gmail.com`).
3. Once logged into your dad's GitHub account:
   - Go to [github.com/new](https://github.com/new).
   - Enter **Repository name**: `high-draw-golf`.
   - Set visibility to **Public** (or **Private**).
   - Click **Create repository**.
   - Copy your dad's repository URL (e.g. `https://github.com/DAD_USERNAME/high-draw-golf.git`).

---

## Step 2: Push Codebase to Dad's GitHub

In your terminal inside `/Users/kyle/.gemini/antigravity/scratch/high-draw-golf`, update the remote to your dad's new repository:

```bash
# 1. Update git remote to dad's repository
git remote remove origin
git remote add origin https://github.com/DAD_USERNAME/high-draw-golf.git

# 2. Push code to dad's GitHub
git push -u origin master
```

*(If prompted for authentication, log in via browser or generate a Personal Access Token inside your dad's GitHub Settings > Developer Settings > Tokens).*

---

## Step 3: Set Up Dad's Dedicated Vercel Account

1. In your browser (logged into your dad's Gmail `kensiri@gmail.com`), go to [vercel.com/signup](https://vercel.com/signup).
2. Click **Continue with Google** and choose `kensiri@gmail.com` (or click **Continue with GitHub** using your dad's new GitHub account).
3. Once logged into your dad's new Vercel dashboard:
   - Click **Add New...** > **Project**.
   - Select your dad's `high-draw-golf` GitHub repository.
   - Click **Import**.

---

## Step 4: Add Environment Variables in Dad's Vercel

Before clicking **Deploy** in Vercel, expand **Environment Variables** and add:

```env
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=high-draw-c00b9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=high-draw-c00b9
VITE_FIREBASE_STORAGE_BUCKET=high-draw-c00b9.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

*(Optional Printify keys when ready: `VITE_PRINTIFY_SHOP_ID`, `VITE_PRINTIFY_API_TOKEN`).*

Click **Deploy**!

---

## Step 5: (Optional) Add Custom Domain

1. In your dad's Vercel project > **Settings** > **Domains**.
2. Enter your custom domain (e.g. `highdrawgolf.com`).
3. Set your DNS records at your domain registrar:
   - **A Record**: `@` ➔ `76.76.21.21`
   - **CNAME Record**: `www` ➔ `cname.vercel-dns.com`

---

## 🚀 Result
Your dad's brand is now 100% self-contained on his own free Vercel plan and GitHub account, with zero quota usage or charges on your personal developer accounts!
