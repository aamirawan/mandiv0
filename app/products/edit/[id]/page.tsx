'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProductById, updateProduct } from '@/lib/supabase-service'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { use } from 'react'

// Define a type for the params
interface PageParams {
  id: string;
}

export default function EditProductPage({ params }: { params: any }) {
  // Unwrap the params Promise using React.use() with type annotation
  const resolvedParams = use(params) as PageParams
  const productId = resolvedParams.id
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    grade: '',
    price: '',
    stock: '',
    unit: 'kg',
    description: ''
  })

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log('Fetching product with ID:', productId)
        const productData = await getProductById(productId)
        
        if (!productData) {
          toast({
            title: "Product not found",
            description: "The product you're trying to edit doesn't exist.",
            variant: "destructive"
          })
          router.push('/products')
          return
        }
        
        console.log('Product data:', productData)
        setProduct(productData)
        setFormData({
          name: productData.name || '',
          category: productData.category || '',
          grade: productData.grade || '',
          price: productData.price?.toString() || '',
          stock: productData.stock?.toString() || '',
          unit: productData.unit || 'kg',
          description: productData.description || ''
        })
      } catch (error) {
        console.error('Error fetching product:', error)
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProduct()
  }, [productId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate required fields
      const requiredFields = ['name', 'category', 'grade', 'price', 'stock']
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        }
      }

      // Validate numeric fields
      if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        throw new Error('Price must be a positive number')
      }
      
      if (isNaN(Number(formData.stock)) || Number(formData.stock) <= 0) {
        throw new Error('Stock must be a positive number')
      }

      console.log('Updating product with data:', formData)
      
      // Update the product
      const updatedProduct = await updateProduct(productId, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      })
      
      if (!updatedProduct) {
        throw new Error('Failed to update product. Operation returned null.')
      }
      
      toast({
        title: "Product Updated",
        description: "Your product has been updated successfully.",
      })
      
      router.push('/products')
    } catch (error: any) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: error.message || 'Failed to update product',
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container p-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/products')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Premium Basmati Rice"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Corn">Corn</SelectItem>
                <SelectItem value="Spices">Spices</SelectItem>
                <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="e.g. Premium, A, Organic"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (PKR)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              min="1"
              step="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g. kg, tons, etc."
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product..."
            rows={4}
          />
        </div>
        
        <div className="flex gap-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Updating..." : "Update Product"}
          </Button>
          
          <Button type="button" variant="outline" onClick={() => router.push('/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 