"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product } from "@/utils/types"

interface ProductSelectProps {
  products: Product[]
  selectedId: number
  onSelect: (id: number) => void
}

export function ProductSelect({ products, selectedId, onSelect }: ProductSelectProps) {
  return (
    <Select
      value={String(selectedId || '')}
      onValueChange={(value) => onSelect(Number(value))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select product" />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => (
          <SelectItem key={product.id} value={String(product.id)}>
            <div className="flex justify-between items-center gap-2">
              <span className="truncate">{product.name}</span>
              <span className="text-muted-foreground">
                ${product.price?.toFixed(2)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 