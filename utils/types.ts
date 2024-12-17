export interface Client {
  id: number
  company_name: string
  contact_name: string
  email: string
  phone: string
  vat_number: string
  address: string
  city: string
  country: string
}

export interface DeliveryNote {
  id: string
  date: string
  name: string
  contact: string
  email: string
}

export interface Estimate {
  id: number
  client_id: number
  estimate_number: number
  estimate_date: Date
  reference_number?: string
  notes?: string
  terms_and_conditions?: string
  net_amount: number
  file_name?: string
  file_path?: string
}

export interface EstimateItem {
  id: number
  estimate_id: number
  product_id: number
  name: string
  description?: string
  quantity: number
  rate: number
  discount: number
  sales_tax: number
  amount: number
}

export interface Invoice {
  id: number
  client_id: number
  invoice_number: string
  issue_date: Date
  due_date: Date
  subtotal: number
  vat_rate: number
  status: 'Draft' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled'
  notes?: string
}

export interface InvoiceLineItem {
  id: number
  invoice_id: number
  product_id: number
  quantity: number
  price: number
  tax_rate: number
  created_at: Date
  updated_at: Date
}

export interface Payment {
  payment_id: string
  client_id: number
  pay_date: Date
  mode: string
  amount: number
  deposit_to?: string
  issuer?: string
  reference_number?: string
  comments?: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  cost: number
  tax_rate: number
  hsn_code: string
  barcode: string
  sku: string
  unit_of_measurement: string
  quantity_in_stock: number
}

export interface Refund {
  id: string
  date: string
  invoiceId: string
  receiptId: string
  name: string
  mode: 'Credit Card' | 'Cash' | 'Bank Transfer'
  amount: number
}

export interface Vendor {
  id: number
  company_name: string
  contact_name: string
  email: string
  phone: string
  tax_id?: string
  address?: string
  city?: string
  country?: string
  payment_terms?: string
  website?: string
}

export interface PurchaseOrder {
  id: string
  date: string
  poNumber: string
  vendorName: string
  contact: string
  email: string
  amount: number
}

export interface Expense {
  id: number
  expense_date: Date
  expense_number: string
  vendor_id: number
  category: 'Travel' | 'Supplies' | 'Utilities' | 'Office' | 'Marketing' | 'Other'
  description?: string
  amount: number
  tax_amount: number
  payment_status: 'Pending' | 'Approved' | 'Paid'
  payment_method: 'Credit Card' | 'Cash' | 'Bank Transfer'
  reference_number?: string
  notes?: string
}

export interface CashTransaction {
  id: string
  date: string
  description: string
  type: 'receipt' | 'payment'
  amount: number
  reference: string
  category: string
  balance: number
  vat_amount?: number
  vat_rate?: number
  payment_method: 'cash' | 'bank_transfer' | 'cheque'
  currency: 'SAR'
  created_by: string
  created_at: string
  invoice_number?: string
  vat_number?: string
  purpose?: string
  notes?: string
  attachments?: string[]
  language?: 'en' | 'ar'
  zatca_status?: 'pending' | 'submitted' | 'accepted' | 'rejected'
  zatca_submission_date?: string
  zatca_reference?: string
}

export interface CashBookSummary {
  period: string
  openingBalance: number
  closingBalance: number
  totalReceipts: number
  totalPayments: number
  transactions: CashTransaction[]
}

export interface NewCashTransaction {
  type: 'receipt' | 'payment'
  amount: number
  description: string
  category: string
  reference: string
  payment_method: 'cash' | 'bank_transfer' | 'cheque'
  vat_rate: number
  invoice_number?: string
  notes?: string
  vat_number?: string
}

export interface BankTransaction {
  id: string
  date: string
  description: string
  type: 'deposit' | 'withdrawal'
  amount: number
  reference: string
  category: string
  balance: number
  bank_account: string
  transaction_id?: string
  cheque_number?: string
  beneficiary?: string
  vat_amount?: number
  vat_rate?: number
  currency: 'SAR'
  created_by: string
  created_at: string
  iban?: string
  swift_code?: string
  purpose?: string
  beneficiary_address?: string
  beneficiary_vat_number?: string
  zatca_status?: 'pending' | 'submitted' | 'accepted' | 'rejected'
  zatca_submission_date?: string
  zatca_reference?: string
}

export interface BankBookSummary {
  period: string
  openingBalance: number
  closingBalance: number
  totalDeposits: number
  totalWithdrawals: number
  transactions: BankTransaction[]
}

export interface NewBankTransaction {
  type: 'deposit' | 'withdrawal'
  amount: number
  description: string
  category: string
  reference: string
  bank_account: string
  cheque_number?: string
  beneficiary?: string
  vat_rate: number
  purpose: string
  iban: string
}

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'