'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, Gavel, Plus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { getProducts } from '@/lib/supabase-service'

// Define a Product interface
interface Product {
  id: string;
  name: string;
  category: string;
  grade: string;
  price: number;
  stock: number;
  image?: string;
  images?: any[];
  created_at: string;
}

export default function ProductsPage() {
  const [view, setView] = useState('grid')
  const [sortOrder, setSortOrder] = useState('newest')
  const router = useRouter()
  
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/products/add')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input 
            type="text" 
            placeholder="Search products..." 
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="border rounded-md p-2 bg-white" 
            defaultValue="all"
          >
            <option value="all">All Categories</option>
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="corn">Corn</option>
            <option value="spices">Spices</option>
          </select>
          
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-2 ${view === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button 
              className={`px-3 py-2 ${view === 'list' ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
          
          <select 
            className="border rounded-md p-2 bg-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>
      
      <ProductsList view={view} />
    </div>
  )
}

interface ProductsListProps {
  view: string;
}

function ProductsList({ view }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // This will load the products on the client side
  useEffect(() => {
    async function loadProducts() {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])
  
  if (loading) {
    return <div className="text-center py-8">Loading products...</div>
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No products found. Add your first product to get started.</p>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/products/add')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>
    )
  }
  
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-2 h-48 bg-gray-100 flex items-center justify-center">
              <Image 
                src={getProductImage(product)} 
                alt={product.name}
                width={200}
                height={150}
                className="object-cover max-h-full"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {product.category} • {product.grade}
              </p>
              
              <div className="flex justify-between text-sm mb-1">
                <span>Price:</span>
                <span className="font-medium">PKR {product.price}/kg</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Available:</span>
                <span className="font-medium">{product.stock} kg</span>
              </div>
              
              <div className="flex justify-between">
                <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center">
                  <Gavel className="h-4 w-4 mr-1" />
                  Auction
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-5 bg-gray-100 px-4 py-2">
        <div className="col-span-2 font-medium">Product</div>
        <div className="text-center font-medium">Price</div>
        <div className="text-center font-medium">Stock</div>
        <div className="text-center font-medium">Actions</div>
      </div>
      
      {products.map(product => (
        <div key={product.id} className="grid grid-cols-5 items-center px-4 py-3 border-b">
          <div className="col-span-2 flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
              <Image 
                src={getProductImage(product)} 
                alt={product.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-xs text-gray-500">{product.category} • {product.grade}</div>
            </div>
          </div>
          <div className="text-center">PKR {product.price}/kg</div>
          <div className="text-center">{product.stock} kg</div>
          <div className="flex justify-center space-x-2">
            <button className="bg-white border border-gray-300 p-1 rounded">
              <Edit className="h-4 w-4" />
            </button>
            <button className="bg-white border border-gray-300 p-1 rounded">
              <Gavel className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

const getProductImage = (product: Product) => {
  // If product has no image data, use placeholder based on category
  if (!product.image && (!product.images || !product.images.length)) {
    const placeholders: Record<string, string> = {
      'Rice': '/placeholders/rice.jpg',
      'Wheat': '/placeholders/wheat.jpg',
      'Corn': '/placeholders/corn.jpg',
      'Spices': '/placeholders/spices.jpg'
    }
    
    return placeholders[product.category] || '/placeholders/rice.jpg'
  }

  // If image is a full URL already (including Public URL from Supabase), use it directly
  if (product.image && (product.image.startsWith('http') || product.image.startsWith('/'))) {
    return product.image
  }
  
  // If image is a filename from Supabase storage, build the full URL
  if (product.image) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    return `${supabaseUrl}/storage/v1/object/public/product-images/${product.image}`
  }
  
  // Legacy support for images array (if still in use)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    return `${supabaseUrl}/storage/v1/object/public/product-images/${product.images[0]}`
  }
  
  // Final fallback
  return '/placeholders/rice.jpg'
}

