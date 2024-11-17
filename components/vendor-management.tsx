'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid'
import { Vendor } from '@/utils/types'
import { mockVendors } from '@/utils/mocks'

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [newVendor, setNewVendor] = useState<Omit<Vendor, 'id'>>({ name: '', contact: '', email: '' })
  const [error, setError] = useState<string>('')

  const handleCreateVendor = () => {
    const { name, contact, email } = newVendor
    if (!name || !contact || !email) {
      setError('All fields are required.')
      return
    }
    const vendor: Vendor = {
      id: uuidv4(),
      name,
      contact,
      email,
    }
    setVendors([...vendors, vendor])
    setNewVendor({ name: '', contact: '', email: '' })
    setError('')
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Enter the details for the new vendor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Vendor Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact #
                </Label>
                <Input
                  id="contact"
                  value={newVendor.contact}
                  onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                  className="col-span-3"
                  placeholder="(555) 123-4567"
                  type="tel"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
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
            <TableHead>Name</TableHead>
            <TableHead>Contact #</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell>{vendor.contact}</TableCell>
              <TableCell>{vendor.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 