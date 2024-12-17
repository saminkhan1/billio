import { Client, DeliveryNote, Estimate, Invoice, Payment, Product, Refund, Vendor, PurchaseOrder, Expense, InvoiceLineItem } from '@/utils/types'
import { v4 as uuidv4 } from 'uuid'


// Mock data for delivery notes
export const mockDeliveryNotes: DeliveryNote[] = [
  { id: uuidv4(), date: '2023-05-01', name: 'Acme Corp', contact: '(555) 123-4567', email: 'contact@acme.com' },
  { id: uuidv4(), date: '2023-05-05', name: 'Globex Inc', contact: '(555) 987-6543', email: 'info@globex.com' },
  { id: uuidv4(), date: '2023-05-08', name: 'Initech', contact: '(555) 246-8135', email: 'sales@initech.com' },
]




// Mock data for vendors
export const mockVendors: Vendor[] = [
  {
    id: 1,
    company_name: 'Supply Pro Ltd',
    contact_name: 'Robert Johnson',
    email: 'contact@supplypro.com',
    phone: '(555) 123-4567',
    tax_id: 'TAX123456',
    address: '789 Supply Street',
    city: 'Chicago',
    country: 'USA',
    payment_terms: 'Net 30',
    website: 'https://supplypro.com'
  },
  {
    id: 2,
    company_name: 'Global Materials Inc',
    contact_name: 'Sarah Williams',
    email: 'info@globalmaterials.com',
    phone: '(555) 987-6543',
    tax_id: 'TAX789012',
    address: '321 Global Ave',
    city: 'Los Angeles',
    country: 'USA',
    payment_terms: 'Net 45',
    website: 'https://globalmaterials.com'
  }
]

// Mock data for purchase orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  { 
    id: uuidv4(), 
    date: '2024-03-01', 
    poNumber: 'PO-001',
    vendorName: 'Supply Pro Ltd', 
    contact: '(555) 123-4567', 
    email: 'contact@supplypro.com',
    amount: 5000
  },
  { 
    id: uuidv4(), 
    date: '2024-03-05', 
    poNumber: 'PO-002',
    vendorName: 'Global Materials Inc', 
    contact: '(555) 987-6543', 
    email: 'info@globalmaterials.com',
    amount: 7500
  },
  { 
    id: uuidv4(), 
    date: '2024-03-08', 
    poNumber: 'PO-003',
    vendorName: 'Quality Goods Co', 
    contact: '(555) 246-8135', 
    email: 'sales@qualitygoods.com',
    amount: 3200
  },
]

// Mock data for expenses
export const mockExpenses: Expense[] = [
  {
    id: 1,
    expense_date: new Date('2024-03-01'),
    expense_number: 'EXP-001',
    vendor_id: 1,
    category: 'Supplies',
    description: 'Office supplies for Q1',
    amount: 1500,
    tax_amount: 300,
    payment_status: 'Paid',
    payment_method: 'Credit Card',
    reference_number: 'REF-001',
    notes: 'Monthly office supplies'
  },
  {
    id: 2,
    expense_date: new Date('2024-03-05'),
    expense_number: 'EXP-002',
    vendor_id: 2,
    category: 'Travel',
    description: 'Business trip to LA',
    amount: 2500,
    tax_amount: 500,
    payment_status: 'Pending',
    payment_method: 'Bank Transfer',
    reference_number: 'REF-002',
    notes: 'Conference expenses'
  }
] 