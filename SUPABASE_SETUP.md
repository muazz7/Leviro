# Supabase Database Setup Instructions

## Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your **Project URL** and **Anon Key** from Settings > API

## Step 2: Run This SQL in Supabase SQL Editor

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PRODUCTS TABLE
-- =====================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image TEXT,
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name, price, description, image, sizes) VALUES
(
  'Premium White Cotton Panjabi',
  2850,
  'Crafted from the finest Egyptian cotton, this premium white Panjabi features intricate embroidery on the collar and cuffs. Perfect for weddings, Eid, and special occasions.',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  ARRAY['S', 'M', 'L', 'XL', 'XXL']
),
(
  'Royal Navy Blue Silk Panjabi',
  4250,
  'A stunning navy blue Panjabi made from premium Indian silk. Features elegant gold thread work on the chest and collar. Ideal for formal events and celebrations.',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
  ARRAY['S', 'M', 'L', 'XL']
),
(
  'Classic Cream Linen Panjabi',
  3150,
  'A timeless cream-colored Panjabi crafted from breathable linen. Minimalist design with subtle texture, perfect for both casual and semi-formal occasions.',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
  ARRAY['M', 'L', 'XL', 'XXL']
);

-- =====================
-- ORDERS TABLE
-- =====================
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_district TEXT,
  customer_thana TEXT,
  customer_address TEXT,
  payment_method TEXT DEFAULT 'cod',
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (true);

-- Allow authenticated insert/update/delete on products (for admin)
CREATE POLICY "Allow all for products" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- Allow public to insert orders (for checkout)
CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow public to read orders (for admin dashboard)
CREATE POLICY "Public can read orders" ON orders
  FOR SELECT USING (true);

-- Allow public to update orders (for changing status)
CREATE POLICY "Public can update orders" ON orders
  FOR UPDATE USING (true) WITH CHECK (true);
```

## Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

Replace with your actual values from Supabase Dashboard > Settings > API.

## Step 4: Restart the Dev Server

After adding the `.env` file, restart the development server:

```bash
npm run dev
```

## Database Schema Reference

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Auto-generated primary key |
| name | TEXT | Product name |
| price | NUMERIC | Price in BDT |
| description | TEXT | Product description |
| image | TEXT | Image URL |
| sizes | TEXT[] | Array of available sizes |
| created_at | TIMESTAMP | Creation timestamp |

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Order ID (e.g., ORD-123456) |
| customer_name | TEXT | Customer full name |
| customer_mobile | TEXT | Mobile number |
| customer_district | TEXT | District |
| customer_thana | TEXT | Thana/Upazila |
| customer_address | TEXT | Full address |
| payment_method | TEXT | Payment method (default: cod) |
| items | JSONB | Array of cart items |
| total | NUMERIC | Order total in BDT |
| status | TEXT | Pending / Delivered |
| created_at | TIMESTAMP | Order timestamp |
