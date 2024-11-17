import { Button } from "@/components/ui/button"
import { DollarSign, FileText, CreditCard, Users, Settings, Package, Clipboard, RefreshCw, Truck, Store, ShoppingCart, Receipt } from 'lucide-react'

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800">E-Invoicing</h2>
            </div>
            <nav className="mt-6">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('overview')}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Overview
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('products')}>
                    <Package className="mr-2 h-4 w-4" />
                    Products
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('estimates')}>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Estimates
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('invoices')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Invoices
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('payments')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payments
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('refunds')}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refunds
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('delivery-note')}>
                    <Truck className="mr-2 h-4 w-4" />
                    Delivery Note
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('clients')}>
                    <Users className="mr-2 h-4 w-4" />
                    Clients
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('vendors')}>
                    <Store className="mr-2 h-4 w-4" />
                    Vendors
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('purchase-orders')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('expenses')}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Expenses
                </Button>
            </nav>
        </aside>
    )
} 