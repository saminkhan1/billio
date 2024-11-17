import { Client, DeliveryNote, Estimate, Invoice, Payment, Product, Refund, Vendor, PurchaseOrder, Expense } from '@/utils/types'
import { v4 as uuidv4 } from 'uuid'

// Mock data for clients
export const mockClients: Client[] = [
  { id: uuidv4(), name: 'Acme Corp', contact_number: '123-456-7890', email: 'contact@acmecorp.com' },
  { id: uuidv4(), name: 'TechStart Inc', contact_number: '987-654-3210', email: 'info@techstart.com' },
  { id: uuidv4(), name: 'Global Services LLC', contact_number: '456-789-0123', email: 'support@globalservices.com' },
]

// Mock data for delivery notes
export const mockDeliveryNotes: DeliveryNote[] = [
  { id: uuidv4(), date: '2023-05-01', name: 'Acme Corp', contact: '(555) 123-4567', email: 'contact@acme.com' },
  { id: uuidv4(), date: '2023-05-05', name: 'Globex Inc', contact: '(555) 987-6543', email: 'info@globex.com' },
  { id: uuidv4(), date: '2023-05-08', name: 'Initech', contact: '(555) 246-8135', email: 'sales@initech.com' },
]

// Mock data for estimates
export const mockEstimates: Estimate[] = [
  { id: uuidv4(), date: '2023-05-01', name: 'Acme Corp', contact: '(555) 123-4567', email: 'contact@acme.com', amount: 1000 },
  { id: uuidv4(), date: '2023-05-05', name: 'Globex Inc', contact: '(555) 987-6543', email: 'info@globex.com', amount: 1500 },
  { id: uuidv4(), date: '2023-05-08', name: 'Initech', contact: '(555) 246-8135', email: 'sales@initech.com', amount: 800 },
]

// Mock data for invoices
export const mockInvoices: Invoice[] = [
  { id: uuidv4(), date: '2023-05-01', client: 'Acme Corp', phone: '(555) 123-4567', email: 'contact@acme.com', amount: 1000, status: 'Paid', dueDate: '2023-05-15' },
  { id: uuidv4(), date: '2023-05-05', client: 'Globex Inc', phone: '(555) 987-6543', email: 'info@globex.com', amount: 1500, status: 'Pending', dueDate: '2023-05-20' },
  { id: uuidv4(), date: '2023-05-08', client: 'Initech', phone: '(555) 246-8135', email: 'sales@initech.com', amount: 800, status: 'Overdue', dueDate: '2023-05-10' },
]

// Mock data for payments
export const mockPayments: Payment[] = [
  { id: uuidv4(), date: '2023-05-01', invoiceId: 'INV001', name: 'Acme Corp', mode: 'Credit Card', amount: 1000 },
  { id: uuidv4(), date: '2023-05-05', invoiceId: 'INV002', name: 'Globex Inc', mode: 'Bank Transfer', amount: 1500 },
  { id: uuidv4(), date: '2023-05-08', invoiceId: 'INV003', name: 'Initech', mode: 'Cash', amount: 800 },
]

// Mock data for products
export const mockProducts: Product[] = [
  { id: uuidv4(), product_name: 'Widget A', customs_code: 'WA001', unit_selling_price: 19.99, available_units: 100, reorder_level: 20 },
  { id: uuidv4(), product_name: 'Gadget B', customs_code: 'GB002', unit_selling_price: 29.99, available_units: 75, reorder_level: 15 },
  { id: uuidv4(), product_name: 'Tool C', customs_code: 'TC003', unit_selling_price: 39.99, available_units: 50, reorder_level: 10 },
]

// Mock data for refunds
export const mockRefunds: Refund[] = [
  { id: uuidv4(), date: '2023-05-01', invoiceId: 'INV001', receiptId: 'REC001', name: 'Acme Corp', mode: 'Credit Card', amount: 100 },
  { id: uuidv4(), date: '2023-05-05', invoiceId: 'INV002', receiptId: 'REC002', name: 'Globex Inc', mode: 'Bank Transfer', amount: 150 },
  { id: uuidv4(), date: '2023-05-08', invoiceId: 'INV003', receiptId: 'REC003', name: 'Initech', mode: 'Cash', amount: 80 },
]

// Mock data for vendors
export const mockVendors: Vendor[] = [
  { id: uuidv4(), name: 'Supply Pro Ltd', contact: '(555) 123-4567', email: 'contact@supplypro.com' },
  { id: uuidv4(), name: 'Global Materials Inc', contact: '(555) 987-6543', email: 'info@globalmaterials.com' },
  { id: uuidv4(), name: 'Quality Goods Co', contact: '(555) 246-8135', email: 'sales@qualitygoods.com' },
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
    id: uuidv4(), 
    date: '2024-03-01', 
    expenseNumber: 'EXP-001',
    vendorName: 'Supply Pro Ltd',
    category: 'Supplies',
    amount: 1500,
    status: 'Paid'
  },
  { 
    id: uuidv4(), 
    date: '2024-03-05', 
    expenseNumber: 'EXP-002',
    vendorName: 'Travel Agency Inc',
    category: 'Travel',
    amount: 2500,
    status: 'Pending'
  },
  { 
    id: uuidv4(), 
    date: '2024-03-08', 
    expenseNumber: 'EXP-003',
    vendorName: 'City Power Co',
    category: 'Utilities',
    amount: 800,
    status: 'Approved'
  },
] 