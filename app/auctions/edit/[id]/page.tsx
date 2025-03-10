"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAuctionById, updateAuction, getProducts } from "@/lib/supabase-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { use } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Define the params interface
interface PageParams {
  id: string;
}

export default function EditAuctionPage({ params }: { params: any }) {
  // Unwrap the params Promise
  const resolvedParams = use(params) as PageParams
  const auctionId = resolvedParams.id
  
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    product_id: '',
    description: '',
    quantity: '',
    starting_bid: '',
    current_bid: '',
    increment_amount: '',
    start_date: new Date(),
    end_date: new Date(),
    seller: '',
    location: '',
    status: 'active'
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch products for the dropdown
        const productsData = await getProducts()
        setProducts(productsData)
        
        // Fetch auction data
        const auctionData = await getAuctionById(auctionId)

        if (!auctionData) {
          toast({
            title: "Auction not found",
            description: "The auction you're trying to edit doesn't exist.",
            variant: "destructive"
          })
          router.push('/auctions')
          return
        }

        // Set form data from auction
        setFormData({
          title: auctionData.title || '',
          product_id: auctionData.product_id || '',
          description: auctionData.description || '',
          quantity: auctionData.quantity?.toString() || '',
          starting_bid: auctionData.starting_bid?.toString() || '',
          current_bid: auctionData.current_bid?.toString() || '',
          increment_amount: auctionData.increment_amount?.toString() || '',
          start_date: auctionData.start_date ? new Date(auctionData.start_date) : new Date(),
          end_date: auctionData.end_date ? new Date(auctionData.end_date) : new Date(),
          seller: auctionData.seller || '',
          location: auctionData.location || '',
          status: auctionData.status || 'active'
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load auction data. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [auctionId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate the form data
      const requiredFields = ['title', 'product_id', 'quantity', 'starting_bid', 'increment_amount', 'end_date']
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`${field.replace('_', ' ')} is required`)
        }
      }

      // Make sure end date is after start date
      if (formData.end_date <= formData.start_date) {
        throw new Error('End date must be after start date')
      }

      // Prepare data for update
      const updateData = {
        title: formData.title,
        product_id: formData.product_id,
        description: formData.description,
        quantity: parseInt(formData.quantity),
        starting_bid: parseFloat(formData.starting_bid),
        current_bid: formData.current_bid ? parseFloat(formData.current_bid) : null,
        increment_amount: parseFloat(formData.increment_amount),
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        seller: formData.seller,
        location: formData.location,
        status: formData.status
      }

      // Update the auction
      const updatedAuction = await updateAuction(auctionId, updateData)

      if (!updatedAuction) {
        throw new Error('Failed to update auction. Please try again.')
      }

      toast({
        title: "Auction Updated",
        description: "The auction has been updated successfully.",
      })

      router.push(`/auctions/${auctionId}`)
    } catch (error: any) {
      console.error('Error updating auction:', error)
      toast({
        title: "Error",
        description: error.message || 'Failed to update auction',
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading auction data...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/auctions/${auctionId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Auction
        </Button>
        <h1 className="text-2xl font-bold">Edit Auction</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Auction Title*</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Premium Basmati Rice Auction"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_id">Product*</Label>
            <Select 
              value={formData.product_id} 
              onValueChange={(value) => handleSelectChange('product_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (kg)*</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              step="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="starting_bid">Starting Bid (PKR/kg)*</Label>
            <Input
              id="starting_bid"
              name="starting_bid"
              type="number"
              value={formData.starting_bid}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_bid">Current Bid (PKR/kg)</Label>
            <Input
              id="current_bid"
              name="current_bid"
              type="number"
              value={formData.current_bid}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              placeholder="Auto-set if empty"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="increment_amount">Bid Increment (PKR)*</Label>
            <Input
              id="increment_amount"
              name="increment_amount"
              type="number"
              value={formData.increment_amount}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? format(formData.start_date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date) => handleDateChange('start_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? format(formData.end_date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.end_date}
                  onSelect={(date) => handleDateChange('end_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller">Seller</Label>
            <Input
              id="seller"
              name="seller"
              value={formData.seller}
              onChange={handleInputChange}
              placeholder="Seller name or company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Lahore Mandi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe the auction and product details"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Update Auction"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(`/auctions/${auctionId}`)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 