"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/lib/supabase-service'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [bucketMissing, setBucketMissing] = useState(false)
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    grade: '',
    price: '',
    stock: '',
    unit: 'kg',
    description: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setBucketMissing(false) // Reset bucket missing state when file changes
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      const requiredFields = ['name', 'category', 'grade', 'price', 'stock']
      for (const field of requiredFields) {
        if (!productData[field as keyof typeof productData]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
        }
      }

      // Validate numeric fields
      if (isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
        throw new Error('Price must be a positive number')
      }
      
      if (isNaN(Number(productData.stock)) || Number(productData.stock) <= 0) {
        throw new Error('Stock must be a positive number')
      }

      // Format data for database
      const product = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        image: '',  // Add default empty image field
        unit: productData.unit || 'kg'  // Ensure unit has a default value
      }

      // Handle file upload if a file is selected
      if (selectedFile) {
        try {
          console.log('Uploading file:', selectedFile.name)
          
          // Check if bucket exists first
          const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
          if (bucketError) {
            console.error('Error listing buckets:', bucketError)
            throw new Error('Unable to access storage: ' + bucketError.message)
          }
          
          const bucketExists = buckets.some(bucket => bucket.name === 'product-images')
          if (!bucketExists) {
            console.error('Bucket product-images does not exist')
            setBucketMissing(true)
            // Use a placeholder image instead of failing
            const categoryMap: Record<string, string> = {
              'Rice': '/placeholders/rice.jpg',
              'Wheat': '/placeholders/wheat.jpg',
              'Corn': '/placeholders/corn.jpg',
              'Spices': '/placeholders/spices.jpg'
            }
            product.image = categoryMap[product.category] || '/placeholders/rice.jpg'
            
            // Show a warning toast but continue with product creation
            toast({
              title: 'Storage Not Configured',
              description: 'The product-images bucket does not exist. Using placeholder image instead.',
              variant: 'destructive',
            })
          } else {
            // Create a unique file name
            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(fileName, selectedFile)
            
            if (uploadError) {
              console.error('File upload error:', uploadError)
              throw new Error('Failed to upload image: ' + uploadError.message)
            }
            
            console.log('File uploaded successfully:', uploadData)
            
            // Get public URL for the uploaded file
            const { data: urlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(fileName)
              
            // Add image to the product data
            product.image = urlData.publicUrl
          }
        } catch (uploadErr: any) {
          console.error('Upload process error:', uploadErr)
          toast({
            title: 'Upload Error',
            description: uploadErr.message || 'Failed to upload image',
            variant: 'destructive',
          })
          // Continue without image rather than failing the whole product creation
          const categoryMap: Record<string, string> = {
            'Rice': '/placeholders/rice.jpg',
            'Wheat': '/placeholders/wheat.jpg',
            'Corn': '/placeholders/corn.jpg',
            'Spices': '/placeholders/spices.jpg'
          }
          product.image = categoryMap[product.category] || '/placeholders/rice.jpg'
        }
      } else {
        // If no image uploaded, use a placeholder based on category
        const categoryMap: Record<string, string> = {
          'Rice': '/placeholders/rice.jpg',
          'Wheat': '/placeholders/wheat.jpg',
          'Corn': '/placeholders/corn.jpg',
          'Spices': '/placeholders/spices.jpg'
        }
        
        product.image = categoryMap[product.category] || '/placeholders/rice.jpg'
      }
      
      console.log('Creating product with data:', product)
      
      // Create product in the database
      const newProduct = await createProduct(product)
      
      if (!newProduct) {
        throw new Error('Failed to create product. Database operation returned null.')
      }
      
      toast({
        title: 'Product Created',
        description: `${product.name} has been added successfully.`,
      })
      
      // Redirect to products page
      router.push('/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-gray-500">Create a new product listing</p>
      </div>
      
      {bucketMissing && (
        <Alert variant="destructive" className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Supabase Storage Not Configured</AlertTitle>
          <AlertDescription>
            The 'product-images' storage bucket doesn't exist in your Supabase project. 
            <ol className="list-decimal ml-5 mt-2">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to Storage section</li>
              <li>Create a new bucket named "product-images"</li>
              <li>Set appropriate permissions</li>
            </ol>
            <p className="mt-2">Your product will be created with a placeholder image.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Premium Basmati Rice"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={productData.category} 
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
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select 
              value={productData.grade} 
              onValueChange={(value) => handleSelectChange('grade', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Grade A">Grade A</SelectItem>
                <SelectItem value="Grade B">Grade B</SelectItem>
                <SelectItem value="Organic">Organic</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select 
              value={productData.unit} 
              onValueChange={(value) => handleSelectChange('unit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="ton">ton</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price (PKR/kg)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 85.00"
              value={productData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Available Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              placeholder="e.g. 500"
              value={productData.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter product description..."
            rows={4}
            value={productData.description}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-xs text-gray-500">Upload a product image (optional)</p>
        </div>
        
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

