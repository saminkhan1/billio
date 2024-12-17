'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon, LineChartIcon, PieChartIcon } from 'lucide-react'
import type { Invoice, Expense, Payment, Refund } from '@/utils/types'
import { DatePicker } from "@/components/ui/date-picker"

interface PLStatement {
  period: string
  revenue: {
    invoices: number
    other: number
    total: number
  }
  expenses: {
    byCategory: Record<string, number>
    total: number
  }
  grossProfit: number
  netProfit: number
}

export function PAndLStatementManagement() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [plStatement, setPLStatement] = useState<PLStatement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchPLData = async () => {
    setIsLoading(true)
    try {
      // Calculate date range based on period
      const startDate = new Date(selectedDate)
      const endDate = new Date(selectedDate)
      
      if (period === 'monthly') {
        startDate.setDate(1)
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0)
      } else if (period === 'quarterly') {
        startDate.setMonth(Math.floor(startDate.getMonth() / 3) * 3)
        startDate.setDate(1)
        endDate.setMonth(startDate.getMonth() + 3)
        endDate.setDate(0)
      } else {
        startDate.setMonth(0)
        startDate.setDate(1)
        endDate.setMonth(11)
        endDate.setDate(31)
      }

      // Fetch invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .gte('issue_date', startDate.toISOString())
        .lt('issue_date', endDate.toISOString())

      // Fetch expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .gte('expense_date', startDate.toISOString())
        .lt('expense_date', endDate.toISOString())

      // Calculate totals
      const invoiceTotal = (invoices || []).reduce((sum: number, inv: Invoice) => 
        sum + (inv.subtotal * (1 + inv.vat_rate / 100)), 0)

      const expensesByCategory = (expenses || []).reduce((acc: Record<string, number>, exp: Expense) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount
        return acc
      }, {})

      const expenseTotal = Object.values(expensesByCategory).reduce<number>((sum, amount) => 
        sum + (amount as number), 0
      )

      setPLStatement({
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        revenue: {
          invoices: invoiceTotal,
          other: 0,
          total: invoiceTotal
        },
        expenses: {
          byCategory: expensesByCategory,
          total: Number(expenseTotal)
        },
        grossProfit: invoiceTotal,
        netProfit: invoiceTotal - Number(expenseTotal)
      })

    } catch (error) {
      console.error('Error fetching P&L data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPLData()
  }, [period, selectedDate])

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Period</CardTitle>
          <CardDescription>Select the time period for your P&L statement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Period Type</Label>
              <Select value={period} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Select Date</Label>
              <DatePicker
                date={selectedDate}
                onDateChange={(date) => date && setSelectedDate(date)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <LineChartIcon className="h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      ) : plStatement && (
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${plStatement.revenue.total.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  For period {plStatement.period}
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${plStatement.expenses.total.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Across {Object.keys(plStatement.expenses.byCategory).length} categories
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                {plStatement.netProfit >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${plStatement.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${Math.abs(plStatement.netProfit).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {plStatement.netProfit >= 0 ? 'Profit' : 'Loss'} for the period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tables */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Detailed view of all revenue streams</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">Invoices</TableCell>
                      <TableCell className="text-right">${plStatement.revenue.invoices.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">Other Revenue</TableCell>
                      <TableCell className="text-right">${plStatement.revenue.other.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 transition-colors hover:bg-muted/50">
                      <TableCell className="font-bold">Total Revenue</TableCell>
                      <TableCell className="text-right font-bold">${plStatement.revenue.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(plStatement.expenses.byCategory).map(([category, amount]) => (
                      <TableRow key={category} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{category}</TableCell>
                        <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 transition-colors hover:bg-muted/50">
                      <TableCell className="font-bold">Total Expenses</TableCell>
                      <TableCell className="text-right font-bold">${plStatement.expenses.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle>Profit & Loss Summary</CardTitle>
              <CardDescription>Final calculation for the period {plStatement.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">Total Revenue</TableCell>
                    <TableCell className="text-right text-green-600">${plStatement.revenue.total.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium">Total Expenses</TableCell>
                    <TableCell className="text-right text-red-600">-${plStatement.expenses.total.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="border-t-2 transition-colors hover:bg-muted/50">
                    <TableCell className="font-bold">Net Profit/Loss</TableCell>
                    <TableCell className={`text-right font-bold ${plStatement.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${plStatement.netProfit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {plStatement && Object.keys(plStatement.expenses.byCategory).length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <PieChartIcon className="h-8 w-8 mx-auto mb-2" />
          <p>No expenses recorded for this period</p>
        </div>
      )}
    </div>
  )
} 