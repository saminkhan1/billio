import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Settings() {
    const [companyName, setCompanyName] = useState('My Company')
    const [email, setEmail] = useState('contact@mycompany.com')
    const [currency, setCurrency] = useState('USD')
    const [taxRate, setTaxRate] = useState('10')
    const [darkMode, setDarkMode] = useState(false)
    const [emailNotifications, setEmailNotifications] = useState(true)

    const handleSaveGeneralSettings = () => {
        // Here you would typically make an API call to save the settings
        console.log('Saving general settings:', { companyName, email, currency, taxRate })
    }

    const handleSaveNotificationSettings = () => {
        // Here you would typically make an API call to save the settings
        console.log('Saving notification settings:', { emailNotifications })
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Settings</h2>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Manage your account settings and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                                <Input
                                    id="taxRate"
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="darkMode"
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                />
                                <Label htmlFor="darkMode">Enable Dark Mode</Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>Manage your notification preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="emailNotifications"
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                                <Label htmlFor="emailNotifications">Email Notifications</Label>
                            </div>
                            {/* Add more notification settings as needed */}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveNotificationSettings}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}