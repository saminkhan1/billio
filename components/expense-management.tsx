'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Expense } from '@/utils/types'
import { mockExpenses, mockVendors } from '@/utils/mocks'

export function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    expense_date: new Date(),
    expense_number: '',
    vendor_id: 0,
    category: 'Supplies',
    description: '',
    amount: 0,
    tax_amount: 0,
    payment_status: 'Pending',
    payment_method: 'Credit Card',
    reference_number: '',
    notes: ''
  })
  const [error, setError] = useState<string>('')

  const handleCreateExpense = () => {
    const { expense_date, expense_number, vendor_id, category, amount } = newExpense
    if (!expense_date || !expense_number || !vendor_id || !category || amount <= 0) {
      setError('Date, expense number, vendor, category and amount are required. Amount must be greater than 0.')
      return
    }
    const expense: Expense = {
      id: Math.max(0, ...expenses.map(e => e.id)) + 1,
      ...newExpense
    }
    setExpenses([...expenses, expense])
    setNewExpense({
      expense_date: new Date(),
      expense_number: '',
      vendor_id: 0,
      category: 'Supplies',
      description: '',
      amount: 0,
      tax_amount: 0,
      payment_status: 'Pending',
      payment_method: 'Credit Card',
      reference_number: '',
      notes: ''
    })
    setError('')
  }

  const getStatusColor = (status: Expense['payment_status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Approved':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-'
    try {
      return date.toLocaleDateString()
    } catch (error) {
      console.error('Invalid date:', date)
      return '-'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details for the new expense.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.expense_date.toISOString().split('T')[0]}
                  onChange={(e) => setNewExpense({ ...newExpense, expense_date: new Date(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expenseNumber" className="text-right">
                  Expense # *
                </Label>
                <Input
                  id="expenseNumber"
                  value={newExpense.expense_number}
                  onChange={(e) => setNewExpense({ ...newExpense, expense_number: e.target.value })}
                  className="col-span-3"
                  placeholder="EXP-001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor_id" className="text-right">
                  Vendor *
                </Label>
                <Select
                  value={newExpense.vendor_id.toString()}
                  onValueChange={(value) => setNewExpense({ ...newExpense, vendor_id: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id.toString()}>
                        {vendor.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category *
                </Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value as Expense['category'] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Expense description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                  className="col-span-3"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newExpense.payment_status}
                  onValueChange={(value) => setNewExpense({ ...newExpense, payment_status: value as Expense['payment_status'] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <div className="col-span-4 text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreateExpense}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Expense #</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{formatDate(expense.expense_date)}</TableCell>
              <TableCell>{expense.expense_number}</TableCell>
              <TableCell>
                {mockVendors.find(v => v.id === expense.vendor_id)?.company_name || '-'}
              </TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.description || '-'}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(expense.payment_status)}`}>
                  {expense.payment_status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 