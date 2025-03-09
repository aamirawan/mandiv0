-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  grade TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  description TEXT,
  images JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auctions table
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  title TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  starting_bid DECIMAL(10, 2) NOT NULL,
  current_bid DECIMAL(10, 2),
  reserve_price DECIMAL(10, 2),
  increment_amount DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  seller TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  reorder_level INTEGER NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'in-stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_prices table
CREATE TABLE IF NOT EXISTS market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  change DECIMAL(5, 2) NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust these based on your authentication setup)
CREATE POLICY "Public products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public auctions are viewable by everyone"
  ON auctions FOR SELECT
  USING (true);

CREATE POLICY "Public inventory items are viewable by everyone"
  ON inventory FOR SELECT
  USING (true);

CREATE POLICY "Public market prices are viewable by everyone"
  ON market_prices FOR SELECT
  USING (true);

-- Insert sample data for market_prices
INSERT INTO market_prices (product, price, change, location)
VALUES
  ('Basmati Rice', 85, 2.5, 'Lahore Mandi'),
  ('Wheat', 32, -1.2, 'Karachi Mandi'),
  ('Yellow Corn', 28, 0.8, 'Faisalabad Mandi'),
  ('Red Chilli', 120, 5.3, 'Multan Mandi'),
  ('Turmeric', 95, -2.1, 'Islamabad Mandi'); 