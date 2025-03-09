import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Clock, Gavel, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AuctionsPage() {
  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Browse Auctions</h2>
          <div className="flex items-center space-x-2">
            <Link href="/auctions/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create Auction</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input placeholder="Search auctions..." className="w-full sm:w-[300px]" />
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="spices">Spices</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Select defaultValue="ending-soon">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="bids-high">Most Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="active" className="py-2">
              Active
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="py-2">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="ended" className="py-2">
              Ended
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {auctions.map((auction) => (
                <Card key={auction.id} className="overflow-hidden border-none shadow-md">
                  <div className="relative h-48 w-full">
                    <Badge className="absolute top-2 right-2 z-10">{auction.bids} bids</Badge>
                    <Image
                      src={auction.image || "/placeholder.svg"}
                      alt={auction.product}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-4 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1 text-base">{auction.product}</CardTitle>
                      <Badge
                        variant={
                          auction.timeLeft.includes("h")
                            ? "destructive"
                            : auction.timeLeft.includes("d")
                              ? "outline"
                              : "secondary"
                        }
                        className="gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {auction.timeLeft}
                      </Badge>
                    </div>
                    <CardDescription>
                      {auction.seller} • {auction.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Current Bid:</span>
                      <span className="font-medium">PKR {auction.currentBid}/kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quantity:</span>
                      <span className="font-medium">{auction.quantity}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                    <Button size="sm">
                      <Gavel className="mr-2 h-4 w-4" />
                      Bid
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle>Upcoming Auctions</CardTitle>
                <CardDescription>Auctions that will start soon.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-center p-8 text-center">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">No upcoming auctions at the moment.</p>
                    <p className="text-sm text-muted-foreground">Check back later or create your own auction.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ended" className="space-y-4">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle>Ended Auctions</CardTitle>
                <CardDescription>Auctions that have already ended.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-center p-8 text-center">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">No ended auctions in the last 30 days.</p>
                    <p className="text-sm text-muted-foreground">Older auctions are archived.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

const auctions = [
  {
    id: "AUC-001",
    product: "Premium Basmati Rice",
    seller: "Agro Farms Ltd",
    location: "Delhi",
    quantity: "500 kg",
    startingBid: 75,
    currentBid: 82,
    bids: 8,
    timeLeft: "2h 15m",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "AUC-002",
    product: "Organic Wheat",
    seller: "Green Harvests",
    location: "Punjab",
    quantity: "1000 kg",
    startingBid: 30,
    currentBid: 34,
    bids: 12,
    timeLeft: "5h 30m",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "AUC-003",
    product: "Yellow Corn",
    seller: "Sunshine Farms",
    location: "Haryana",
    quantity: "750 kg",
    startingBid: 25,
    currentBid: 28,
    bids: 6,
    timeLeft: "1d 4h",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "AUC-004",
    product: "Red Chilli",
    seller: "Spice Traders Inc",
    location: "Andhra Pradesh",
    quantity: "200 kg",
    startingBid: 110,
    currentBid: 125,
    bids: 15,
    timeLeft: "8h 45m",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "AUC-005",
    product: "Turmeric Powder",
    seller: "Organic Spices Co",
    location: "Maharashtra",
    quantity: "150 kg",
    startingBid: 90,
    currentBid: 92,
    bids: 4,
    timeLeft: "3h 20m",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "AUC-006",
    product: "Brown Rice",
    seller: "Natural Grains",
    location: "West Bengal",
    quantity: "350 kg",
    startingBid: 60,
    currentBid: 65,
    bids: 7,
    timeLeft: "12h 10m",
    image: "/placeholder.svg?height=400&width=400",
  },
]

