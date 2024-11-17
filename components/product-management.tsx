'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Mock data for products
const mockProducts = [
  { id: 1, product_name: 'Widget A', customs_code: 'WA001', unit_selling_price: 19.99, available_units: 100, reorder_level: 20 },
  { id: 2, product_name: 'Gadget B', customs_code: 'GB002', unit_selling_price: 29.99, available_units: 75, reorder_level: 15 },
  { id: 3, product_name: 'Tool C', customs_code: 'TC003', unit_selling_price: 39.99, available_units: 50, reorder_level: 10 },
]

export function ProductManagement() {
  const [products, setProducts] = useState(mockProducts)
  const [newProduct, setNewProduct] = useState({ product_name: '', customs_code: '', unit_selling_price: '', available_units: '', reorder_level: '' })

  const handleCreateProduct = () => {
    const product = {
      id: products.length + 1,
      product_name: newProduct.product_name,
      customs_code: newProduct.customs_code,
      unit_selling_price: parseFloat(newProduct.unit_selling_price),
      available_units: parseInt(newProduct.available_units),
      reorder_level: parseInt(newProduct.reorder_level),
    }
    setProducts([...products, product])
    setNewProduct({ product_name: '', customs_code: '', unit_selling_price: '', available_units: '', reorder_level: '' })
  }

  const handleReorder = (productId: number) => {
    // Implement reorder logic here
    console.log(`Reorder requested for product ID: ${productId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end ">
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
                  value={newProduct.product_name}
                  onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customs_code" className="text-right">
                  Customs Code
                </Label>
                <Input
                  id="customs_code"
                  value={newProduct.customs_code}
                  onChange={(e) => setNewProduct({ ...newProduct, customs_code: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit_selling_price" className="text-right">
                  Unit Selling Price
                </Label>
                <Input
                  id="unit_selling_price"
                  type="number"
                  value={newProduct.unit_selling_price}
                  onChange={(e) => setNewProduct({ ...newProduct, unit_selling_price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="available_units" className="text-right">
                  Available Units
                </Label>
                <Input
                  id="available_units"
                  type="number"
                  value={newProduct.available_units}
                  onChange={(e) => setNewProduct({ ...newProduct, available_units: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reorder_level" className="text-right">
                  Reorder Level
                </Label>
                <Input
                  id="reorder_level"
                  type="number"
                  value={newProduct.reorder_level}
                  onChange={(e) => setNewProduct({ ...newProduct, reorder_level: e.target.value })}
                  className="col-span-3"
                />
              </div>
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
              <TableHead>Customs Code</TableHead>
              <TableHead>Unit Selling Price</TableHead>
              <TableHead>Available Units</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.customs_code}</TableCell>
                <TableCell>${product.unit_selling_price.toFixed(2)}</TableCell>
                <TableCell>{product.available_units}</TableCell>
                <TableCell>{product.reorder_level}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleReorder(product.id)}
                    variant="outline"
                    size="sm"
                    className={product.available_units <= product.reorder_level ? "bg-yellow-100 hover:bg-yellow-200" : ""}
                  >
                    Reorder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}