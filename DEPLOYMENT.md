# 🚀 Deployment Guide (Deploy Free in 5 Minutes)

Flipkart clone ko alag-alag deploy karne ke liye ye steps follow karein:

---

## 1. Supabase Database Setup (Sabse Pehle)
1. Apne [Supabase Dashboard](https://supabase.com/dashboard) me jayein.
2. Left side menu se **SQL Editor** par click karein.
3. `backend/schema.sql` file ke pure content ko copy karein aur SQL Editor me paste karke **Run** button press karein.
4. Tables (`users`, `products`, `orders`) create ho jayengi aur top Big Billion Day deals automatically seed ho jayengi!

---

## 2. Backend Deploy Karein (Render.com par - Free)

1. [Render.com](https://render.com) par free account banayein ya login karein.
2. Click **New +** -> **Web Service**.
3. Apne GitHub repository ko connect karein.
4. Settings me:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `PORT`: `5000`
     - `SUPABASE_URL`: `https://xzjyvtcevndzxsrmtoad.supabase.co`
     - `SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_kNXx11mJ2eVv4PBYrlPLfQ_jpTrkkes`
     - `SUPABASE_SECRET_KEY`: `sb_secret_A18jUPsj-Vl1u-UECzLa8A_TTkFYyhu`
     - `SUPABASE_JWKS_URL`: `https://xzjyvtcevndzxsrmtoad.supabase.co/auth/v1/.well-known/jwks.json`
     - `JWT_SECRET`: `flipkart_big_billion_days_secret_key_super_secure_2026`
5. Click **Deploy Web Service**.
6. Render aapko ek URL dega (e.g. `https://flipkart-backend-xyz.onrender.com`).

---

## 3. Frontend Deploy Karein (Vercel par - Free)

1. [Vercel.com](https://vercel.com) par free account banayein ya login karein.
2. Click **Add New Project** aur apna repo select karein.
3. Settings me:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**:
     - Name: `VITE_API_BASE_URL`
     - Value: `https://flipkart-backend-xyz.onrender.com` *(Step 2 me mila hua Render URL)*
4. Click **Deploy**.
5. Vercel aapko live link provide kar dega (e.g. `https://flipkart-frontend-xyz.vercel.app`).

Ab aapka Flipkart Clone live internet par available ho jayega!
