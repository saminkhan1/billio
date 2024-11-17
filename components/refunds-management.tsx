'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from 'uuid'
import { Refund } from '@/utils/types'
import { mockRefunds } from '@/utils/mocks'

export function RefundsManagement() {
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds)
  const [newRefund, setNewRefund] = useState<Omit<Refund, 'id'>>({ date: '', invoiceId: '', receiptId: '', name: '', mode: 'Credit Card', amount: 0 })
  const [error, setError] = useState<string>('')

  const handleCreateRefund = () => {
    const { date, invoiceId, receiptId, name, mode, amount } = newRefund
    if (!date || !invoiceId || !receiptId || !name || !mode || amount <= 0) {
      setError('All fields are required and amount must be greater than 0.')
      return
    }
    const refund: Refund = {
      id: uuidv4(),
      date,
      invoiceId,
      receiptId,
      name,
      mode,
      amount,
    }
    setRefunds([...refunds, refund])
    setNewRefund({ date: '', invoiceId: '', receiptId: '', name: '', mode: 'Credit Card', amount: 0 })
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end ">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Record Refund
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Refund</DialogTitle>
              <DialogDescription>
                Enter the details for the new refund.
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
                  value={newRefund.date}
                  onChange={(e) => setNewRefund({ ...newRefund, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoiceId" className="text-right">
                  Invoice #
                </Label>
                <Input
                  id="invoiceId"
                  value={newRefund.invoiceId}
                  onChange={(e) => setNewRefund({ ...newRefund, invoiceId: e.target.value })}
                  className="col-span-3"
                  placeholder="INV001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receiptId" className="text-right">
                  Receipt #
                </Label>
                <Input
                  id="receiptId"
                  value={newRefund.receiptId}
                  onChange={(e) => setNewRefund({ ...newRefund, receiptId: e.target.value })}
                  className="col-span-3"
                  placeholder="REC001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newRefund.name}
                  onChange={(e) => setNewRefund({ ...newRefund, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Client Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mode" className="text-right">
                  Mode
                </Label>
                <Select
                  value={newRefund.mode}
                  onValueChange={(value) => setNewRefund({ ...newRefund, mode: value as Refund['mode'] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newRefund.amount}
                  onChange={(e) => setNewRefund({ ...newRefund, amount: parseFloat(e.target.value) })}
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
              <Button onClick={handleCreateRefund}>Record Refund</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Receipt #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {refunds.map((refund) => (
            <TableRow key={refund.id}>
              <TableCell>{refund.date}</TableCell>
              <TableCell>{refund.invoiceId}</TableCell>
              <TableCell>{refund.receiptId}</TableCell>
              <TableCell>{refund.name}</TableCell>
              <TableCell>{refund.mode}</TableCell>
              <TableCell>${refund.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 