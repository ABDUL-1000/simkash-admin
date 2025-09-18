"use client"

import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SimBatch, useSimBatches } from "@/hooks/use-addSim"

interface BatchSelectWithSearchProps {
  value: number | null
  onChange: (batchId: number | null, batchNetwork: string | null, batchName: string | null) => void
  batches?: SimBatch[]
}

const BatchSelectWithSearch: React.FC<BatchSelectWithSearchProps> = ({ value, onChange, batches }) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const { data: fetchedBatchesData, isLoading: isLoadingFetchedBatches } = useSimBatches({ page: 1, limit: 100 })

  const allBatches = batches || fetchedBatchesData?.simBatch || []
  const isLoading = batches ? false : isLoadingFetchedBatches

  const selectedBatch = React.useMemo(() => {
    if (allBatches && value) {
      return allBatches.find((batch) => batch.id === value)
    }
    return null
  }, [allBatches, value])

  // Filter batches based on search term
  const filteredBatches = React.useMemo(() => {
    if (!searchTerm) return allBatches
    return allBatches.filter((batch) => 
      batch.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.network && batch.network.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [allBatches, searchTerm])

  const handleValueChange = (newValue: string) => {
    const batchId = newValue ? parseInt(newValue) : null
    const selected = allBatches.find(batch => batch.id === batchId)
    onChange(batchId, selected?.network || null, selected?.batch_name || null)
  }

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange} disabled={isLoading}>
      <SelectTrigger className="w-full justify-between bg-transparent">
        <SelectValue placeholder="Select batch...">
          {selectedBatch ? selectedBatch.batch_name : "Select batch..."}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="p-0">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent closing the dropdown
            />
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="py-2 px-4 text-sm text-muted-foreground">Loading batches...</div>
          ) : filteredBatches.length === 0 ? (
            <div className="py-2 px-4 text-sm text-muted-foreground">
              {searchTerm ? "No batches found" : "No batches available"}
            </div>
          ) : (
            filteredBatches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id.toString()}>
                <div className="flex items-center">
                  <Check className={cn(
                    "mr-2 h-4 w-4 opacity-0",
                    value === batch.id && "opacity-100"
                  )} />
                  {`${batch.batch_name} (${batch.network || "No Network"}) - ${batch.quantity} SIMs`}
                </div>
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  )
}

export default BatchSelectWithSearch