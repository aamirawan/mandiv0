"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Clock, Gavel, Plus, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAuctions } from "@/lib/supabase-service"
import { toast } from "@/hooks/use-toast"

// Define an Auction interface to match our database structure
interface Auction {
  id: string;
  title: string;
  product_id: string;
  description: string;
  quantity: number;
  starting_bid: number;
  current_bid: number | null;
  increment_amount: number;
  start_date: string;
  end_date: string;
  seller: string;
  location: string;
  status: string;
  timeLeft: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    category: string;
    grade: string;
    image: string;
  };
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('ending-soon');
  const [activeTab, setActiveTab] = useState('active');

  // Fetch auctions on component mount
  useEffect(() => {
    async function fetchAuctions() {
      try {
        setLoading(true);
        const auctionsData = await getAuctions();
        
        // Format the data for display
        const formattedAuctions = auctionsData.map((auction: any) => ({
          ...auction,
          // Ensure proper display values
          quantity: typeof auction.quantity === 'number' ? auction.quantity : parseInt(auction.quantity || '0'),
          current_bid: auction.current_bid || auction.starting_bid
        }));
        
        setAuctions(formattedAuctions);
        setFilteredAuctions(formattedAuctions);
        console.log('Auctions loaded:', formattedAuctions);
      } catch (error) {
        console.error('Error loading auctions:', error);
        toast({
          title: "Error",
          description: "Failed to load auction data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchAuctions();
  }, []);

  // Apply filters and sorting whenever the dependencies change
  useEffect(() => {
    let filtered = [...auctions];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(auction => 
        auction.title.toLowerCase().includes(query) || 
        auction.product?.name.toLowerCase().includes(query) ||
        auction.description?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(auction => 
        auction.product?.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(auction => 
        auction.status === 'active' && 
        !auction.timeLeft.includes('Ended')
      );
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(auction => 
        auction.status === 'upcoming' ||
        new Date(auction.start_date) > new Date()
      );
    } else if (activeTab === 'ended') {
      filtered = filtered.filter(auction => 
        auction.status === 'ended' || 
        auction.timeLeft.includes('Ended')
      );
    }
    
    // Apply sorting
    if (sortOrder === 'ending-soon') {
      filtered.sort((a, b) => {
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      });
    } else if (sortOrder === 'newest') {
      filtered.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else if (sortOrder === 'price-high') {
      filtered.sort((a, b) => {
        const aPrice = a.current_bid || a.starting_bid;
        const bPrice = b.current_bid || b.starting_bid;
        return bPrice - aPrice;
      });
    } else if (sortOrder === 'price-low') {
      filtered.sort((a, b) => {
        const aPrice = a.current_bid || a.starting_bid;
        const bPrice = b.current_bid || b.starting_bid;
        return aPrice - bPrice;
      });
    }
    
    setFilteredAuctions(filtered);
  }, [auctions, searchQuery, categoryFilter, sortOrder, activeTab]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  // Handle sort order change
  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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
            <Input 
              placeholder="Search auctions..." 
              className="w-full sm:w-[300px]" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Select 
              value={categoryFilter}
              onValueChange={handleCategoryChange}
            >
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
            <Select 
              value={sortOrder}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
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
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-muted-foreground">Loading auctions...</span>
            </div>
          ) : (
            <>
              <TabsContent value="active" className="space-y-4">
                {filteredAuctions.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAuctions.map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="No active auctions" 
                    description="There are no active auctions at the moment."
                  />
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-4">
                {filteredAuctions.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAuctions.map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="No upcoming auctions" 
                    description="There are no upcoming auctions at the moment."
                  />
                )}
              </TabsContent>
              
              <TabsContent value="ended" className="space-y-4">
                {filteredAuctions.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAuctions.map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="No ended auctions" 
                    description="There are no ended auctions to display."
                  />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </ScrollArea>
  )
}

// AuctionCard component for displaying individual auctions
function AuctionCard({ auction }: { auction: Auction }) {
  const getTimeBadgeVariant = (timeLeft: string) => {
    if (timeLeft.includes('Ended')) return 'destructive';
    if (timeLeft.includes('h')) return 'secondary';
    if (timeLeft.includes('d')) return 'outline';
    return 'secondary';
  };

  return (
    <Card key={auction.id} className="overflow-hidden border-none shadow-md">
      <div className="relative h-48 w-full">
        <Badge className="absolute top-2 right-2 z-10">
          {auction.current_bid ? `${auction.current_bid} PKR/kg` : `${auction.starting_bid} PKR/kg`}
        </Badge>
        <Image
          src={auction.product?.image || "/placeholders/rice.jpg"}
          alt={auction.product?.name || auction.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4 bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-base">{auction.title}</CardTitle>
          <Badge
            variant={getTimeBadgeVariant(auction.timeLeft)}
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
          <span className="font-medium">PKR {auction.current_bid || auction.starting_bid}/kg</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Quantity:</span>
          <span className="font-medium">{auction.quantity} kg</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <Link href={`/auctions/${auction.id}`}>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Details
          </Button>
        </Link>
        <Button size="sm">
          <Gavel className="mr-2 h-4 w-4" />
          Bid
        </Button>
      </CardFooter>
    </Card>
  );
}

// EmptyState component for when there are no auctions
function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-primary/5">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-center p-8 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">{description}</p>
            <p className="text-sm text-muted-foreground">Check back later or create your own auction.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

