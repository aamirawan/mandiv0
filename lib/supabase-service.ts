import { supabase } from './supabase'

// Database setup function - can be called during app initialization
export async function setupDatabase() {
  try {
    // Check if 'products' table exists by trying to query it
    const { error } = await supabase.from('products').select('count').limit(1)
    
    if (error && error.code === '42P01') { // PostgreSQL code for undefined_table
      console.log('Products table does not exist, creating it...')
      
      // Create the products table
      const { error: createError } = await supabase.rpc('create_products_table')
      
      if (createError) {
        console.error('Error creating products table:', createError)
        return false
      }
      console.log('Products table created successfully')
    }
    
    return true
  } catch (error) {
    console.error('Error setting up database:', error)
    return false
  }
}

// Products
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Products table does not exist, returning mock data')
        return getMockProducts()
      }
      console.error('Error fetching products:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    // Return empty array instead of throwing to prevent breaking the UI
    return []
  }
}

// Mock data for demonstration when database tables don't exist
function getMockProducts() {
  return [
    {
      id: '1',
      name: 'Premium Basmati Rice',
      category: 'Rice',
      grade: 'Premium',
      price: 85,
      stock: 500,
      image: '/placeholder.svg',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Organic Wheat',
      category: 'Wheat',
      grade: 'Organic',
      price: 34,
      stock: 1000,
      image: '/placeholder.svg',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Yellow Corn',
      category: 'Corn',
      grade: 'Grade A',
      price: 28,
      stock: 750,
      image: '/placeholder.svg',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Red Chilli',
      category: 'Spices',
      grade: 'Premium',
      price: 125,
      stock: 200,
      image: '/placeholder.svg',
      created_at: new Date().toISOString()
    }
  ]
}

export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Products table does not exist, returning mock data')
        return getMockProducts().find(product => product.id === id) || null
      }
      console.error(`Error fetching product with id ${id}:`, error)
      return null
    }
    
    return data
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    return null
  }
}

export async function createProduct(product: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Products table does not exist, returning mock created product')
        const mockProduct = {
          ...product,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        }
        return mockProduct
      }
      console.error('Error creating product:', error)
      return null
    }
    
    return data?.[0] || null
  } catch (error) {
    console.error('Error creating product:', error)
    return null
  }
}

export async function updateProduct(id: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Products table does not exist, returning mock updated product')
        const mockProducts = getMockProducts()
        const productIndex = mockProducts.findIndex(p => p.id === id)
        if (productIndex === -1) return null
        
        const updatedProduct = {
          ...mockProducts[productIndex],
          ...updates
        }
        return updatedProduct
      }
      console.error(`Error updating product with id ${id}:`, error)
      return null
    }
    
    return data?.[0] || null
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error)
    return null
  }
}

export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      // If the error is due to table not existing, return success
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.log('Products table does not exist, pretending deletion was successful')
        return true
      }
      console.error(`Error deleting product with id ${id}:`, error)
      return false
    }
    
    return true
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error)
    return false
  }
}

// Auctions
export async function getAuctions() {
  try {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') {
        console.log('Auctions table does not exist, returning mock data')
        return getMockAuctions()
      }
      console.error('Error fetching auctions:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching auctions:', error)
    return []
  }
}

// Mock auctions data
function getMockAuctions() {
  return [
    {
      id: '1',
      title: 'Premium Basmati Rice Auction',
      product_id: '1',
      starting_price: 80,
      current_bid: 85,
      quantity: 500,
      ends_in: '2h 15m',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Organic Wheat Bulk Sale',
      product_id: '2',
      starting_price: 30,
      current_bid: 34,
      quantity: 1000,
      ends_in: '5h 30m',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Yellow Corn Auction',
      product_id: '3',
      starting_price: 25,
      current_bid: 28,
      quantity: 750,
      ends_in: '1d 4h',
      created_at: new Date().toISOString()
    }
  ]
}

export async function createAuction(auction: any) {
  try {
    const { data, error } = await supabase
      .from('auctions')
      .insert([auction])
      .select()
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') {
        console.log('Auctions table does not exist, returning mock created auction')
        const mockAuction = {
          ...auction,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        }
        return mockAuction
      }
      console.error('Error creating auction:', error)
      return null
    }
    
    return data?.[0] || null
  } catch (error) {
    console.error('Error creating auction:', error)
    return null
  }
}

// Inventory
export async function getInventoryItems() {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') {
        console.log('Inventory table does not exist, returning mock data')
        return getMockInventory()
      }
      console.error('Error fetching inventory items:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching inventory items:', error)
    return []
  }
}

// Mock inventory data
function getMockInventory() {
  return [
    {
      id: '1',
      product_id: '1',
      name: 'Premium Basmati Rice',
      stock: 75000,
      unit: 'kg',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      product_id: '2',
      name: 'Organic Wheat',
      stock: 32500,
      unit: 'kg',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      product_id: '3',
      name: 'Yellow Corn',
      stock: 18400,
      unit: 'kg',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      product_id: '4',
      name: 'Red Chilli',
      stock: 5230,
      unit: 'kg',
      created_at: new Date().toISOString()
    }
  ]
}

// Market Prices
export async function getMarketPrices() {
  try {
    const { data, error } = await supabase
      .from('market_prices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') {
        console.log('Market prices table does not exist, returning mock data')
        return getMockMarketPrices()
      }
      console.error('Error fetching market prices:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching market prices:', error)
    return []
  }
}

// Mock market prices data
function getMockMarketPrices() {
  return [
    {
      id: '1',
      product: 'Basmati Rice',
      price: 85,
      location: 'Lahore Mandi',
      change: 2.5,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      product: 'Wheat',
      price: 32,
      location: 'Karachi Mandi',
      change: -1.2,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      product: 'Yellow Corn',
      price: 28,
      location: 'Faisalabad Mandi',
      change: 0.8,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      product: 'Red Chilli',
      price: 120,
      location: 'Multan Mandi',
      change: 5.3,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      product: 'Turmeric',
      price: 95,
      location: 'Islamabad Mandi',
      change: -2.1,
      created_at: new Date().toISOString()
    }
  ]
} 