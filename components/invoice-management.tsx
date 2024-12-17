'use client'

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/utils/cn"
import { Invoice as BaseInvoice, Client, Product, InvoiceLineItem } from '@/utils/types'
import { createClient } from '@/utils/supabase/client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ProductSelect } from "@/components/product-select"

type Invoice = BaseInvoice

type NewInvoice = {
  client_id: number
  invoice_number: string
  issue_date: Date
  due_date: Date
  subtotal: number
  vat_rate: number
  status: Invoice['status']
  notes: string
}

interface SupabaseInvoice extends Omit<Invoice, 'issue_date' | 'due_date'> {
  issue_date: string
  due_date: string
}

interface TempLineItem {
  temp_id: string
  product_id: number
  quantity: number
  price: number
  amount: number
  tax_rate: number
}

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [lineItems, setLineItems] = useState<TempLineItem[]>([])
  const [formError, setFormError] = useState<string>('')

  const [newInvoice, setNewInvoice] = useState<NewInvoice>({
    client_id: 0,
    invoice_number: '',
    issue_date: new Date(),
    due_date: new Date(),
    subtotal: 0,
    vat_rate: 15.00,
    status: 'Draft',
    notes: ''
  })

  const supabase = createClient()

  const [isCreating, setIsCreating] = useState(false)

  const fetchData = async () => {
    await Promise.all([
      fetchInvoices(),
      fetchClients(),
      fetchProducts()
    ])
  }

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('company_name')

    if (error) {
      console.error('Error fetching clients:', error)
      return
    }

    setClients(data || [])
  }

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (error) throw error

      const productsData = data || []
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('issue_date', { ascending: false })

    if (error) {
      setFormError('Failed to fetch invoices')
      console.error('Error fetching invoices:', error)
      return
    }

    const processedInvoices = (data || []).map((invoice: SupabaseInvoice) => ({
      ...invoice,
      issue_date: new Date(invoice.issue_date),
      due_date: new Date(invoice.due_date)
    }))

    setInvoices(processedInvoices)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addLineItem = () => {
    const newItem: TempLineItem = {
      temp_id: crypto.randomUUID(),
      product_id: 0,
      quantity: 0,
      price: 0,
      amount: 0,
      tax_rate: 0
    }
    setLineItems((prev: TempLineItem[]) => [...prev, newItem])
  }

  const updateLineItem = (tempId: string, field: keyof TempLineItem, value: number) => {
    setLineItems(items => items.map(item => {
      if (item.temp_id !== tempId) return item

      const updatedItem = { ...item, [field]: value }

      if (field === 'product_id') {
        const product = products.find(p => p.id === value)
        if (product) {
          updatedItem.price = product.price || 0
          updatedItem.tax_rate = product.tax_rate || 0
          updatedItem.amount = (updatedItem.quantity || 0) * (product.price || 0)
        }
      }

      if (field === 'quantity') {
        updatedItem.amount = (value || 0) * (updatedItem.price || 0)
      }

      return updatedItem
    }))
  }

  const removeLineItem = (tempId: string) => {
    setLineItems(prev => prev.filter(item => item.temp_id !== tempId))
  }

  const handleCreateInvoice = async () => {
    setFormError('')

    if (!newInvoice.client_id) {
      setFormError('Please select a client')
      return
    }

    if (!newInvoice.invoice_number) {
      setFormError('Please enter an invoice number')
      return
    }

    if (!lineItems.length) {
      setFormError('Please add at least one item')
      return
    }

    const invalidItems = lineItems.filter(
      item => !item.product_id || item.quantity <= 0 || item.price <= 0
    )

    if (invalidItems.length) {
      setFormError('Please complete all line items with valid products and quantities')
      return
    }

    if (newInvoice.due_date < newInvoice.issue_date) {
      setFormError('Due date cannot be earlier than issue date')
      return
    }

    setIsCreating(true)
    try {
      const { data: existingInvoice, error: checkError } = await supabase
        .from('invoices')
        .select('id')
        .eq('invoice_number', newInvoice.invoice_number)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Error checking invoice number: ${checkError.message}`)
      }

      if (existingInvoice) {
        setFormError('Invoice number already exists')
        return
      }

      const { data: insertedInvoice, error: insertError } = await supabase
        .from('invoices')
        .insert({
          client_id: newInvoice.client_id,
          invoice_number: newInvoice.invoice_number,
          issue_date: newInvoice.issue_date.toISOString().split('T')[0],
          due_date: newInvoice.due_date.toISOString().split('T')[0],
          subtotal: calculateTotals.subtotal,
          vat_rate: newInvoice.vat_rate,
          status: newInvoice.status,
          notes: newInvoice.notes
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(`Error inserting invoice: ${insertError.message}`)
      }

      if (!insertedInvoice) {
        throw new Error('No invoice was created')
      }

      const lineItemsToInsert = lineItems.map(({ product_id, quantity, price, tax_rate }) => ({
        invoice_id: insertedInvoice.id,
        product_id,
        quantity,
        price,
        tax_rate
      }))

      const { error: lineItemsError } = await supabase
        .from('invoice_line_items')
        .insert(lineItemsToInsert)

      if (lineItemsError) {
        await supabase
          .from('invoices')
          .delete()
          .eq('id', insertedInvoice.id)

        throw new Error(`Error inserting line items: ${lineItemsError.message}`)
      }

      setNewInvoice({
        client_id: 0,
        invoice_number: '',
        issue_date: new Date(),
        due_date: new Date(),
        subtotal: 0,
        vat_rate: 15.00,
        status: 'Draft',
        notes: ''
      })
      setLineItems([])

      await fetchInvoices()

    } catch (error) {
      console.error('Error creating invoice:', error instanceof Error ? error.message : 'Unknown error')
      setFormError(error instanceof Error ? error.message : 'Failed to create invoice. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const calculateTotals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
    const vatAmount = (subtotal * newInvoice.vat_rate) / 100
    const total = subtotal + vatAmount
    return { subtotal, vatAmount, total }
  }, [lineItems, newInvoice.vat_rate])

  useEffect(() => {
    setNewInvoice(prev => ({
      ...prev,
      subtotal: calculateTotals.subtotal
    }))
  }, [calculateTotals.subtotal])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Enter the details for the new invoice.
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{formError}</span>
              </div>
            )}

            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Client</Label>
                    <Select
                      value={String(newInvoice.client_id)}
                      onValueChange={(value) => setNewInvoice({ ...newInvoice, client_id: parseInt(value) })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Invoice Type</Label>
                    <Select
                      value={newInvoice.status}
                      onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value as Invoice['status'] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Invoice Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Invoice Number</Label>
                    <Input
                      value={newInvoice.invoice_number}
                      onChange={(e) => setNewInvoice({ ...newInvoice, invoice_number: e.target.value })}
                      placeholder="INV-001"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={newInvoice.issue_date.toISOString().split('T')[0]}
                        onChange={(e) => setNewInvoice({ ...newInvoice, issue_date: new Date(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newInvoice.due_date.toISOString().split('T')[0]}
                        onChange={(e) => setNewInvoice({ ...newInvoice, due_date: new Date(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold">Line Items</Label>
                  <Button variant="outline" size="sm" onClick={addLineItem}>
                    <Plus className="mr-2 h-4 w-4" /> Add Line Item
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Product</TableHead>
                        <TableHead className="w-[100px]">Qty</TableHead>
                        <TableHead className="w-[120px]">Price</TableHead>
                        <TableHead className="w-[120px]">Amount</TableHead>
                        <TableHead className="w-[100px]">Tax Rate</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.map((item) => (
                        <TableRow key={item.temp_id}>
                          <TableCell>
                            <ProductSelect
                              products={products}
                              selectedId={item.product_id}
                              onSelect={(productId) => updateLineItem(item.temp_id, 'product_id', productId)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={item.quantity || ''}
                              onChange={(e) => updateLineItem(item.temp_id, 'quantity', Number(e.target.value))}
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price || ''}
                              className="w-full"
                              disabled
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${item.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {item.tax_rate}%
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(item.temp_id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={newInvoice.notes}
                      onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                      placeholder="Additional notes..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Terms & Conditions</Label>
                    <Textarea
                      placeholder="Terms and conditions..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${calculateTotals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>VAT ({newInvoice.vat_rate}%)</span>
                        <span>${calculateTotals.vatAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t mt-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">${calculateTotals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" type="button" onClick={() => setLineItems([])}>
                      Reset
                    </Button>
                    <Button
                      onClick={handleCreateInvoice}
                      disabled={isCreating}
                    >
                      {isCreating ? 'Creating...' : 'Generate Invoice'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const client = clients.find(c => c.id === invoice.client_id)
            return (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.issue_date.toLocaleDateString()}</TableCell>
                <TableCell>{client?.company_name || `Client ${invoice.client_id}`}</TableCell>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.due_date.toLocaleDateString()}</TableCell>
                <TableCell>
                  ${(invoice.subtotal * (1 + invoice.vat_rate / 100)).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    invoice.status === 'Paid' && "bg-green-100 text-green-800",
                    invoice.status === 'Pending' && "bg-yellow-100 text-yellow-800",
                    invoice.status === 'Overdue' && "bg-red-100 text-red-800",
                    invoice.status === 'Draft' && "bg-gray-100 text-gray-800",
                    invoice.status === 'Cancelled' && "bg-gray-100 text-gray-800"
                  )}>
                    {invoice.status}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}