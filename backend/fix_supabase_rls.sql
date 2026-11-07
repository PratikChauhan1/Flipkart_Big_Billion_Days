-- =========================================================================
-- SUPABASE RLS & PERMISSIONS FIX (COPY & RUN THIS IN SUPABASE SQL EDITOR)
-- =========================================================================

-- Step 1: Disable Row Level Security so your backend can write without block
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop old restrictive policies if any
DROP POLICY IF EXISTS "Allow all for users" ON public.users;
DROP POLICY IF EXISTS "Allow all for products" ON public.products;
DROP POLICY IF EXISTS "Allow all for orders" ON public.orders;

-- Step 3: Create full permissive policies
CREATE POLICY "Allow all for users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Step 4: Grant full access to anon, authenticated, and service_role
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Step 5: Seed Sample Big Billion Day Products into Supabase
INSERT INTO public.products (title, description, category, brand, price, original_price, discount_percent, stock, image_url, rating, reviews_count, is_bestseller, is_big_billion_deal)
VALUES
(
  'Apple iPhone 15 (Blue, 128 GB)',
  'Dynamic Island, 48MP Main camera, USB-C, A16 Bionic chip, Super Retina XDR display with ceramic shield front.',
  'Mobiles',
  'Apple',
  54999,
  79900,
  31,
  15,
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  4.7,
  28410,
  true,
  true
),
(
  'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
  'Galaxy AI is here. 200MP camera, Snapdragon 8 Gen 3, S-Pen included, titanium frame, 5000mAh battery.',
  'Mobiles',
  'Samsung',
  109999,
  134999,
  18,
  10,
  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
  4.6,
  11200,
  true,
  true
),
(
  'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones',
  'Industry-leading noise canceling with 2 processors, 8 microphones, 30hr battery life, speak-to-chat.',
  'Electronics',
  'Sony',
  24990,
  34990,
  28,
  25,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  4.8,
  8900,
  true,
  true
),
(
  'Apple MacBook Air M2 (8GB RAM, 256GB SSD, Midnight)',
  '13.6-inch Liquid Retina display, MagSafe 3 charging, 1080p FaceTime HD camera, all-day battery life.',
  'Electronics',
  'Apple',
  79990,
  99900,
  20,
  8,
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  4.8,
  14500,
  false,
  true
),
(
  'Nike Air Max 270 Running Shoes For Men',
  'Big Billion Special Edition. Breathable mesh upper, large max air unit in heel for ultra-plush cushioning.',
  'Fashion',
  'Nike',
  6499,
  12995,
  50,
  30,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  4.4,
  5120,
  false,
  true
),
(
  'LG 55 Inch OLED 4K Ultra HD Smart TV (Cinema Edition)',
  'Self-lit OLED pixels, α8 AI Processor 4K, Dolby Vision & Atmos, 120Hz refresh rate for ultimate gaming & cinema.',
  'Appliances',
  'LG',
  89990,
  169990,
  47,
  5,
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
  4.7,
  3200,
  true,
  true
),
(
  'Fastrack Revoltt FS1 Pro Smartwatch with 1.96" AMOLED Display',
  'SingleSync BT Calling, 410x502 resolution, Always-on display, NitroFast charging, 110+ sports modes.',
  'Electronics',
  'Fastrack',
  1999,
  7995,
  75,
  50,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  4.2,
  34900,
  true,
  true
),
(
  'Puma Men Classic Solid Casual Bomber Jacket',
  'Windproof, stylish athletic casual jacket with contrast zipper and water-resistant polyester finish.',
  'Fashion',
  'Puma',
  1899,
  4499,
  57,
  40,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
  4.3,
  4100,
  false,
  true
)
ON CONFLICT DO NOTHING;
