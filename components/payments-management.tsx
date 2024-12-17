'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Payment, Client } from '@/utils/types'
import { createClient } from '@/utils/supabase/client'

type NewPayment = Omit<Payment, 'payment_id'>

interface SupabasePayment extends Omit<Payment, 'pay_date'> {
  pay_date: string
}

export function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [newPayment, setNewPayment] = useState<NewPayment>({
    client_id: 0,
    pay_date: new Date(),
    mode: 'Credit Card',
    amount: 0,
    deposit_to: '',
    issuer: '',
    reference_number: '',
    comments: ''
  })
  const [formError, setFormError] = useState<string>('')
  const supabase = createClient()

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')

    if (error) {
      console.error('Error fetching clients:', error)
      return
    }

    setClients(data || [])
  }

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        clients (
          company_name
        )
      `)
      .order('pay_date', { ascending: false })

    if (error) {
      setFormError('Failed to fetch payments')
      console.error('Error fetching payments:', error)
      return
    }

    // Convert date strings to Date objects
    const processedPayments = (data || []).map((payment: SupabasePayment) => ({
      ...payment,
      pay_date: new Date(payment.pay_date)
    }))

    setPayments(processedPayments)
  }

  useEffect(() => {
    fetchPayments()
    fetchClients()
  }, [])

  const handleCreatePayment = async () => {
    const { client_id, pay_date, mode, amount, deposit_to, issuer, reference_number, comments } = newPayment
    
    if (!client_id || !pay_date || !mode || amount <= 0) {
      setFormError('Client, date, payment mode and amount are required. Amount must be greater than 0.')
      return
    }

    const { error: insertError } = await supabase
      .from('payments')
      .insert([{
        client_id,
        pay_date: pay_date.toISOString().split('T')[0],
        mode,
        amount,
        deposit_to,
        issuer,
        reference_number,
        comments
      }])

    if (insertError) {
      setFormError('Failed to record payment')
      console.error('Error recording payment:', insertError)
      return
    }

    await fetchPayments()
    setNewPayment({
      client_id: 0,
      pay_date: new Date(),
      mode: 'Credit Card',
      amount: 0,
      deposit_to: '',
      issuer: '',
      reference_number: '',
      comments: ''
    })
    setFormError('')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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
                Enter the payment details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client_id" className="text-right">
                  Client *
                </Label>
                <Select
                  value={newPayment.client_id.toString()}
                  onValueChange={(value) => setNewPayment({ ...newPayment, client_id: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pay_date" className="text-right">
                  Payment Date *
                </Label>
                <Input
                  id="pay_date"
                  type="date"
                  value={newPayment.pay_date.toISOString().split('T')[0]}
                  onChange={(e) => setNewPayment({ ...newPayment, pay_date: new Date(e.target.value) })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mode" className="text-right">
                  Payment Method *
                </Label>
                <Select
                  value={newPayment.mode}
                  onValueChange={(value) => {
                    if (value === 'Cash') {
                      // Clear the fields when cash is selected
                      setNewPayment(prev => ({
                        ...prev,
                        mode: value,
                        deposit_to: '',
                        issuer: '',
                        reference_number: ''
                      }))
                    } else {
                      setNewPayment(prev => ({ ...prev, mode: value }))
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount *
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

              {newPayment.mode !== 'Cash' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deposit_to" className="text-right">
                      Deposit To
                    </Label>
                    <Input
                      id="deposit_to"
                      value={newPayment.deposit_to}
                      onChange={(e) => setNewPayment({ ...newPayment, deposit_to: e.target.value })}
                      className="col-span-3"
                      placeholder="Bank account or destination"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="issuer" className="text-right">
                      Issuer
                    </Label>
                    <Input
                      id="issuer"
                      value={newPayment.issuer}
                      onChange={(e) => setNewPayment({ ...newPayment, issuer: e.target.value })}
                      className="col-span-3"
                      placeholder="Bank or payment issuer"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reference_number" className="text-right">
                      Reference
                    </Label>
                    <Input
                      id="reference_number"
                      value={newPayment.reference_number}
                      onChange={(e) => setNewPayment({ ...newPayment, reference_number: e.target.value })}
                      className="col-span-3"
                      placeholder="Transaction reference or cheque number"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comments" className="text-right">
                  Comments
                </Label>
                <Input
                  id="comments"
                  value={newPayment.comments}
                  onChange={(e) => setNewPayment({ ...newPayment, comments: e.target.value })}
                  className="col-span-3"
                  placeholder="Additional notes..."
                />
              </div>

              {formError && (
                <div className="col-span-4 text-red-500 text-sm">
                  {formError}
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
            <TableHead>Client</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.payment_id}>
              <TableCell>{payment.pay_date.toLocaleDateString()}</TableCell>
              <TableCell>{(payment as any).clients?.company_name || '-'}</TableCell>
              <TableCell>{payment.mode}</TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
              <TableCell>{payment.reference_number || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 