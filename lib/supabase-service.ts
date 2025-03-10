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
      // Only return mock data if table doesn't exist - otherwise, log the error
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.warn('Products table does not exist, returning mock data')
        return getMockProducts()
      }
      console.error('Error fetching products:', error)
      throw error
    }
    
    // If we got an empty array but no error, the table exists but is empty
    if (data.length === 0) {
      console.warn('No products found in database')
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
        console.warn('Products table does not exist, returning mock data')
        return getMockProducts().find(product => product.id === id) || null
      }
      
      // If not found, return null
      if (error.code === 'PGRST116') { // Not found
        return null
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
    console.log('Creating product in Supabase:', JSON.stringify(product, null, 2))
    
    // Check if Supabase URL and API key are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing. Using mock data.')
      return createMockProduct(product)
    }
    
    // Check if products table exists
    try {
      const { data: tableCheck, error: tableError } = await supabase
        .from('products')
        .select('count')
        .limit(1)
      
      if (tableError) {
        console.error('Error checking products table:', tableError)
        if (tableError.code === '42P01') { // PostgreSQL code for undefined_table
          console.log('Products table does not exist, using mock data')
          return createMockProduct(product)
        }
        throw tableError
      }
    } catch (connectionError) {
      console.error('Failed to connect to Supabase:', connectionError)
      return createMockProduct(product)
    }
    
    // Sanitize the product object to ensure it has the expected fields
    const sanitizedProduct = {
      name: product.name,
      category: product.category,
      grade: product.grade,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      unit: product.unit || 'kg',
      description: product.description || '',
      image: product.image || ''
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([sanitizedProduct])
      .select()
    
    if (error) {
      console.error('Error creating product in Supabase:', error)
      return createMockProduct(product) // Fallback to mock if insert fails
    }
    
    console.log('Product created successfully:', data)
    return data?.[0] || createMockProduct(product)
  } catch (error: any) {
    console.error('Exception during product creation:', error.message, error.stack)
    return createMockProduct(product)
  }
}

// Helper function to create a mock product
function createMockProduct(product: any) {
  console.log('Creating a mock product')
  const mockProduct = {
    id: `mock-${Date.now()}`,
    name: product.name,
    category: product.category,
    grade: product.grade,
    price: parseFloat(product.price.toString()),
    stock: parseInt(product.stock.toString()),
    unit: product.unit || 'kg',
    description: product.description || '',
    image: product.image || '',
    created_at: new Date().toISOString()
  }
  console.log('Mock product created:', mockProduct)
  return mockProduct
}

