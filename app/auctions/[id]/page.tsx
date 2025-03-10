"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Gavel, User, MapPin, CalendarClock, TrendingUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { getAuctionById } from "@/lib/supabase-service"
import { toast } from "@/hooks/use-toast"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"

// Define the params interface
interface PageParams {
  id: string;
}

export default function AuctionDetailPage({ params }: { params: any }) {
  // Unwrap the params Promise
  const resolvedParams = use(params) as PageParams
  const auctionId = resolvedParams.id
  
  const router = useRouter()
  const [auction, setAuction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState<string>('')

  useEffect(() => {
    async function fetchAuction() {
      try {
        setLoading(true)
        const auctionData = await getAuctionById(auctionId)

        if (!auctionData) {
          toast({
            title: "Auction not found",
            description: "The auction you're looking for doesn't exist or has been removed.",
            variant: "destructive"
          })
          router.push('/auctions')
          return
        }

        setAuction(auctionData)
        
        // Set initial bid amount to current bid + increment
        const currentBid = auctionData.current_bid || auctionData.starting_bid
        const nextBid = (currentBid + auctionData.increment_amount).toFixed(2)
        setBidAmount(nextBid)
        
      } catch (error) {
        console.error('Error fetching auction details:', error)
        toast({
          title: "Error",
          description: "Failed to load auction details. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAuction()
  }, [auctionId, router])

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const bidValue = parseFloat(bidAmount)
    const minBid = (auction.current_bid || auction.starting_bid) + auction.increment_amount
    
    if (bidValue < minBid) {
      toast({
        title: "Bid too low",
        description: `Your bid must be at least ${minBid.toFixed(2)} PKR/kg`,
        variant: "destructive"
      })
      return
    }
    
    // In a real app, this would send the bid to the server
    toast({
      title: "Bid placed",
      description: `Your bid of ${bidValue.toFixed(2)} PKR/kg has been placed successfully.`,
    })
    
    // For demo purposes, update the auction locally
    setAuction({
      ...auction,
      current_bid: bidValue
    })
    
    // Calculate next bid amount
    const nextBid = (bidValue + auction.increment_amount).toFixed(2)
    setBidAmount(nextBid)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Loading auction details...</p>
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Auction not found</p>
          <Button className="mt-4" onClick={() => router.push('/auctions')}>
            Return to Auctions
          </Button>
        </div>
      </div>
    )
  }

  // Calculate auction progress
  const startDate = new Date(auction.start_date)
  const endDate = new Date(auction.end_date)
  const now = new Date()
  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4"
          onClick={() => router.push('/auctions')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{auction.title}</h1>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Badge className="mr-2">{auction.product.category}</Badge>
              <span>{auction.product.name} • {auction.product.grade}</span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center">
            <Badge 
              variant={auction.timeLeft.includes('Ended') ? 'destructive' : 'secondary'}
              className="flex items-center px-3 py-1 text-base"
            >
              <Clock className="mr-1 h-4 w-4" />
              {auction.timeLeft}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main image card */}
          <Card>
            <div className="relative h-64 md:h-80 w-full rounded-t-lg overflow-hidden">
              <Image
                src={auction.product?.image || '/placeholders/rice.jpg'}
                alt={auction.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">
                {auction.description || 'No description provided for this auction.'}
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Seller: <strong>{auction.seller}</strong></span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Location: <strong>{auction.location}</strong></span>
                </div>
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Start Date: <strong>{formatDate(auction.start_date)}</strong></span>
                </div>
                <div className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>End Date: <strong>{formatDate(auction.end_date)}</strong></span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Auction Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          {/* Bidding history would go here in a real app */}
        </div>
        
        <div className="space-y-6">
          {/* Bidding card */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
              <CardDescription>Bid on this product before the auction ends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Starting Bid</div>
                <div className="font-semibold">{auction.starting_bid} PKR/kg</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Current Bid</div>
                <div className="text-lg font-bold text-primary">
                  {auction.current_bid || auction.starting_bid} PKR/kg
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Minimum Increment</div>
                <div>{auction.increment_amount} PKR/kg</div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Quantity Available</div>
                <div className="font-semibold">{auction.quantity} kg</div>
              </div>
              
              <form onSubmit={handleBidSubmit} className="mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bidAmount">Your Bid (PKR/kg)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="bidAmount"
                        type="number"
                        step="0.01"
                        min={(auction.current_bid || auction.starting_bid) + auction.increment_amount}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        className="flex-1"
                      />
                      <Button type="submit" disabled={auction.timeLeft === 'Ended'}>
                        <Gavel className="mr-2 h-4 w-4" />
                        Place Bid
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum bid: {((auction.current_bid || auction.starting_bid) + auction.increment_amount).toFixed(2)} PKR/kg
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                By placing a bid, you agree to our <Link href="#" className="text-primary underline">Terms and Conditions</Link>.
              </div>
            </CardFooter>
          </Card>
          
          {/* Seller info card */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{auction.seller}</div>
                  <div className="text-sm text-muted-foreground">{auction.location}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">Contact Seller</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Admin actions for demonstration */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/auctions/edit/${auction.id}`}>
                <Button variant="outline" className="w-full">
                  Edit Auction
                </Button>
              </Link>
              <Button variant="destructive" className="w-full">
                Cancel Auction
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 