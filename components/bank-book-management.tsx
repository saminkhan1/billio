'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { ArrowUp, ArrowDown, Building2, Calendar as CalendarIcon, ArrowLeftRight } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/utils/cn"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { BankTransaction, BankBookSummary, NewBankTransaction } from '@/utils/types'

export function BankBookManagement() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [bankBook, setBankBook] = useState<BankBookSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState<NewBankTransaction>({
    type: 'deposit',
    amount: 0,
    description: '',
    category: '',
    reference: '',
    bank_account: '',
    vat_rate: 15,
    purpose: '',
    iban: '',
    beneficiary: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all')

  const supabase = createClient()

  const fetchBankBookData = async () => {
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
        .from('bank_transactions')
        .select('*')
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true })

      let runningBalance = 0
      const processedTransactions = (transactions || []).map((tx: BankTransaction) => {
        runningBalance += tx.type === 'deposit' ? tx.amount : -tx.amount
        return { ...tx, balance: runningBalance }
      })

      const totalDeposits = processedTransactions.reduce((sum, tx) => 
        sum + (tx.type === 'deposit' ? tx.amount : 0), 0
      )

      const totalWithdrawals = processedTransactions.reduce((sum, tx) => 
        sum + (tx.type === 'withdrawal' ? tx.amount : 0), 0
      )

      setBankBook({
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        openingBalance: runningBalance - (totalDeposits - totalWithdrawals),
        closingBalance: runningBalance,
        totalDeposits,
        totalWithdrawals,
        transactions: processedTransactions
      })
    } catch (error) {
      console.error('Error fetching bank book data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBankBookData()
  }, [period, selectedDate])

  const handleAddTransaction = async () => {
    try {
      const vat_amount = (newTransaction.amount * newTransaction.vat_rate) / 100
      
      const { error } = await supabase
        .from('bank_transactions')
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
        type: 'deposit',
        amount: 0,
        description: '',
        category: '',
        reference: '',
        bank_account: '',
        vat_rate: 15,
        purpose: '',
        iban: '',
        beneficiary: ''
      })
      fetchBankBookData()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Book Period</CardTitle>
          <CardDescription>Select the time period for your bank book</CardDescription>
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
            <Button>Add Transaction</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Bank Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) => setNewTransaction({...newTransaction, type: value as 'deposit' | 'withdrawal'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Bank Account</Label>
                <Input
                  value={newTransaction.bank_account}
                  onChange={(e) => setNewTransaction({...newTransaction, bank_account: e.target.value})}
                  placeholder="Enter bank account"
                />
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Transaction Purpose</Label>
                <Select
                  value={newTransaction.purpose || ''}
                  onValueChange={(value) => setNewTransaction({...newTransaction, purpose: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier_payment">Supplier Payment</SelectItem>
                    <SelectItem value="customer_payment">Customer Payment</SelectItem>
                    <SelectItem value="salary">Salary Payment</SelectItem>
                    <SelectItem value="tax_payment">Tax Payment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Beneficiary Details</Label>
                <Input
                  value={newTransaction.beneficiary || ''}
                  onChange={(e) => setNewTransaction({...newTransaction, beneficiary: e.target.value})}
                  placeholder="Enter beneficiary name"
                />
              </div>

              <div className="space-y-2">
                <Label>Bank Account IBAN</Label>
                <Input
                  value={newTransaction.iban || ''}
                  onChange={(e) => setNewTransaction({...newTransaction, iban: e.target.value})}
                  placeholder="SA..."
                />
              </div>

              <Button onClick={handleAddTransaction}>Add Transaction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Building2 className="h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading bank book...</p>
          </div>
        </div>
      ) : bankBook && (
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <ArrowUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ${bankBook.totalDeposits.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  For period {bankBook.period}
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <ArrowDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  ${bankBook.totalWithdrawals.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  For period {bankBook.period}
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Closing Balance</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${bankBook.closingBalance.toFixed(2)}
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
              <CardTitle>Bank Book Entries</CardTitle>
              <CardDescription>Detailed list of all bank transactions</CardDescription>
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
                <Select value={filterType} onValueChange={(value: 'all' | 'deposit' | 'withdrawal') => setFilterType(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="deposit">Deposits Only</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-auto">
              <Table>
                  <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Bank Account</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Deposits</TableHead>
                    <TableHead className="text-right">Withdrawals</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-muted/50">
                    <TableCell>{bankBook.period.split(' - ')[0]}</TableCell>
                    <TableCell colSpan={5}>Opening Balance</TableCell>
                    <TableCell className="text-right font-medium">
                      ${bankBook.openingBalance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {bankBook.transactions
                    .filter(tx => 
                      (filterType === 'all' || tx.type === filterType) &&
                      (searchTerm === '' || 
                        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tx.bank_account.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tx.beneficiary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tx.iban?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    )
                    .map((transaction) => (
                    <TableRow key={transaction.id} className="transition-colors hover:bg-muted/50">
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.bank_account}</TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {transaction.type === 'deposit' ? `$${transaction.amount.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {transaction.type === 'withdrawal' ? `$${transaction.amount.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${transaction.balance.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 font-bold">
                    <TableCell colSpan={4}>Closing Balance</TableCell>
                    <TableCell className="text-right text-green-600">
                      ${bankBook.totalDeposits.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      ${bankBook.totalWithdrawals.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${bankBook.closingBalance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {bankBook && bankBook.transactions.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <ArrowLeftRight className="h-8 w-8 mx-auto mb-2" />
          <p>No transactions recorded for this period</p>
        </div>
      )}
    </div>
  )
} 