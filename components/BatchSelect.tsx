"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSimBatches } from "@/hooks/use-addSim"


const networks = [
  { value: "MTN", label: "MTN" },
  { value: "Airtel", label: "Airtel" },
  { value: "Glo", label: "Glo" },
  { value: "9mobile", label: "9mobile" },
]

interface BatchSelectWithSearchProps {
  value: number | null
  onChange: (batchId: number | null, batchNetwork: string | null, batchName: string | null) => void
}

const BatchSelectWithSearch: React.FC<BatchSelectWithSearchProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false)
  const { data: batchesData, isLoading: isLoadingBatches } = useSimBatches({ page: 1, limit: 100 }) 
  console.log(batchesData, "batchesData")

  const selectedBatch = React.useMemo(() => {
    if (batchesData && value) {
      return batchesData.simBatch.find((batch) => batch.id === value)
    }
    return null
  }, [batchesData, value])

  const batchOptions = React.useMemo(() => {
    return (
      batchesData?.simBatch.map((batch) => ({
        value: batch.id,
        label: `${batch.batch_name} (${batch.network || "No Network"}) - ${batch.quantity} SIMs`,
        network: batch.network,
        name: batch.batch_name,
      })) || []
    )
  }, [batchesData])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
          disabled={isLoadingBatches}
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
              {isLoadingBatches ? (
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
