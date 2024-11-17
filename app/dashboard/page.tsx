'use client'

import { useState } from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Sidebar from '@/components/Sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, CreditCard, Users } from 'lucide-react'
import { InvoiceManagement } from '@/components/invoice-management'
import { OverviewManagement } from '@/components/overview-management'
import { ClientManagement } from '@/components/client-management'
import { ProductManagement } from '@/components/product-management'
import { EstimatesManagement } from '@/components/estimates-management'
import { PaymentsManagement } from '@/components/payments-management'
import { RefundsManagement } from '@/components/refunds-management'
import { DeliveryNoteManagement } from '@/components/delivery-note-management'
import Settings from '@/components/Settings'
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main content */}
            <main className="flex-1 p-8 overflow-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsContent value="overview">
                        <OverviewManagement />
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
                    <TabsContent value="settings">
                        <Settings />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}