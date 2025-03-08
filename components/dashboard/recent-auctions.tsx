"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const recentAuctions = [
  {
    id: "AUC-001",
    product: "Premium Basmati Rice",
    quantity: "500 kg",
    startingBid: 75,
    currentBid: 82,
    endTime: "2h 15m",
    status: "active",
  },
  {
    id: "AUC-002",
    product: "Organic Wheat",
    quantity: "1000 kg",
    startingBid: 30,
    currentBid: 34,
    endTime: "5h 30m",
    status: "active",
  },
  {
    id: "AUC-003",
    product: "Yellow Corn",
    quantity: "750 kg",
    startingBid: 25,
    currentBid: 28,
    endTime: "1d 4h",
    status: "active",
  },
  {
    id: "AUC-004",
    product: "Red Chilli",
    quantity: "200 kg",
    startingBid: 110,
    currentBid: 125,
    endTime: "8h 45m",
    status: "active",
  },
  {
    id: "AUC-005",
    product: "Turmeric Powder",
    quantity: "150 kg",
    startingBid: 90,
    currentBid: 92,
    endTime: "3h 20m",
    status: "active",
  },
]

export function RecentAuctions() {
  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="hidden sm:table-cell">Quantity</TableHead>
            <TableHead className="text-right">Current Bid (₹/kg)</TableHead>
            <TableHead className="text-right">Ends In</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentAuctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell className="font-medium">{auction.product}</TableCell>
              <TableCell className="hidden sm:table-cell">{auction.quantity}</TableCell>
              <TableCell className="text-right">₹{auction.currentBid}</TableCell>
              <TableCell className="text-right">
                <Badge variant={auction.endTime.includes("d") ? "outline" : "secondary"} className="gap-1">
                  <Clock className="h-3 w-3" />
                  {auction.endTime}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" className="h-8 px-2 text-xs">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

