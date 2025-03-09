import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowUpDown, Check, Download, Edit, MoreHorizontal, Package, Plus, Upload } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function InventoryPage() {
  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Inventory Management</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Upload className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Stock</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Across 5 categories</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-primary"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">PKR 84,432.50</div>
              <p className="text-xs text-muted-foreground mt-1">Based on current market prices</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">Items below reorder level</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">Items with zero inventory</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input placeholder="Search inventory..." className="w-full sm:w-[300px]" />
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
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>
              Manage your product inventory, update stock levels, and track product status.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0">
                  <TableRow>
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        Price (PKR/kg)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.sku}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">PKR {item.price}</TableCell>
                      <TableCell className="text-right">{item.stock} kg</TableCell>
                      <TableCell>
                        <Badge variant={item.stock === 0 ? "destructive" : item.stock < 50 ? "outline" : "secondary"}>
                          {item.stock === 0 ? "Out of Stock" : item.stock < 50 ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Verified
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

const inventoryItems = [
  {
    sku: "RICE-001",
    name: "Premium Basmati Rice",
    category: "Rice",
    price: 85,
    stock: 500,
  },
  {
    sku: "WHEAT-001",
    name: "Organic Wheat",
    category: "Wheat",
    price: 32,
    stock: 1000,
  },
  {
    sku: "CORN-001",
    name: "Yellow Corn",
    category: "Corn",
    price: 28,
    stock: 750,
  },
  {
    sku: "SPICE-001",
    name: "Red Chilli",
    category: "Spices",
    price: 120,
    stock: 30,
  },
  {
    sku: "SPICE-002",
    name: "Turmeric Powder",
    category: "Spices",
    price: 95,
    stock: 24,
  },
  {
    sku: "RICE-002",
    name: "Brown Rice",
    category: "Rice",
    price: 65,
    stock: 350,
  },
  {
    sku: "PULSE-001",
    name: "Moong Dal",
    category: "Pulses",
    price: 110,
    stock: 200,
  },
  {
    sku: "PULSE-002",
    name: "Toor Dal",
    category: "Pulses",
    price: 95,
    stock: 0,
  },
]

