import { supabase } from './supabase'

// Products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data || []
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    return null
  }
  
  return data
}

export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
  
  if (error) {
    console.error('Error creating product:', error)
    return null
  }
  
  return data?.[0] || null
}

export async function updateProduct(id: string, updates: any) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error(`Error updating product with id ${id}:`, error)
    return null
  }
  
  return data?.[0] || null
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error(`Error deleting product with id ${id}:`, error)
    return false
  }
  
  return true
}

// Auctions
export async function getAuctions() {
  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching auctions:', error)
    return []
  }
  
  return data || []
}

export async function createAuction(auction: any) {
  const { data, error } = await supabase
    .from('auctions')
    .insert([auction])
    .select()
  
  if (error) {
    console.error('Error creating auction:', error)
    return null
  }
  
  return data?.[0] || null
}

// Inventory
export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching inventory items:', error)
    return []
  }
  
  return data || []
}

// Market Prices
export async function getMarketPrices() {
  const { data, error } = await supabase
    .from('market_prices')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching market prices:', error)
    return []
  }
  
  return data || []
} 