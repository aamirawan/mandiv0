-- Drop tables if they exist (uncommenting these might be necessary if rebuilding the schema)
-- DROP TABLE IF EXISTS market_prices;
-- DROP TABLE IF EXISTS auctions;
-- DROP TABLE IF EXISTS inventory;
-- DROP TABLE IF EXISTS products;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  grade VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  description TEXT,
  image VARCHAR(1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  reorder_level INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in-stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auctions table
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  starting_bid DECIMAL(10, 2) NOT NULL,
  current_bid DECIMAL(10, 2),
  increment_amount DECIMAL(8, 2) DEFAULT 1.00,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  seller VARCHAR(255),
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market prices table
CREATE TABLE IF NOT EXISTS market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  market_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  trend VARCHAR(20) DEFAULT 'stable',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies

-- Enable RLS on the tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read all products"
ON products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update their products"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete their products"
ON products FOR DELETE
TO authenticated
USING (true);

-- Create similar policies for other tables
CREATE POLICY "Authenticated users can read all inventory"
ON inventory FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert inventory"
ON inventory FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update inventory"
ON inventory FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inventory"
ON inventory FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read all auctions"
ON auctions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert auctions"
ON auctions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update auctions"
ON auctions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete auctions"
ON auctions FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read all market_prices"
ON market_prices FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert market_prices"
ON market_prices FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update market_prices"
ON market_prices FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete market_prices"
ON market_prices FOR DELETE
TO authenticated
USING (true);

-- Create policies for anonymous access (read-only for products and auctions)
CREATE POLICY "Anyone can read products"
ON products FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anyone can read auctions"
ON auctions FOR SELECT
TO anon
USING (true);

-- Create function to refresh updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at timestamp
CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_inventory_timestamp
BEFORE UPDATE ON inventory
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_auctions_timestamp
BEFORE UPDATE ON auctions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_market_prices_timestamp
BEFORE UPDATE ON market_prices
FOR EACH ROW EXECUTE FUNCTION update_timestamp(); 