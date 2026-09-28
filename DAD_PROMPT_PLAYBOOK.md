# High Draw Golf — Dad's Plain-English AI Command Playbook

This playbook allows a non-technical brand owner to manage **High Draw Golf** using simple, natural language prompts with any AI assistant or via the built-in **[OWNER CONSOLE]** on the website.

---

## 1. How to Manage the Site Right on the Screen

When viewing the website (either locally at `http://localhost:3013` or live on Vercel), click **`[OWNER CONSOLE]`** in the top left navbar.

Inside the **Owner Command Center**, you can:
- **Change Store Banner**: Type any message (e.g. *"SPRING OPEN: FREE SHIPPING ON ALL POLOS"*) and click **Save**.
- **Adjust Polo Price**: Change the price (e.g. `$48`) and click **Update Price**.
- **Switch Photo Themes**: Click between *Autumn Fairways*, *Flatlay Micro-Pique*, *Brutalist Twilight*, or *Coastal Veranda*.
- **Publish Live**: Click **Publish Live** to push all site updates to Vercel automatically.

---

## 2. Copy-and-Paste AI Prompts

If you ever want to update the store using an AI assistant (like Antigravity or ChatGPT), just copy and paste these exact prompts:

### Product & Pricing Updates
> *"Add a new performance polo named 'Pinehurst Stripe' for $48 in sizes S to 3XL with a deep green and white color option."*

### Banner & Promotional Sales
> *"Change top banner announcement ticker to 'MEMORIAL DAY SALE: 20% OFF ALL ORDERS WITH CODE HIGH20'."*

### Visual Style & Photo Themes
> *"Switch the main hero banner image to the Peter Millar Triptych lookbook photo."*

### Site Publishing
> *"Check the site build and publish all updates live to Vercel."*

---

## 3. One-Click Command Script

In the project folder, simply double-click or run:

```bash
./manage-brand.sh
```

Choose:
- `1` to preview the store on your computer.
- `2` to publish the website live to the world.
- `3` to test code health.