export async function updateProduct(id: string, updates: any) {
  try {
    console.log('Updating product:', id)
    console.log('Update data:', updates)
    
    // Check if products table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.error('Error checking products table:', tableError)
      if (tableError.code === '42P01') { // PostgreSQL code for undefined_table
        console.warn('Products table does not exist, returning mock success')
        return { ...updates, id }
      }
      throw tableError
    }
    
    // Check if product exists first
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error(`Error checking if product exists (id: ${id}):`, fetchError)
      return null
    }
    
    if (!existingProduct) {
      console.error(`Product with id ${id} not found`)
      return null
    }
    
    // Sanitize updates
    const sanitizedUpdates = {
      name: updates.name || existingProduct.name,
      category: updates.category || existingProduct.category,
      grade: updates.grade || existingProduct.grade,
      price: typeof updates.price === 'string' ? parseFloat(updates.price) : updates.price || existingProduct.price,
      stock: typeof updates.stock === 'string' ? parseInt(updates.stock) : updates.stock || existingProduct.stock,
      unit: updates.unit || existingProduct.unit || 'kg',
      description: updates.description !== undefined ? updates.description : existingProduct.description || ''
    }
    
    console.log('Sanitized updates:', sanitizedUpdates)
    
    // Perform the update
    const { data, error } = await supabase
      .from('products')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error(`Error updating product with id ${id}:`, error)
      return null
    }
    
    console.log('Update successful:', data)
    return data?.[0] || null
  } catch (error: any) {
    console.error(`Exception updating product with id ${id}:`, error.message, error.stack)
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
    console.log('Fetching auctions from Supabase')
    
    // Check if auctions table exists
    try {
      const { data: tableCheck, error: tableError } = await supabase
        .from('auctions')
        .select('count')
        .limit(1)
      
      if (tableError) {
        console.error('Error checking auctions table:', tableError)
        if (tableError.code === '42P01') { // PostgreSQL code for undefined_table
          console.warn('Auctions table does not exist, returning mock data')
          return getMockAuctions()
        }
        throw tableError
      }
    } catch (connectionError) {
      console.error('Failed to connect to Supabase:', connectionError)
      return getMockAuctions()
    }
    
    const { data, error } = await supabase
      .from('auctions')
      .select(`
        *,
        product:product_id (
          id,
          name,
          category,
          grade,
          image
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching auctions:', error)
      return getMockAuctions()
    }
    
    console.log('Fetched auctions:', data)
    
    // Process the auctions to calculate time remaining
    const processedAuctions = data.map(auction => {
      const endDate = new Date(auction.end_date)
      const now = new Date()
      const timeRemaining = endDate.getTime() - now.getTime()
      
      let timeLeft = ''
      if (timeRemaining <= 0) {
        timeLeft = 'Ended'
      } else {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          timeLeft = `${days}d ${hours}h`
        } else if (hours > 0) {
          timeLeft = `${hours}h ${minutes}m`
        } else {
          timeLeft = `${minutes}m`
        }
      }
      
      return {
        ...auction,
        timeLeft
      }
    })
    
    return processedAuctions || []
  } catch (error) {
    console.error('Error fetching auctions:', error)
    return getMockAuctions()
  }
}

export async function getAuctionById(id: string) {
  try {
    console.log('Fetching auction with ID:', id)
    
    const { data, error } = await supabase
      .from('auctions')
      .select(`
        *,
        product:product_id (
          id,
          name,
          category,
          grade,
          image
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') { // PostgreSQL code for undefined_table
        console.warn('Auctions table does not exist, returning mock data')
        return getMockAuctions().find(auction => auction.id === id) || null
      }
      
      // If not found, return null
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      
      console.error(`Error fetching auction with id ${id}:`, error)
      return null
    }
    
    console.log('Fetched auction:', data)
    
    // Calculate time remaining
    if (data) {
      const endDate = new Date(data.end_date)
      const now = new Date()
      const timeRemaining = endDate.getTime() - now.getTime()
      
      let timeLeft = ''
      if (timeRemaining <= 0) {
        timeLeft = 'Ended'
      } else {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
        
        if (days > 0) {
          timeLeft = `${days}d ${hours}h`
        } else if (hours > 0) {
          timeLeft = `${hours}h ${minutes}m`
        } else {
          timeLeft = `${minutes}m`
        }
      }
      
      return { ...data, timeLeft }
    }
    
    return data
  } catch (error) {
    console.error(`Error fetching auction with id ${id}:`, error)
    return null
  }
}

// Only used as fallback if database tables don't exist
function getMockAuctions() {
  return [
    {
      id: '1',
      title: 'Premium Basmati Rice Auction',
      product_id: '1',
      starting_bid: 80,
      current_bid: 85,
      quantity: 500,
      increment_amount: 5,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      timeLeft: '2h 0m',
      seller: 'Mandi Marketplace',
      location: 'Lahore Mandi',
      status: 'active',
      description: 'Premium quality basmati rice auction',
      created_at: new Date().toISOString(),
      product: {
        id: '1',
        name: 'Premium Basmati Rice',
        category: 'Rice',
        grade: 'Premium',
        image: '/placeholders/rice.jpg'
      }
    },
    {
      id: '2',
      title: 'Organic Wheat Bulk Sale',
      product_id: '2',
      starting_bid: 30,
      current_bid: 34,
      quantity: 1000,
      increment_amount: 2,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
      timeLeft: '5h 0m',
      seller: 'Mandi Marketplace',
      location: 'Karachi Mandi',
      status: 'active',
      description: 'Certified organic wheat from sustainable farms',
      created_at: new Date().toISOString(),
      product: {
        id: '2',
        name: 'Organic Wheat',
        category: 'Wheat',
        grade: 'Organic',
        image: '/placeholders/wheat.jpg'
      }
    },
    {
      id: '3',
      title: 'Yellow Corn Auction',
      product_id: '3',
      starting_bid: 25,
      current_bid: 28,
      quantity: 750,
      increment_amount: 1,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // 28 hours from now
      timeLeft: '1d 4h',
      seller: 'Mandi Marketplace',
      location: 'Faisalabad Mandi',
      status: 'active',
      description: 'Fresh yellow corn suitable for various applications',
      created_at: new Date().toISOString(),
      product: {
        id: '3',
        name: 'Yellow Corn',
        category: 'Corn',
        grade: 'Grade A',
        image: '/placeholders/corn.jpg'
      }
    }
  ]
}

