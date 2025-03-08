"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingDown, TrendingUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const marketPrices = [
  {
    product: "Basmati Rice",
    price: 85,
    change: 2.5,
    location: "Delhi Mandi",
  },
  {
    product: "Wheat",
    price: 32,
    change: -1.2,
    location: "Ludhiana Mandi",
  },
  {
    product: "Yellow Corn",
    price: 28,
    change: 0.8,
    location: "Karnal Mandi",
  },
  {
    product: "Red Chilli",
    price: 120,
    change: 5.3,
    location: "Guntur Mandi",
  },
  {
    product: "Turmeric",
    price: 95,
    change: -2.1,
    location: "Sangli Mandi",
  },
]

export function MarketPrices() {
  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Price (₹/kg)</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marketPrices.map((item) => (
            <TableRow key={item.product}>
              <TableCell className="font-medium">{item.product}</TableCell>
              <TableCell className="text-right">₹{item.price}</TableCell>
              <TableCell className="text-right">
                <span
                  className={`flex items-center justify-end ${item.change > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {item.change > 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {Math.abs(item.change)}%
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">{item.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

