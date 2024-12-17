'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Estimate, EstimateItem, Client, Product } from '@/utils/types'
import { Textarea } from "@/components/ui/textarea"
import { createClient } from '@/utils/supabase/client'
import { ProductSelect } from "@/components/product-select"

// Helper function to safely format dates
const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString()
  } catch (e) {
    return ''
  }
}

// Helper function to safely format currency
const formatCurrency = (amount: number | undefined) => {
  return typeof amount === 'number' ? `$${amount.toFixed(2)}` : '$0.00'
}

interface EstimateWithClient extends Estimate {
  client?: Client
}

interface EstimateFormData extends Omit<Estimate, 'id'> {
  items: (Omit<EstimateItem, 'id' | 'estimate_id'> & {
    temp_id?: string
    product_id: number
  })[]
}

interface TempLineItem {
  temp_id: string
  product_id: number
  quantity: number
  rate: number // This matches the EstimateItem interface
  amount: number
  name: string
  description: string
  discount: number
  sales_tax: number
}

export function EstimatesManagement() {
  const [estimates, setEstimates] = useState<EstimateWithClient[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [newEstimate, setNewEstimate] = useState<EstimateFormData>({
    client_id: 0,
    estimate_number: 0,
    estimate_date: new Date(),
    reference_number: '',
    notes: '',
    terms_and_conditions: '',
    net_amount: 0,
    file_name: '',
    file_path: '',
    items: [{
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      discount: 0,
      sales_tax: 0,
      amount: 0,
      product_id: 0
    }]
  })
  const [error, setError] = useState<string>('')
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await Promise.all([
      fetchEstimates(),
      fetchClients(),
      fetchProducts()
    ])
  }

  const fetchEstimates = async () => {
    const { data, error } = await supabase
      .from('estimates')
      .select(`
        *,
        client:clients (*)
      `)
      .order('estimate_date', { ascending: false })

    if (error) {
      setError('Failed to fetch estimates')
      console.error('Error fetching estimates:', error)
      return
    }

    setEstimates(data || [])
  }

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

  const calculateItemAmount = (item: Omit<EstimateItem, 'id' | 'estimate_id'>) => {
    const subtotal = item.quantity * item.rate;
    const discountAmount = (subtotal * item.discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * item.sales_tax) / 100;
    return afterDiscount + taxAmount;
  }

  const updateItemAmount = (index: number, item: Omit<EstimateItem, 'id' | 'estimate_id'>) => {
    const amount = calculateItemAmount(item);
    const updatedItems = [...newEstimate.items];
    const existingItem = newEstimate.items[index];
    updatedItems[index] = { 
        ...item, 
        amount, 
        product_id: existingItem.product_id,
        temp_id: existingItem.temp_id || crypto.randomUUID()
    };

    const netAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);

    setNewEstimate(prev => ({
      ...prev,
      items: updatedItems,
      net_amount: netAmount
    }));
  }

  const addNewItem = () => {
    setNewEstimate(prev => ({
      ...prev,
      items: [...prev.items, {
        name: '',
        description: '',
        quantity: 1,
        rate: 0,
        discount: 0,
        sales_tax: 0,
        amount: 0,
        product_id: 0
      }]
    }));
  }

  const removeItem = (index: number) => {
    if (newEstimate.items.length === 1) return;

    const updatedItems = newEstimate.items.filter((_, i) => i !== index);
    const netAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);

    setNewEstimate(prev => ({
      ...prev,
      items: updatedItems,
      net_amount: netAmount
    }));
  }

  const handleCreateEstimate = async () => {
    const { client_id, estimate_number, items } = newEstimate;
    if (!client_id || !estimate_number || items.length === 0) {
      setError('Client, estimate number and at least one item are required.');
      return;
    }

    // Start a Supabase transaction
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .insert([{
        client_id: newEstimate.client_id,
        estimate_number: newEstimate.estimate_number,
        estimate_date: newEstimate.estimate_date.toISOString(),
        reference_number: newEstimate.reference_number,
        notes: newEstimate.notes,
        terms_and_conditions: newEstimate.terms_and_conditions,
        net_amount: newEstimate.net_amount,
        file_name: newEstimate.file_name,
        file_path: newEstimate.file_path
      }])
      .select()
      .single();

    if (estimateError || !estimate) {
      setError('Failed to create estimate');
      console.error('Error creating estimate:', estimateError);
      return;
    }

    // Insert estimate items
    const { error: itemsError } = await supabase
      .from('estimate_items')
      .insert(
        newEstimate.items.map(item => ({
          estimate_id: estimate.id,
          ...item
        }))
      );

    if (itemsError) {
      setError('Failed to create estimate items');
      console.error('Error creating estimate items:', itemsError);
      return;
    }

    await fetchEstimates();
    setNewEstimate({
      client_id: 0,
      estimate_number: 0,
      estimate_date: new Date(),
      reference_number: '',
      notes: '',
      terms_and_conditions: '',
      net_amount: 0,
      file_name: '',
      file_path: '',
      items: [{
        name: '',
        description: '',
        quantity: 1,
        rate: 0,
        discount: 0,
        sales_tax: 0,
        amount: 0,
        product_id: 0
      }]
    });
    setError('');
    setOpen(false);
  }

  const addLineItem = () => {
    const newItem: TempLineItem = {
      temp_id: crypto.randomUUID(),
      product_id: 0,
      quantity: 1,
      rate: 0,
      amount: 0,
      name: '',
      description: '',
      discount: 0,
      sales_tax: 0
    }
    setNewEstimate(prev => ({
      ...prev,
      items: [...prev.items.map(item => ({
        ...item,
        temp_id: item.temp_id || crypto.randomUUID() // Add temp_id to existing items
      })), newItem]
    }))
  }

  const updateLineItem = (tempId: string, field: keyof TempLineItem, value: number) => {
    setNewEstimate(prev => {
      const updatedItems = prev.items.map(item => {
        const itemWithTempId = { ...item, temp_id: item.temp_id || crypto.randomUUID() }
        if (!itemWithTempId.temp_id || itemWithTempId.temp_id !== tempId) return itemWithTempId

        const updatedItem = { ...itemWithTempId, [field]: value }

        if (field === 'product_id') {
          const product = products.find(p => p.id === value)
          if (product) {
            updatedItem.rate = product.price || 0
            updatedItem.name = product.name
            updatedItem.description = product.description
          }
        }

        // Calculate amount including discount and tax
        const subtotal = (updatedItem.quantity || 0) * (updatedItem.rate || 0)
        const discountAmount = subtotal * ((updatedItem.discount || 0) / 100)
        const afterDiscount = subtotal - discountAmount
        const taxAmount = afterDiscount * ((updatedItem.sales_tax || 0) / 100)
        updatedItem.amount = afterDiscount + taxAmount

        return updatedItem
      })

      const netAmount = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0)

      return {
        ...prev,
        items: updatedItems,
        net_amount: netAmount
      }
    })
  }

  const removeLineItem = (tempId: string) => {
    setNewEstimate(prev => {
      if (prev.items.length <= 1) return prev

      const updatedItems = prev.items.filter(item =>
        (item.temp_id || crypto.randomUUID()) !== tempId
      )
      const netAmount = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0)

      return {
        ...prev,
        items: updatedItems,
        net_amount: netAmount
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Estimate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Estimate</DialogTitle>
              <DialogDescription>
                Enter the details for the new estimate.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client</Label>
                    <Select
                      value={newEstimate.client_id.toString()}
                      onValueChange={(value) => setNewEstimate({ ...newEstimate, client_id: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem
                            key={`client-select-${client.id}`}
                            value={client.id.toString()}
                          >
                            {client.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimate_number">Estimate #</Label>
                    <Input
                      id="estimate_number"
                      type="number"
                      value={newEstimate.estimate_number}
                      onChange={(e) => setNewEstimate({ ...newEstimate, estimate_number: parseInt(e.target.value) })}
                      placeholder="Estimate Number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimate_date">Date</Label>
                    <Input
                      id="estimate_date"
                      type="date"
                      value={newEstimate.estimate_date.toISOString().split('T')[0]}
                      onChange={(e) => setNewEstimate({ ...newEstimate, estimate_date: new Date(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference_number">Reference #</Label>
                    <Input
                      id="reference_number"
                      value={newEstimate.reference_number}
                      onChange={(e) => setNewEstimate({ ...newEstimate, reference_number: e.target.value })}
                      placeholder="Reference Number"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Items</h3>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Product</TableHead>
                          <TableHead className="w-[100px]">Qty</TableHead>
                          <TableHead className="w-[120px]">Price</TableHead>
                          <TableHead className="w-[120px]">Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newEstimate.items.map((item, index) => (
                          <TableRow key={item.temp_id || index}>
                            <TableCell>
                              <ProductSelect
                                products={products}
                                selectedId={item.product_id || 0}
                                onSelect={(productId) => updateLineItem(item.temp_id || crypto.randomUUID(), 'product_id', productId)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={item.quantity || ''}
                                onChange={(e) => updateLineItem(item.temp_id || crypto.randomUUID(), 'quantity', Number(e.target.value))}
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.rate || ''}
                                className="w-full"
                                disabled
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${(item.amount || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLineItem(item.temp_id || crypto.randomUUID())}
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

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLineItem}
                      className="w-[200px]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newEstimate.notes}
                      onChange={(e) => setNewEstimate(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms">Terms & Conditions</Label>
                    <Textarea
                      id="terms"
                      value={newEstimate.terms_and_conditions}
                      onChange={(e) => setNewEstimate(prev => ({ ...prev, terms_and_conditions: e.target.value }))}
                      placeholder="Terms and conditions..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Total Items: {newEstimate.items.length}
                </div>
                <div className="text-lg font-semibold">
                  Total Amount: {formatCurrency(newEstimate.net_amount)}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateEstimate}>Create Estimate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="w-[100px]">Estimate #</TableHead>
            <TableHead className="w-[200px]">Client</TableHead>
            <TableHead className="w-[150px]">Contact #</TableHead>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead className="w-[150px]">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estimates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No estimates found
              </TableCell>
            </TableRow>
          ) : (
            estimates.map((estimate, index) => (
              <TableRow
                key={`estimate-${estimate.id || estimate.estimate_number || index}`}
              >
                <TableCell>{formatDate(estimate.estimate_date)}</TableCell>
                <TableCell>{estimate.estimate_number}</TableCell>
                <TableCell>{estimate.client?.company_name || '-'}</TableCell>
                <TableCell>{estimate.client?.phone || '-'}</TableCell>
                <TableCell>{estimate.client?.email || '-'}</TableCell>
                <TableCell>{formatCurrency(estimate.net_amount)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 