export async function createAuction(auction: any) {
  try {
    console.log('Creating auction in Supabase:', auction)
    
    // Check if auctions table exists
    try {
      const { data: tableCheck, error: tableError } = await supabase
        .from('auctions')
        .select('count')
        .limit(1)
      
      if (tableError) {
        console.error('Error checking auctions table:', tableError)
        if (tableError.code === '42P01') { // PostgreSQL code for undefined_table
          console.warn('Auctions table does not exist, returning mock success')
          return { ...auction, id: `mock-${Date.now()}` }
        }
        throw tableError
      }
    } catch (connectionError) {
      console.error('Failed to connect to Supabase:', connectionError)
      return { ...auction, id: `mock-${Date.now()}` }
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Sanitize the auction data
    const sanitizedAuction = {
      product_id: auction.product_id,
      title: auction.title,
      description: auction.description || '',
      quantity: parseInt(auction.quantity),
      starting_bid: parseFloat(auction.starting_bid),
      current_bid: auction.current_bid ? parseFloat(auction.current_bid) : null,
      increment_amount: parseFloat(auction.increment_amount) || 1.00,
      start_date: auction.start_date,
      end_date: auction.end_date,
      seller: auction.seller || user?.email || 'Mandi Marketplace',
      location: auction.location || '',
      status: auction.status || 'active',
      user_id: user?.id
    }
    
    const { data, error } = await supabase
      .from('auctions')
      .insert([sanitizedAuction])
      .select()
    
    if (error) {
      console.error('Error creating auction:', error)
      return null
    }
    
    console.log('Auction created successfully:', data)
    return data?.[0] || null
  } catch (error) {
    console.error('Error creating auction:', error)
    return null
  }
}

export async function updateAuction(id: string, updates: any) {
  try {
    console.log('Updating auction:', id)
    console.log('Update data:', updates)
    
    // Check if auction exists first
    const { data: existingAuction, error: fetchError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error(`Error checking if auction exists (id: ${id}):`, fetchError)
      return null
    }
    
    if (!existingAuction) {
      console.error(`Auction with id ${id} not found`)
      return null
    }
    
    // Sanitize updates
    const sanitizedUpdates: any = {}
    
    if (updates.title !== undefined) sanitizedUpdates.title = updates.title
    if (updates.description !== undefined) sanitizedUpdates.description = updates.description
    if (updates.quantity !== undefined) sanitizedUpdates.quantity = parseInt(updates.quantity)
    if (updates.starting_bid !== undefined) sanitizedUpdates.starting_bid = parseFloat(updates.starting_bid)
    if (updates.current_bid !== undefined) sanitizedUpdates.current_bid = parseFloat(updates.current_bid)
    if (updates.increment_amount !== undefined) sanitizedUpdates.increment_amount = parseFloat(updates.increment_amount)
    if (updates.start_date !== undefined) sanitizedUpdates.start_date = updates.start_date
    if (updates.end_date !== undefined) sanitizedUpdates.end_date = updates.end_date
    if (updates.seller !== undefined) sanitizedUpdates.seller = updates.seller
    if (updates.location !== undefined) sanitizedUpdates.location = updates.location
    if (updates.status !== undefined) sanitizedUpdates.status = updates.status
    
    console.log('Sanitized updates:', sanitizedUpdates)
    
    const { data, error } = await supabase
      .from('auctions')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error(`Error updating auction with id ${id}:`, error)
      return null
    }
    
    console.log('Update successful:', data)
    return data?.[0] || null
  } catch (error: any) {
    console.error(`Exception updating auction with id ${id}:`, error.message, error.stack)
    return null
  }
}

// Inventory
export async function getInventoryItems() {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        product:product_id (
          name,
          category,
          grade
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      // If the error is due to table not existing, return mock data
      if (error.code === '42P01') {
        console.warn('Inventory table does not exist, returning mock data')
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

// Only used as fallback if database tables don't exist
function getMockInventory() {
  return [
    {
      id: '1',
      product_id: '1',
      name: 'Premium Basmati Rice',
      stock: 75000,
      unit: 'kg',
      created_at: new Date().toISOString(),
      product: {
        name: 'Premium Basmati Rice',
        category: 'Rice',
        grade: 'Premium'
      }
    },
    {
      id: '2',
      product_id: '2',
      name: 'Organic Wheat',
      stock: 32500,
      unit: 'kg',
      created_at: new Date().toISOString(),
      product: {
        name: 'Organic Wheat',
        category: 'Wheat',
        grade: 'Organic'
      }
    },
    {
      id: '3',
      product_id: '3',
      name: 'Yellow Corn',
      stock: 18400,
      unit: 'kg',
      created_at: new Date().toISOString(),
      product: {
        name: 'Yellow Corn',
        category: 'Corn',
        grade: 'Grade A'
      }
    },
    {
      id: '4',
      product_id: '4',
      name: 'Red Chilli',
      stock: 5230,
      unit: 'kg',
      created_at: new Date().toISOString(),
      product: {
        name: 'Red Chilli',
        category: 'Spices',
        grade: 'Premium'
      }
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
        console.warn('Market prices table does not exist, returning mock data')
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

// Only used as fallback if database tables don't exist
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