import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, BarChart3, CircleDollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RecentAuctions } from "@/components/dashboard/recent-auctions"
import { MarketPrices } from "@/components/dashboard/market-prices"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Dashboard() {
  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link href="/products/add">
              <Button>
                <Package className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add New Product</span>
                <span className="sm:hidden">Add Product</span>
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="py-2">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="py-2">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">₹45,231.89</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center">
                      +20.1% <TrendingUp className="ml-1 h-3 w-3" />
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">+12</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center">
                      +4 <TrendingUp className="ml-1 h-3 w-3" />
                    </span>{" "}
                    new this week
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
                  <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center">
                      +2 <TrendingUp className="ml-1 h-3 w-3" />
                    </span>{" "}
                    from last week
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Link href="/purchases" className="text-primary flex items-center">
                      View all <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4 border-none shadow-md">
                <CardHeader className="bg-primary/5">
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2 pt-6">
                  <RevenueChart />
                </CardContent>
              </Card>

              <Card className="col-span-full lg:col-span-3 border-none shadow-md">
                <CardHeader className="bg-primary/5">
                  <CardTitle>Market Prices</CardTitle>
                  <CardDescription>Today's prices across major mandis</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <MarketPrices />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-full lg:col-span-4 border-none shadow-md">
                <CardHeader className="bg-primary/5">
                  <CardTitle>Recent Auctions</CardTitle>
                  <CardDescription>Latest auctions from across the platform</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <RecentAuctions />
                </CardContent>
              </Card>

              <Card className="col-span-full lg:col-span-3 border-none shadow-md">
                <CardHeader className="bg-primary/5">
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Current stock levels of your top products</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: "Premium Basmati Rice", stock: 75, total: 100 },
                      { name: "Organic Wheat", stock: 32, total: 50 },
                      { name: "Yellow Corn", stock: 18, total: 40 },
                      { name: "Red Chilli", stock: 5, total: 30 },
                      { name: "Turmeric Powder", stock: 24, total: 25 },
                    ].map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.stock}/{item.total} kg
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${
                              (item.stock / item.total) < 0.2
                                ? "bg-destructive"
                                : item.stock / item.total < 0.5
                                  ? "bg-yellow-500"
                                  : "bg-primary"
                            }`}
                            style={{ width: `${(item.stock / item.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics will be displayed here.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="border-none shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generate and view reports here.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Reports dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

