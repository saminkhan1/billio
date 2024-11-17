export interface Client {
  id: string
  name: string
  contact_number: string
  email: string
}

export interface DeliveryNote {
  id: string
  date: string
  name: string
  contact: string
  email: string
}

export interface Estimate {
  id: string
  date: string
  name: string
  contact: string
  email: string
  amount: number
}

export interface Invoice {
  id: string
  date: string
  client: string
  phone: string
  email: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  dueDate: string
}

export interface Payment {
  id: string
  date: string
  invoiceId: string
  name: string
  mode: 'Credit Card' | 'Cash' | 'Bank Transfer'
  amount: number
}

export interface Product {
  id: string
  product_name: string
  customs_code: string
  unit_selling_price: number
  available_units: number
  reorder_level: number
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
  id: string
  name: string
  contact: string
  email: string
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
  id: string
  date: string
  expenseNumber: string
  vendorName: string
  category: 'Travel' | 'Supplies' | 'Utilities' | 'Office' | 'Marketing' | 'Other'
  amount: number
  status: 'Pending' | 'Approved' | 'Paid'
} 