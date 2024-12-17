'use client'

import { useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Vendor } from '@/utils/types'
import { mockVendors } from '@/utils/mocks'

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [newVendor, setNewVendor] = useState<Omit<Vendor, 'id'>>({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    tax_id: '',
    address: '',
    city: '',
    country: '',
    payment_terms: 'Net 30',
    website: ''
  } as Omit<Vendor, 'id'>)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [error, setError] = useState<string>('')

  const handleCreateVendor = () => {
    const { company_name, contact_name, email, phone } = newVendor
    if (!company_name || !contact_name || !email || !phone) {
      setError('Company name, contact name, email, and phone are required.')
      return
    }
    const vendor: Vendor = {
      id: Math.max(0, ...vendors.map(v => v.id)) + 1,
      ...newVendor
    }
    setVendors([...vendors, vendor])
    setNewVendor({
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      tax_id: '',
      address: '',
      city: '',
      country: '',
      payment_terms: 'Net 30',
      website: ''
    })
    setError('')
  }

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Enter the details for the new vendor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_name" className="text-right">
                  Company Name *
                </Label>
                <Input
                  id="company_name"
                  value={newVendor.company_name}
                  onChange={(e) => setNewVendor({ ...newVendor, company_name: e.target.value })}
                  className="col-span-3"
                  placeholder="Company Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_name" className="text-right">
                  Contact Name *
                </Label>
                <Input
                  id="contact_name"
                  value={newVendor.contact_name}
                  onChange={(e) => setNewVendor({ ...newVendor, contact_name: e.target.value })}
                  className="col-span-3"
                  placeholder="Contact Person Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="col-span-3"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="123-456-7890"
                  type="tel"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tax_id" className="text-right">
                  Tax ID
                </Label>
                <Input
                  id="tax_id"
                  value={newVendor.tax_id}
                  onChange={(e) => setNewVendor({ ...newVendor, tax_id: e.target.value })}
                  className="col-span-3"
                  placeholder="Tax ID Number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  className="col-span-3"
                  placeholder="Street Address"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  value={newVendor.city}
                  onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
                  className="col-span-3"
                  placeholder="City"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Input
                  id="country"
                  value={newVendor.country}
                  onChange={(e) => setNewVendor({ ...newVendor, country: e.target.value })}
                  className="col-span-3"
                  placeholder="Country"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_terms" className="text-right">
                  Payment Terms
                </Label>
                <Input
                  id="payment_terms"
                  value={newVendor.payment_terms}
                  onChange={(e) => setNewVendor({ ...newVendor, payment_terms: e.target.value })}
                  className="col-span-3"
                  placeholder="Net 30"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={newVendor.website}
                  onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
              {error && (
                <div className="col-span-4 text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreateVendor}>Add Vendor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{vendor.company_name}</TableCell>
              <TableCell>{vendor.contact_name}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.phone}</TableCell>
              <TableCell>{vendor.city || '-'}</TableCell>
              <TableCell>{vendor.country || '-'}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleViewDetails(vendor)}
                  variant="outline"
                  size="sm"
                >
                  <FileText className="mr-2 h-4 w-4" /> View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedVendor && (
        <Dialog open={!!selectedVendor} onOpenChange={() => setSelectedVendor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Company Name:</strong> {selectedVendor.company_name}</p>
              <p><strong>Contact Name:</strong> {selectedVendor.contact_name}</p>
              <p><strong>Email:</strong> {selectedVendor.email}</p>
              <p><strong>Phone:</strong> {selectedVendor.phone}</p>
              <p><strong>Tax ID:</strong> {selectedVendor.tax_id || '-'}</p>
              <p><strong>Address:</strong> {selectedVendor.address || '-'}</p>
              <p><strong>City:</strong> {selectedVendor.city || '-'}</p>
              <p><strong>Country:</strong> {selectedVendor.country || '-'}</p>
              <p><strong>Payment Terms:</strong> {selectedVendor.payment_terms}</p>
              <p><strong>Website:</strong> {selectedVendor.website || '-'}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 