'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from '@/utils/supabase/client'

// Update Product interface to match Supabase schema
interface Product {
  id: number
  name: string
  product_description: string | null
  price: number | null
  product_tax_rate: number | null
  hsn_code: string | null
  hsn_number: string | null
  barcode: string | null
  created_at: string
  updated_at: string
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    product_description: '',
    price: 0,
    product_tax_rate: 0,
    hsn_code: '',
    hsn_number: '',
    barcode: ''
  })
  const [error, setError] = useState<string>('')
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

  const handleCreateProduct = async () => {
    const { name, price } = newProduct
    if (!name || typeof price !== 'number' || price <= 0) {
      setError('Product name and price are required')
      return
    }

    const { error: insertError } = await supabase
      .from('products')
      .insert([newProduct])

    if (insertError) {
      setError('Failed to create product')
      console.error('Error creating product:', insertError)
      return
    }

    fetchProducts()
    setNewProduct({
      name: '',
      product_description: '',
      price: 0,
      product_tax_rate: 0,
      hsn_code: '',
      hsn_number: '',
      barcode: ''
    })
    setError('')
  }

  const formatPrice = (price: number | null): string => {
    if (price === null || typeof price !== 'number') return '$0.00'
    return `$${price.toFixed(2)}`
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for the new product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product_name" className="text-right">
                  Product Name
                </Label>
                <Input
                  id="product_name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product_description" className="text-right">
                  Description
                </Label>
                <Input
                  id="product_description"
                  value={newProduct.product_description}
                  onChange={(e) => setNewProduct({ ...newProduct, product_description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                />
              </div>
              {/* Add other fields as needed */}
              {error && (
                <div className="col-span-4 text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>HSN Code</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.product_description || '-'}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>{product.hsn_code || '-'}</TableCell>
              <TableCell>
                {product.created_at ? new Date(product.created_at).toLocaleDateString() : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}