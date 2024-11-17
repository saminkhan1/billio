'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid'
import { PurchaseOrder } from '@/utils/types'
import { mockPurchaseOrders } from '@/utils/mocks'

export function PurchaseOrderManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [newPurchaseOrder, setNewPurchaseOrder] = useState<Omit<PurchaseOrder, 'id'>>({
    date: '',
    poNumber: '',
    vendorName: '',
    contact: '',
    email: '',
    amount: 0
  })
  const [error, setError] = useState<string>('')

  const handleCreatePurchaseOrder = () => {
    const { date, poNumber, vendorName, contact, email, amount } = newPurchaseOrder
    if (!date || !poNumber || !vendorName || !contact || !email || amount <= 0) {
      setError('All fields are required and amount must be greater than 0.')
      return
    }
    const purchaseOrder: PurchaseOrder = {
      id: uuidv4(),
      date,
      poNumber,
      vendorName,
      contact,
      email,
      amount
    }
    setPurchaseOrders([...purchaseOrders, purchaseOrder])
    setNewPurchaseOrder({ date: '', poNumber: '', vendorName: '', contact: '', email: '', amount: 0 })
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Purchase Order</DialogTitle>
              <DialogDescription>
                Enter the details for the new purchase order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newPurchaseOrder.date}
                  onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="poNumber" className="text-right">
                  PO #
                </Label>
                <Input
                  id="poNumber"
                  value={newPurchaseOrder.poNumber}
                  onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, poNumber: e.target.value })}
                  className="col-span-3"
                  placeholder="PO-001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendorName" className="text-right">
                  Vendor Name
                </Label>
                <Input
                  id="vendorName"
                  value={newPurchaseOrder.vendorName}
                  onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, vendorName: e.target.value })}
                  className="col-span-3"
                  placeholder="Vendor Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact #
                </Label>
                <Input
                  id="contact"
                  value={newPurchaseOrder.contact}
                  onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, contact: e.target.value })}
                  className="col-span-3"
                  placeholder="(555) 123-4567"
                  type="tel"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newPurchaseOrder.email}
                  onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, email: e.target.value })}
                  className="col-span-3"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPurchaseOrder.amount}
                  onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, amount: parseFloat(e.target.value) })}
                  className="col-span-3"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {error && (
                <div className="col-span-4 text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePurchaseOrder}>Create Purchase Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>PO #</TableHead>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Contact #</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.map((po) => (
            <TableRow key={po.id}>
              <TableCell>{po.date}</TableCell>
              <TableCell>{po.poNumber}</TableCell>
              <TableCell>{po.vendorName}</TableCell>
              <TableCell>{po.contact}</TableCell>
              <TableCell>{po.email}</TableCell>
              <TableCell>${po.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 