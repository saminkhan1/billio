'use client'

import { useState } from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AppSidebar } from '@/components/Sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceManagement } from '@/components/invoice-management'
import { OverviewManagement } from '@/components/overview-management'
import { ClientManagement } from '@/components/client-management'
import { ProductManagement } from '@/components/product-management'
import { EstimatesManagement } from '@/components/estimates-management'
import { PaymentsManagement } from '@/components/payments-management'
import { RefundsManagement } from '@/components/refunds-management'
import { DeliveryNoteManagement } from '@/components/delivery-note-management'
import { VendorManagement } from '@/components/vendor-management'
import { PurchaseOrderManagement } from '@/components/purchase-order-management'
import { ExpenseManagement } from '@/components/expense-management'
import { SidebarProvider } from '@/components/ui/sidebar'
import Settings from '@/components/Settings'
import { PAndLStatementManagement } from '@/components/pl-statement-management'
import { CashBookManagement } from '@/components/cash-book-management'
import { BankBookManagement } from '@/components/bank-book-management'
import { TaxReportManagement } from '@/components/tax-report-management'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview')

    const handleTabChange = (value: string) => {
        const tabName = value.split('/').pop() || 'overview'
        setActiveTab(tabName)
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <main className="flex-1 bg-gray-100 w-full">
                    <div className="h-full w-full p-6">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full w-full">
                            <TabsContent value="overview">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Overview</CardTitle>
                                        <CardDescription>Your business at a glance.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <OverviewManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Sales Section */}
                            <TabsContent value="products">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Products</CardTitle>
                                        <CardDescription>Manage your products here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ProductManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="clients">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clients</CardTitle>
                                        <CardDescription>Manage your clients here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ClientManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="estimates">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Estimates</CardTitle>
                                        <CardDescription>Manage your estimates here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <EstimatesManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="invoices">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Invoices</CardTitle>
                                        <CardDescription>Manage your invoices here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <InvoiceManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="payments">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payments</CardTitle>
                                        <CardDescription>Manage your payments here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PaymentsManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="refunds">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Refunds</CardTitle>
                                        <CardDescription>Manage your refunds here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RefundsManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="delivery-note">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Delivery Notes</CardTitle>
                                        <CardDescription>Manage your delivery notes here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <DeliveryNoteManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Purchases Section */}
                            <TabsContent value="vendors">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Vendors</CardTitle>
                                        <CardDescription>Manage your vendors here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <VendorManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="purchase-order">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Purchase Orders</CardTitle>
                                        <CardDescription>Manage your purchase orders here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PurchaseOrderManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="expenses">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Expenses</CardTitle>
                                        <CardDescription>Manage your expenses here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ExpenseManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Accounting Section - Placeholder Cards */}
                            <TabsContent value="pl-statement">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>P&L Statement</CardTitle>
                                        <CardDescription>View your profit and loss statement here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PAndLStatementManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="cash-book">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cash Book</CardTitle>
                                        <CardDescription>Manage your cash transactions here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <CashBookManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="bank-book">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bank Book</CardTitle>
                                        <CardDescription>Manage your bank transactions here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <BankBookManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="tax-report">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tax Report</CardTitle>
                                        <CardDescription>View and manage your tax reports here.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <TaxReportManagement />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Settings</CardTitle>
                                        <CardDescription>Manage your application settings.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Settings />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                        </Tabs>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
