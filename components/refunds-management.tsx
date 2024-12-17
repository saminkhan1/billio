'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from '@/utils/supabase/client'

interface Refund {
  id: number
  date: string
  invoice_id: string
  receipt_id: string
  name: string
  mode: 'Credit Card' | 'Cash' | 'Bank Transfer'
  amount: number
}

export function RefundsManagement() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [newRefund, setNewRefund] = useState<Omit<Refund, 'id'>>({
    date: '',
    invoice_id: '',
    receipt_id: '',
    name: '',
    mode: 'Credit Card',
    amount: 0
  })
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchRefunds()
  }, [])

  const fetchRefunds = async () => {
    const { data, error } = await supabase
      .from('refunds')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      setError('Failed to fetch refunds')
      console.error('Error fetching refunds:', error)
      return
    }

    setRefunds(data || [])
  }

  const handleCreateRefund = async () => {
    const { date, invoice_id, receipt_id, name, mode, amount } = newRefund
    if (!date || !invoice_id || !receipt_id || !name || !mode || amount <= 0) {
      setError('All fields are required and amount must be greater than 0.')
      return
    }

    const { error: insertError } = await supabase
      .from('refunds')
      .insert([{
        date,
        invoice_id,
        receipt_id,
        name,
        mode,
        amount
      }])

    if (insertError) {
      setError('Failed to create refund')
      console.error('Error creating refund:', insertError)
      return
    }

    fetchRefunds()
    setNewRefund({
      date: '',
      invoice_id: '',
      receipt_id: '',
      name: '',
      mode: 'Credit Card',
      amount: 0
    })
    setError('')
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
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
                <Label htmlFor="invoice_id" className="text-right">
                  Invoice #
                </Label>
                <Input
                  id="invoice_id"
                  value={newRefund.invoice_id}
                  onChange={(e) => setNewRefund({ ...newRefund, invoice_id: e.target.value })}
                  className="col-span-3"
                  placeholder="INV001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receipt_id" className="text-right">
                  Receipt #
                </Label>
                <Input
                  id="receipt_id"
                  value={newRefund.receipt_id}
                  onChange={(e) => setNewRefund({ ...newRefund, receipt_id: e.target.value })}
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
              <TableCell>{new Date(refund.date).toLocaleDateString()}</TableCell>
              <TableCell>{refund.invoice_id}</TableCell>
              <TableCell>{refund.receipt_id}</TableCell>
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