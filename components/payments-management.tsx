'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Payment } from '@/utils/types'
import { mockPayments } from '@/utils/mocks'
import { v4 as uuidv4 } from 'uuid'

export function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [newPayment, setNewPayment] = useState<Omit<Payment, 'id'>>({ date: '', invoiceId: '', name: '', mode: 'Credit Card', amount: 0 })
  const [error, setError] = useState<string>('')

  const handleCreatePayment = () => {
    const { date, invoiceId, name, mode, amount } = newPayment
    if (!date || !invoiceId || !name || !mode || amount <= 0) {
      setError('All fields are required and amount must be greater than 0.')
      return
    }
    const payment: Payment = {
      id: uuidv4(),
      date,
      invoiceId,
      name,
      mode,
      amount,
    }
    setPayments([...payments, payment])
    setNewPayment({ date: '', invoiceId: '', name: '', mode: 'Credit Card', amount: 0 })
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end ">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
              <DialogDescription>
                Enter the details for the new payment.
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
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoiceId" className="text-right">
                  Invoice #
                </Label>
                <Input
                  id="invoiceId"
                  value={newPayment.invoiceId}
                  onChange={(e) => setNewPayment({ ...newPayment, invoiceId: e.target.value })}
                  className="col-span-3"
                  placeholder="INV001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newPayment.name}
                  onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Client Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mode" className="text-right">
                  Mode
                </Label>
                <Select
                  value={newPayment.mode}
                  onValueChange={(value) => setNewPayment({ ...newPayment, mode: value as Payment['mode'] })}
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
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
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
              <Button onClick={handleCreatePayment}>Record Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.invoiceId}</TableCell>
              <TableCell>{payment.name}</TableCell>
              <TableCell>{payment.mode}</TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 