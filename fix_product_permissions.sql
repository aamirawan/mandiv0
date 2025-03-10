-- Add user_id column to products table if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop existing RLS policies for products table
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;
DROP POLICY IF EXISTS "Users can insert products" ON products;
DROP POLICY IF EXISTS "Users can update products" ON products;
DROP POLICY IF EXISTS "Users can delete products" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;

-- Create a policy that allows all users to read products
CREATE POLICY "Enable read access for all users" 
ON products FOR SELECT 
USING (true);

-- Create a policy that allows all authenticated users to insert products
CREATE POLICY "Authenticated users can insert products" 
ON products FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create a policy that allows all authenticated users to update products
CREATE POLICY "Authenticated users can update products" 
ON products FOR UPDATE 
TO authenticated
USING (true);

-- Create a policy that allows all authenticated users to delete products
CREATE POLICY "Authenticated users can delete products" 
ON products FOR DELETE 
TO authenticated
USING (true);

-- Update existing products to associate them with current user if null
-- (Run this manually after login to assign products to your user)
-- UPDATE products SET user_id = auth.uid() WHERE user_id IS NULL;

-- Create a trigger to automatically set user_id on new products
CREATE OR REPLACE FUNCTION set_user_id_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_user_id_on_products ON products;

CREATE TRIGGER set_user_id_on_products
BEFORE INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION set_user_id_on_insert(); 