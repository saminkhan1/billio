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
import { Expense } from '@/utils/types'
import { mockExpenses } from '@/utils/mocks'

export function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: '',
    expenseNumber: '',
    vendorName: '',
    category: 'Supplies',
    amount: 0,
    status: 'Pending'
  })
  const [error, setError] = useState<string>('')

  const handleCreateExpense = () => {
    const { date, expenseNumber, vendorName, category, amount, status } = newExpense
    if (!date || !expenseNumber || !vendorName || !category || amount <= 0) {
      setError('All fields are required and amount must be greater than 0.')
      return
    }
    const expense: Expense = {
      id: uuidv4(),
      date,
      expenseNumber,
      vendorName,
      category,
      amount,
      status
    }
    setExpenses([...expenses, expense])
    setNewExpense({
      date: '',
      expenseNumber: '',
      vendorName: '',
      category: 'Supplies',
      amount: 0,
      status: 'Pending'
    })
    setError('')
  }

  const getStatusColor = (status: Expense['status']) => {
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
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expenseNumber" className="text-right">
                  Expense #
                </Label>
                <Input
                  id="expenseNumber"
                  value={newExpense.expenseNumber}
                  onChange={(e) => setNewExpense({ ...newExpense, expenseNumber: e.target.value })}
                  className="col-span-3"
                  placeholder="EXP-001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendorName" className="text-right">
                  Vendor Name
                </Label>
                <Input
                  id="vendorName"
                  value={newExpense.vendorName}
                  onChange={(e) => setNewExpense({ ...newExpense, vendorName: e.target.value })}
                  className="col-span-3"
                  placeholder="Vendor Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
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
                <Label htmlFor="amount" className="text-right">
                  Amount
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
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newExpense.status}
                  onValueChange={(value) => setNewExpense({ ...newExpense, status: value as Expense['status'] })}
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
            <TableHead>Vendor Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.expenseNumber}</TableCell>
              <TableCell>{expense.vendorName}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(expense.status)}`}>
                  {expense.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 