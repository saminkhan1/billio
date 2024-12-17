'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { ArrowUp, ArrowDown, Wallet, Banknote, ArrowLeftRight, Calendar as CalendarIcon, MoreHorizontal, FileText, Printer, Download } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/utils/cn"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/ui/file-uploader"
import { Badge } from "@/components/ui/badge"
import type { CashTransaction, CashBookSummary, NewCashTransaction, BadgeVariant } from '@/utils/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TRANSACTION_CATEGORIES = {
  income: [
    { value: 'sales', label: 'Sales', labelAr: 'المبيعات' },
    { value: 'service_income', label: 'Service Income', labelAr: 'دخل الخدمات' },
    { value: 'commission', label: 'Commission', labelAr: 'عمولة' },
    { value: 'other_income', label: 'Other Income', labelAr: 'دخل آخر' },
  ],
  expense: [
    { value: 'cogs', label: 'Cost of Goods Sold', labelAr: 'تكلفة البضاعة المباعة' },
    { value: 'salary', label: 'Salaries & Wages', labelAr: 'الرواتب والأجور' },
    { value: 'rent', label: 'Rent', labelAr: 'الإيجار' },
    { value: 'utilities', label: 'Utilities', labelAr: 'المرافق' },
    { value: 'supplies', label: 'Office Supplies', labelAr: 'مستلزمات المكتب' },
    { value: 'maintenance', label: 'Maintenance', labelAr: 'الصيانة' },
    { value: 'marketing', label: 'Marketing', labelAr: 'التسويق' },
    { value: 'other_expense', label: 'Other Expenses', labelAr: 'مصاريف أخرى' },
  ]
}

