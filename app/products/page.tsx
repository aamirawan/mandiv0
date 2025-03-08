import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Gavel, MoreVertical, Plus, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ProductsPage() {
  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">My Products</h2>
          <div className="flex items-center space-x-2">
            <Link href="/products/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add New Product</span>
                <span className="sm:hidden">Add Product</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input placeholder="Search products..." className="w-full sm:w-[300px]" />
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
            <Select defaultValue="newest">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="stock-high">Stock: High to Low</SelectItem>
                <SelectItem value="stock-low">Stock: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="grid" className="py-2">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" className="py-2">
              List View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden border-none shadow-md">
                  <div className="relative h-48 w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardHeader className="p-4 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1 text-base">{product.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Gavel className="mr-2 h-4 w-4" />
                            Create Auction
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      {product.category} • {product.grade}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span className="font-medium">₹{product.price}/kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available:</span>
                      <span className="font-medium">{product.stock} kg</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm">
                      <Gavel className="mr-2 h-4 w-4" />
                      Auction
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="list" className="space-y-4">
            <Card className="border-none shadow-md">
              <CardContent className="p-0">
                <div className="rounded-md">
                  <div className="grid grid-cols-5 bg-primary/5 px-4 py-3 font-medium">
                    <div className="col-span-2">Product</div>
                    <div className="text-center">Price</div>
                    <div className="text-center">Stock</div>
                    <div className="text-center">Actions</div>
                  </div>
                  <ScrollArea className="h-[500px]">
                    {products.map((product) => (
                      <div key={product.id} className="grid grid-cols-5 items-center px-4 py-3 border-b">
                        <div className="col-span-2 flex items-center gap-4">
                          <div className="relative h-10 w-10 overflow-hidden rounded-md">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.category} • {product.grade}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">₹{product.price}/kg</div>
                        <div className="text-center">{product.stock} kg</div>
                        <div className="flex justify-center space-x-2">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Gavel className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

const products = [
  {
    id: "PROD-001",
    name: "Premium Basmati Rice",
    category: "Rice",
    grade: "Premium",
    price: 85,
    stock: 500,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "PROD-002",
    name: "Organic Wheat",
    category: "Wheat",
    grade: "Organic",
    price: 32,
    stock: 1000,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "PROD-003",
    name: "Yellow Corn",
    category: "Corn",
    grade: "Standard",
    price: 28,
    stock: 750,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "PROD-004",
    name: "Red Chilli",
    category: "Spices",
    grade: "Premium",
    price: 120,
    stock: 200,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "PROD-005",
    name: "Turmeric Powder",
    category: "Spices",
    grade: "Standard",
    price: 95,
    stock: 150,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "PROD-006",
    name: "Brown Rice",
    category: "Rice",
    grade: "Standard",
    price: 65,
    stock: 350,
    image: "/placeholder.svg?height=400&width=400",
  },
]

