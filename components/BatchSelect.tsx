"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SimBatch, useSimBatches } from "@/hooks/use-addSim"


interface BatchSelectWithSearchProps {
  value: number | null
  onChange: (batchId: number | null, batchNetwork: string | null, batchName: string | null) => void
  // New prop: optional array of batches to use instead of fetching internally
  batches?: SimBatch[]
}

const BatchSelectWithSearch: React.FC<BatchSelectWithSearchProps> = ({ value, onChange, batches }) => {
  const [open, setOpen] = React.useState(false)
  // Use provided batches or fetch them if not provided
  const { data: fetchedBatchesData, isLoading: isLoadingFetchedBatches } = useSimBatches({ page: 1, limit: 100 })

  const allBatches = batches || fetchedBatchesData?.simBatch || []
  const isLoading = batches ? false : isLoadingFetchedBatches // If batches are provided, no internal loading

  const selectedBatch = React.useMemo(() => {
    if (allBatches && value) {
      return allBatches.find((batch) => batch.id === value)
    }
    return null
  }, [allBatches, value])

  const batchOptions = React.useMemo(() => {
    return (
      allBatches.map((batch) => ({
        value: batch.id,
        label: `${batch.batch_name} (${batch.network || "No Network"}) - ${batch.quantity} SIMs`,
        network: batch.network,
        name: batch.batch_name,
      })) || []
    )
  }, [allBatches])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
          disabled={isLoading}
        >
          {selectedBatch ? selectedBatch.batch_name : "Select batch..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Search batch..." />
          <CommandList>
            <CommandEmpty>No batch found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <CommandItem disabled>Loading batches...</CommandItem>
              ) : (
                batchOptions.map((batch) => (
                  <CommandItem
                    key={batch.value}
                    value={batch.label}
                    onSelect={() => {
                      onChange(batch.value, batch.network, batch.name)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === batch.value ? "opacity-100" : "opacity-0")} />
                    {batch.label}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default BatchSelectWithSearch