export function CashBookManagement() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [cashBook, setCashBook] = useState<CashBookSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState<NewCashTransaction>({
    type: 'receipt',
    amount: 0,
    description: '',
    category: '',
    reference: '',
    payment_method: 'cash',
    vat_rate: 15,
    invoice_number: '',
    notes: '',
    vat_number: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'receipt' | 'payment'>('all')

  const supabase = createClient()

  const fetchCashBookData = async () => {
    setIsLoading(true)
    try {
      const startDate = new Date(selectedDate)
      const endDate = new Date(selectedDate)
      
      if (period === 'daily') {
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
      } else if (period === 'weekly') {
        startDate.setDate(startDate.getDate() - startDate.getDay())
        endDate.setDate(startDate.getDate() + 6)
      } else {
        startDate.setDate(1)
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0)
      }

      const { data: transactions } = await supabase
        .from('cash_transactions')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true })

      let runningBalance = 0
      const processedTransactions = (transactions || []).map((tx: CashTransaction) => {
        runningBalance += tx.type === 'receipt' ? tx.amount : -tx.amount
        return { ...tx, balance: runningBalance }
      })

      const totalReceipts = processedTransactions.reduce((sum: number, tx: CashTransaction) => 
        sum + (tx.type === 'receipt' ? tx.amount : 0), 0
      )

      const totalPayments = processedTransactions.reduce((sum: number, tx: CashTransaction) => 
        sum + (tx.type === 'payment' ? tx.amount : 0), 0
      )

      setCashBook({
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        openingBalance: runningBalance - (totalReceipts - totalPayments),
        closingBalance: runningBalance,
        totalReceipts,
        totalPayments,
        transactions: processedTransactions
      })
    } catch (error) {
      console.error('Error fetching cash book data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchCashBookData()
  }, [period, selectedDate])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'f':
            e.preventDefault()
            document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
            break
          case 'n':
            e.preventDefault()
            setShowAddTransaction(true)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleAddTransaction = async () => {
    try {
      const vat_amount = (newTransaction.amount * newTransaction.vat_rate) / 100
      
      const { error } = await supabase
        .from('cash_transactions')
        .insert([{
          ...newTransaction,
          date: new Date().toISOString(),
          vat_amount,
          currency: 'SAR',
          created_by: 'current_user_id',
          created_at: new Date().toISOString(),
        }])

      if (error) throw error
      
      setShowAddTransaction(false)
      setNewTransaction({
        type: 'receipt',
        amount: 0,
        description: '',
        category: '',
        reference: '',
        payment_method: 'cash',
        vat_rate: 15,
        invoice_number: '',
        notes: '',
        vat_number: ''
      })
      fetchCashBookData()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const getStatusVariant = (status?: string): BadgeVariant => {
    switch (status) {
      case 'accepted':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Book Period</CardTitle>
          <CardDescription>Select the time period for your cash book</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Period Type</Label>
              <Select value={period} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction Button */}
      <div className="flex justify-end">
        <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
          <DialogTrigger asChild>
            <Button aria-label="Add new transaction (Ctrl+N)">
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Cash Transaction</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Transaction Details</TabsTrigger>
                <TabsTrigger value="vat">VAT Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value) => setNewTransaction({...newTransaction, type: value as 'receipt' | 'payment'})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receipt">Receipt</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newTransaction.category}
                      onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_header" disabled>
                          {newTransaction.type === 'receipt' ? 'Income Categories' : 'Expense Categories'}
                        </SelectItem>
                        {(newTransaction.type === 'receipt' ? TRANSACTION_CATEGORIES.income : TRANSACTION_CATEGORIES.expense)
                          .map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label} - {cat.labelAr}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Invoice Number</Label>
                    <Input
                      value={newTransaction.invoice_number || ''}
                      onChange={(e) => setNewTransaction({...newTransaction, invoice_number: e.target.value})}
                      placeholder="Enter invoice number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newTransaction.notes || ''}
                    onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                    placeholder="Enter transaction notes"
                  />
                </div>
              </TabsContent>

              <TabsContent value="vat" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>VAT Rate (%)</Label>
                    <Select
                      value={String(newTransaction.vat_rate)}
                      onValueChange={(value) => setNewTransaction({...newTransaction, vat_rate: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select VAT rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">Standard Rate (15%)</SelectItem>
                        <SelectItem value="0">Zero Rate (0%)</SelectItem>
                        <SelectItem value="-1">Exempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>VAT Amount</Label>
                    <Input
                      type="number"
                      value={(newTransaction.amount * (newTransaction.vat_rate / 100)).toFixed(2)}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>VAT Registration Number</Label>
                  <Input
                    value={newTransaction.vat_number || ''}
                    onChange={(e) => setNewTransaction({...newTransaction, vat_number: e.target.value})}
                    placeholder="Enter VAT registration number"
                  />
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <FileUploader
                  onUpload={(files) => {
                    // Handle file upload
                    console.log('Files uploaded:', files)
                  }}
                  acceptedFileTypes={['.pdf', '.jpg', '.png']}
                  maxFileSize={5 * 1024 * 1024} // 5MB
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Banknote className="h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading cash book...</p>
          </div>
        </div>
      ) : cashBook && (
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ${cashBook.totalReceipts.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  For period {cashBook.period}
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  ${cashBook.totalPayments.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  For period {cashBook.period}
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Closing Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${cashBook.closingBalance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  As of {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Cash Book Entries</CardTitle>
              <CardDescription>Detailed list of all cash transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Search transactions... (Ctrl+F)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterType} onValueChange={(value: 'all' | 'receipt' | 'payment') => setFilterType(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="receipt">Receipts Only</SelectItem>
                    <SelectItem value="payment">Payments Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Receipts</TableHead>
                      <TableHead className="text-right">Payments</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/50">
                      <TableCell>{cashBook.period.split(' - ')[0]}</TableCell>
                      <TableCell colSpan={5}>Opening Balance</TableCell>
                      <TableCell className="text-right font-medium">
                        ${cashBook.openingBalance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    {cashBook?.transactions
                      .filter(tx => 
                        (filterType === 'all' || tx.type === filterType) &&
                        (searchTerm === '' || 
                          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.vat_number?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                      )
                      .map((transaction) => (
                        <TableRow key={transaction.id} className="transition-colors hover:bg-muted/50">
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {transaction.type === 'receipt' ? `$${transaction.amount.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {transaction.type === 'payment' ? `$${transaction.amount.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${transaction.balance.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(transaction.zatca_status)}>
                              {transaction.zatca_status || 'pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => window.print()}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    {cashBook && (
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={4}>Closing Balance</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${cashBook.totalReceipts.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        ${cashBook.totalPayments.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${cashBook.closingBalance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {cashBook && cashBook.transactions.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <ArrowLeftRight className="h-8 w-8 mx-auto mb-2" />
          <p>No transactions recorded for this period</p>
        </div>
      )}
    </div>
  )
} 