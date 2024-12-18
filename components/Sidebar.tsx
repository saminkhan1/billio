import * as React from "react"
import { ChevronRight, Package, Users, FileText, CreditCard, RefreshCw, Truck, Store, ShoppingCart, Receipt, PieChart, BookOpen, Building2, FileBarChart, DollarSign, Settings, Building, Users as UsersIcon, Shield, Mail, Database } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface AppSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, tabName: string) => {
        e.preventDefault() // Prevent navigation
        setActiveTab(tabName)
    }

    const data = {
        navMain: [
            {
                title: "Sales",
                items: [
                    {
                        title: "Products",
                        tab: "products",
                        icon: <Package className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Clients",
                        tab: "clients",
                        icon: <Users className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Estimates",
                        tab: "estimates",
                        icon: <FileText className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Invoices",
                        tab: "invoices",
                        icon: <FileText className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Payments",
                        tab: "payments",
                        icon: <CreditCard className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Refunds",
                        tab: "refunds",
                        icon: <RefreshCw className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Delivery Note",
                        tab: "delivery-note",
                        icon: <Truck className="mr-2 h-4 w-4" />
                    },
                ],
            },
            {
                title: "Purchases",
                items: [
                    {
                        title: "Vendors",
                        tab: "vendors",
                        icon: <Store className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Purchase Order",
                        tab: "purchase-order",
                        icon: <ShoppingCart className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Expenses",
                        tab: "expenses",
                        icon: <Receipt className="mr-2 h-4 w-4" />
                    },
                ],
            },
            {
                title: "Accounting",
                items: [
                    {
                        title: "P&L Statement",
                        tab: "pl-statement",
                        icon: <PieChart className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Cash Book",
                        tab: "cash-book",
                        icon: <BookOpen className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Bank Book",
                        tab: "bank-book",
                        icon: <Building2 className="mr-2 h-4 w-4" />
                    },
                    {
                        title: "Tax Report",
                        tab: "tax-report",
                        icon: <FileBarChart className="mr-2 h-4 w-4" />
                    },
                ],
            },
            {
                title: "Settings",
                items: [
                    {
                        title: "General Settings",
                        tab: "settings",
                        icon: <Settings className="mr-2 h-4 w-4" />
                    }
                ],
            },
        ],
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800">E-Invoicing</h2>
                </div>
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {/* Overview Button */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={activeTab === 'overview'}
                                    onClick={(e) => handleClick(e as any, 'overview')}
                                >
                                    <a href="#" className="flex items-center">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Overview
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {data.navMain.map((section) => (
                    <Collapsible
                        key={section.title}
                        title={section.title}
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel
                                asChild
                                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <CollapsibleTrigger>
                                    {section.title}{" "}
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {section.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={activeTab === item.tab}
                                                    onClick={(e) => handleClick(e as any, item.tab)}
                                                >
                                                    <a href="#" className="flex items-center">
                                                        {item.icon}
                                                        {item.title}
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
