'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from '@/utils/supabase/client'
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/utils/cn"

// Update Product interface to match our schema
interface Product {
  id: number
  name: string
  description: string
  price: number
  cost: number
  tax_rate: number
  hsn_code: string
  barcode: string
  sku: string
  unit_of_measurement: string
  quantity_in_stock: number
}

interface FormError {
  field: string;
  message: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    tax_rate: 0,
    hsn_code: '',
    barcode: '',
    sku: '',
    unit_of_measurement: 'piece',
    quantity_in_stock: 0
  })
  const [error, setError] = useState<string>('')
  const [errors, setErrors] = useState<FormError[]>([])
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')

    if (error) {
      setError('Failed to fetch products')
      console.error('Error fetching products:', error)
      return
    }

    setProducts(data || [])
  }

  const validateForm = (): boolean => {
    const newErrors: FormError[] = []

    if (!newProduct.name?.trim()) {
      newErrors.push({
        field: 'name',
        message: 'Product name is required'
      })
    }

    if (!newProduct.price || newProduct.price <= 0) {
      newErrors.push({
        field: 'price',
        message: 'Price must be greater than 0'
      })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCreateProduct = async () => {
    if (!validateForm()) {
      return
    }

    const { error: insertError } = await supabase
      .from('products')
      .insert([{
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        cost: newProduct.cost,
        tax_rate: newProduct.tax_rate,
        hsn_code: newProduct.hsn_code,
        barcode: newProduct.barcode,
        sku: newProduct.sku,
        unit_of_measurement: newProduct.unit_of_measurement,
        quantity_in_stock: newProduct.quantity_in_stock
      }])

    if (insertError) {
      setError('Failed to create product')
      console.error('Error creating product:', insertError)
      return
    }

    fetchProducts()
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      cost: 0,
      tax_rate: 0,
      hsn_code: '',
      barcode: '',
      sku: '',
      unit_of_measurement: 'piece',
      quantity_in_stock: 0
    })
    setErrors([])
    setError('')
    setOpen(false)
  }

  const formatPrice = (price: number | null): string => {
    if (price === null || typeof price !== 'number') return '$0.00'
    return `$${price.toFixed(2)}`
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for the new product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <TooltipProvider>
                {/* Product Name */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="name" className="text-right">
                        Name *
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter a unique product name</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3 space-y-2">
                    <Input
                      id="name"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className={cn(
                        getFieldError('name') && "border-red-500 focus-visible:ring-red-500"
                      )}
                      required
                    />
                    {getFieldError('name') && (
                      <p className="text-sm text-red-500">
                        {getFieldError('name')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Provide a detailed description of the product</p>
                    </TooltipContent>
                  </Tooltip>
                  <Textarea
                    id="description"
                    placeholder="Product Description"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                {/* Price and Cost */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-right">
                        Pricing *
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter selling price and cost</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Selling Price</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        className={cn(
                          getFieldError('price') && "border-red-500 focus-visible:ring-red-500"
                        )}
                        min="0"
                        step="0.01"
                        required
                      />
                      {getFieldError('price') && (
                        <p className="text-sm text-red-500">
                          {getFieldError('price')}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost Price</Label>
                      <Input
                        id="cost"
                        type="number"
                        placeholder="0.00"
                        value={newProduct.cost || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) })}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax Rate */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="tax_rate" className="text-right">
                        Tax Rate
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter tax rate percentage</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3">
                    <Input
                      id="tax_rate"
                      type="number"
                      placeholder="0"
                      value={newProduct.tax_rate ? (newProduct.tax_rate * 100) : ''}
                      onChange={(e) => setNewProduct({ ...newProduct, tax_rate: parseFloat(e.target.value) / 100 })}
                      min="0"
                      max="100"
                      className="w-32"
                    />
                  </div>
                </div>

                {/* Stock Information */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-right">
                        Stock Info
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter stock quantity and unit of measurement</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity in Stock</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="0"
                        value={newProduct.quantity_in_stock || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity_in_stock: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit of Measurement</Label>
                      <Input
                        id="unit"
                        placeholder="piece"
                        value={newProduct.unit_of_measurement || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, unit_of_measurement: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Product Identifiers */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-right">
                        Identifiers
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter product identification codes</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3 grid grid-cols-3 gap-4">
                    <Input
                      id="sku"
                      placeholder="SKU"
                      value={newProduct.sku || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    />
                    <Input
                      id="hsn_code"
                      placeholder="HSN Code"
                      value={newProduct.hsn_code || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, hsn_code: e.target.value })}
                    />
                    <Input
                      id="barcode"
                      placeholder="Barcode"
                      value={newProduct.barcode || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                    />
                  </div>
                </div>

                {error && (
                  <div className="col-span-4 rounded-md bg-red-50 p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TooltipProvider>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProduct}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Tax Rate</TableHead>
            <TableHead>HSN Code</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.description || '-'}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{formatPrice(product.cost)}</TableCell>
              <TableCell>{(product.tax_rate * 100).toFixed(0)}%</TableCell>
              <TableCell>{product.hsn_code || '-'}</TableCell>
              <TableCell>{product.sku || '-'}</TableCell>
              <TableCell>{product.quantity_in_stock}</TableCell>
              <TableCell>{product.unit_of_measurement}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}