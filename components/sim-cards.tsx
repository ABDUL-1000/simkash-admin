"use client"

import { useState } from "react"
import { Search, Edit2, Trash2, MoreVerticalIcon, MoreVertical, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface Sims {
  SimNumber: string
  network: string
  ActiveDate: string
  ExpiryDate: string
  dataPlan: string
  status: "Active" | "pending" | "Inactive" 
}

export default function OrderProductsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 80

  const products: Sims[] = [
    { SimNumber: '07083175021', network: "MTN", ActiveDate: "Today, 9:12 AM", ExpiryDate: "2nd June, 2026", dataPlan: "Unlimited Yearly", status: "Active" },
    { SimNumber: " 07083175021", network: "MTN", ActiveDate: "Today, 9:12 AM", ExpiryDate: "2nd June, 2026", dataPlan: "Unlimited Yearly" , status: "Active" },
    { SimNumber: "0901XXXX456", network: "Airtel", ActiveDate: "Today, 9:12 AM", ExpiryDate: "2nd June, 2026", dataPlan: "Unlimited Yearly", status: "pending" },
    { SimNumber: "0901XXXX456", network: "Glo", ActiveDate: "Today, 9:12 AM", ExpiryDate: "2nd June, 2026", dataPlan: "Unlimited Yearly", status: "Inactive" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#F0FDF5] text-[#16A34A]"
      case "pending":
        return "bg-[#FDCA8647] text-[#FF9100]"
      case "Inactive":
        return "bg-[#FEF1F2] text-[#981B25]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden hidden lg:block">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search sim" className="pl-10 bg-white border border-gray-200 rounded-full h-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-30 bg-white border border-gray-200 rounded-full h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="beverages">Active</SelectItem> 
              <SelectItem value="food">Inactive</SelectItem>
              <SelectItem value="snacks">pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[80px] font-medium">Sim Number</TableHead>
                <TableHead className="font-medium">Network provider</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Activated On</TableHead>
                <TableHead className="font-medium">Expiry Date</TableHead>
                <TableHead className="font-medium">Data Plan</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((sim) => (
                <TableRow key={sim.SimNumber} className="">
                  <TableCell className="font-medium py-5">{sim.SimNumber}</TableCell>
                  <TableCell className="py-5">{sim.network}</TableCell>
                  <TableCell className="py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sim.status)}`}>
                      {sim.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#999999]">{sim.ActiveDate} </TableCell>
                  <TableCell className="py-5">{sim.ExpiryDate}</TableCell>
                  <TableCell className="py-5">{sim.dataPlan}</TableCell>
                  <TableCell className="text-right py-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-white shadow-md rounded-md border border-gray-200">
                        <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                         <span>Activate</span>
                          
                          <Image src="/arrow-right.png" alt="Activate" width={20} height={20} className="w-2 h-2 " />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                         <span>Subscribe</span>
                         
                          <Image src="/arrow-right.png" alt="Activate" width={20} height={20} className="w-2 h-2 " />
                        </DropdownMenuItem>
                       
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            className="text-sm rounded-full"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className={`w-8 h-8 p-0 text-sm rounded-full ${currentPage === page ? "bg-primary text-white" : "bg-white"}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <span className="mx-2 text-sm text-gray-500">of</span>
            <span className="text-sm text-gray-700">{totalPages}</span>
          </div>

          <Button
            variant="default"
            className="text-sm rounded-full bg-[#111827]"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}