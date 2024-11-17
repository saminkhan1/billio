'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for refunds
const mockRefunds = [
  { id: 1, date: '2023-05-01', invoiceId: 'INV001', receiptId: 'REC001', name: 'Acme Corp', mode: 'Credit Card', amount: 100 },
  { id: 2, date: '2023-05-05', invoiceId: 'INV002', receiptId: 'REC002', name: 'Globex Inc', mode: 'Bank Transfer', amount: 150 },
  { id: 3, date: '2023-05-08', invoiceId: 'INV003', receiptId: 'REC003', name: 'Initech', mode: 'Cash', amount: 80 },
]

export function RefundsManagement() {
  const [refunds, setRefunds] = useState(mockRefunds)
  const [newRefund, setNewRefund] = useState({ date: '', invoiceId: '', receiptId: '', name: '', mode: '', amount: '' })

  const handleCreateRefund = () => {
    const refund = {
      id: refunds.length + 1,
      date: newRefund.date,
      invoiceId: newRefund.invoiceId,
      receiptId: newRefund.receiptId,
      name: newRefund.name,
      mode: newRefund.mode,
      amount: parseFloat(newRefund.amount),
    }
    setRefunds([...refunds, refund])
    setNewRefund({ date: '', invoiceId: '', receiptId: '', name: '', mode: '', amount: '' })
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mode" className="text-right">
                  Mode
                </Label>
                <Select
                  onValueChange={(value) => setNewRefund({ ...newRefund, mode: value })}
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
                  onChange={(e) => setNewRefund({ ...newRefund, amount: e.target.value })}
                  className="col-span-3"
                />
              </div>
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