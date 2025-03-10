-- Insert sample products
INSERT INTO products (name, category, grade, price, stock, unit, description)
VALUES
  ('Premium Basmati Rice', 'Rice', 'Premium', 85.00, 500, 'kg', 'Premium quality basmati rice from the Punjab region.'),
  ('Organic Wheat', 'Wheat', 'Organic', 34.00, 1000, 'kg', 'Certified organic wheat grown without pesticides.'),
  ('Yellow Corn', 'Corn', 'Grade A', 28.00, 750, 'kg', 'Fresh yellow corn suitable for various applications.'),
  ('Red Chilli', 'Spices', 'Premium', 125.00, 200, 'kg', 'Hot red chillies perfect for various Pakistani dishes.');

-- Insert sample inventory items (linked to products)
INSERT INTO inventory (product_id, sku, name, category, price, stock, reorder_level, status)
SELECT 
  id, 
  'SKU-' || SUBSTRING(id::text, 1, 8), 
  name, 
  category, 
  price,
  stock,
  50,
  'in-stock'
FROM products;

-- Insert sample auctions based on products
INSERT INTO auctions (
  product_id, 
  title, 
  description, 
  quantity, 
  starting_bid, 
  current_bid, 
  increment_amount, 
  start_date, 
  end_date, 
  seller, 
  location
)
SELECT
  id,
  name || ' Auction',
  'Auction for high-quality ' || name,
  FLOOR(stock * 0.5),
  price * 0.9,
  price,
  5.00,
  NOW(),
  NOW() + INTERVAL '7 days',
  'Mandi Marketplace',
  CASE category
    WHEN 'Rice' THEN 'Lahore Mandi'
    WHEN 'Wheat' THEN 'Karachi Mandi'
    WHEN 'Corn' THEN 'Faisalabad Mandi'
    WHEN 'Spices' THEN 'Multan Mandi'
    ELSE 'Islamabad Mandi'
  END
FROM products;

-- Allow anyone to read from product-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload to product-images bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update their uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid() = owner); 