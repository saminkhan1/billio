'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { FileBarChart, Download, Printer, FileText } from 'lucide-react'
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TaxReport {
  period: string
  total_sales: number
  total_purchases: number
  vat_collected: number
  vat_paid: number
  net_vat: number
  status: 'draft' | 'submitted' | 'accepted' | 'rejected'
  submission_date?: string
  zatca_reference?: string
}

interface TaxTransaction {
  date: string
  type: 'sale' | 'purchase'
  document_number: string
  party_name: string
  party_vat: string
  amount: number
  vat_amount: number
  status: string
}

export function TaxReportManagement() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('monthly')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null)
  const [transactions, setTransactions] = useState<TaxTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchTaxData = async () => {
    setIsLoading(true)
    try {
      // Here you would fetch actual data from your Supabase database
      // For now, using mock data
      const mockReport: TaxReport = {
        period: `${format(selectedDate, 'MMMM yyyy')}`,
        total_sales: 150000,
        total_purchases: 75000,
        vat_collected: 22500, // 15% of sales
        vat_paid: 11250, // 15% of purchases
        net_vat: 11250, // difference
        status: 'draft'
      }

      const mockTransactions: TaxTransaction[] = [
        {
          date: '2024-03-15',
          type: 'sale',
          document_number: 'INV-001',
          party_name: 'ABC Company',
          party_vat: '123456789',
          amount: 50000,
          vat_amount: 7500,
          status: 'reported'
        },
        // Add more mock transactions as needed
      ]

      setTaxReport(mockReport)
      setTransactions(mockTransactions)
    } catch (error) {
      console.error('Error fetching tax data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTaxData()
  }, [period, selectedDate])

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'outline'
      case 'completed':
        return 'default'
      case 'failed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getQuarterFromMonth = (month: number): number => Math.floor(month / 3) + 1
  const getMonthsInQuarter = (quarter: number): number[] => [0, 1, 2].map(i => (quarter - 1) * 3 + i)

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Report Period</CardTitle>
          <CardDescription>Select the period for your VAT report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Report Type</Label>
              <Select 
                value={period} 
                onValueChange={(value: 'monthly' | 'quarterly') => {
                  setPeriod(value)
                  // Reset date to start of current period
                  const now = new Date()
                  if (value === 'quarterly') {
                    const currentQuarter = getQuarterFromMonth(now.getMonth())
                    const quarterStart = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1)
                    setSelectedDate(quarterStart)
                  } else {
                    setSelectedDate(new Date(now.getFullYear(), now.getMonth(), 1))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly VAT Return</SelectItem>
                  <SelectItem value="quarterly">Quarterly VAT Return</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label>Period</Label>
              <Select 
                value={period === 'monthly' 
                  ? format(selectedDate, 'yyyy-MM')
                  : `${selectedDate.getFullYear()}-Q${getQuarterFromMonth(selectedDate.getMonth())}`
                }
                onValueChange={(value) => {
                  if (period === 'monthly') {
                    setSelectedDate(new Date(value + '-01'))
                  } else {
                    const [year, quarter] = value.split('-Q')
                    setSelectedDate(new Date(parseInt(year), (parseInt(quarter) - 1) * 3, 1))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${period} period`} />
                </SelectTrigger>
                <SelectContent>
                  {period === 'monthly' ? (
                    // Generate last 12 months
                    Array.from({ length: 12 }).map((_, i) => {
                      const date = new Date()
                      date.setMonth(date.getMonth() - i)
                      return (
                        <SelectItem 
                          key={i} 
                          value={format(date, 'yyyy-MM')}
                        >
                          {format(date, 'MMMM yyyy')}
                        </SelectItem>
                      )
                    })
                  ) : (
                    // Generate last 4 quarters
                    Array.from({ length: 4 }).map((_, i) => {
                      const date = new Date()
                      const currentQuarter = getQuarterFromMonth(date.getMonth())
                      date.setMonth(date.getMonth() - (i * 3))
                      const quarter = currentQuarter - i || 4 - (i % 4)
                      const year = date.getFullYear() - Math.floor(i / 4)
                      return (
                        <SelectItem 
                          key={i} 
                          value={`${year}-Q${quarter}`}
                        >
                          {`Q${quarter} ${year}`}
                        </SelectItem>
                      )
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <FileBarChart className="h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading tax report...</p>
          </div>
        </div>
      ) : taxReport && (
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VAT Collected</CardTitle>
                <Badge variant={getStatusBadge(taxReport.status)}>
                  {taxReport.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  SAR {taxReport.vat_collected.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  From sales of SAR {taxReport.total_sales.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VAT Paid</CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  SAR {taxReport.vat_paid.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  From purchases of SAR {taxReport.total_purchases.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net VAT Due</CardTitle>
                <FileBarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  SAR {taxReport.net_vat.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  For period {taxReport.period}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Submit to ZATCA
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Transactions</CardTitle>
              <CardDescription>Detailed list of all VAT transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="purchases">Purchases</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Document #</TableHead>
                          <TableHead>Party Name</TableHead>
                          <TableHead>VAT Number</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">VAT</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx, index) => (
                          <TableRow key={index}>
                            <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                            <TableCell className="capitalize">{tx.type}</TableCell>
                            <TableCell>{tx.document_number}</TableCell>
                            <TableCell>{tx.party_name}</TableCell>
                            <TableCell>{tx.party_vat}</TableCell>
                            <TableCell className="text-right">
                              SAR {tx.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              SAR {tx.vat_amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {tx.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="sales" className="mt-4">
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Document #</TableHead>
                          <TableHead>Party Name</TableHead>
                          <TableHead>VAT Number</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">VAT</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(tx => tx.type === 'sale')
                          .map((tx, index) => (
                            <TableRow key={index}>
                              <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                              <TableCell className="capitalize">{tx.type}</TableCell>
                              <TableCell>{tx.document_number}</TableCell>
                              <TableCell>{tx.party_name}</TableCell>
                              <TableCell>{tx.party_vat}</TableCell>
                              <TableCell className="text-right">
                                SAR {tx.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                SAR {tx.vat_amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {tx.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="purchases" className="mt-4">
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Document #</TableHead>
                          <TableHead>Party Name</TableHead>
                          <TableHead>VAT Number</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">VAT</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(tx => tx.type === 'purchase')
                          .map((tx, index) => (
                            <TableRow key={index}>
                              <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                              <TableCell className="capitalize">{tx.type}</TableCell>
                              <TableCell>{tx.document_number}</TableCell>
                              <TableCell>{tx.party_name}</TableCell>
                              <TableCell>{tx.party_vat}</TableCell>
                              <TableCell className="text-right">
                                SAR {tx.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                SAR {tx.vat_amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {tx.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 