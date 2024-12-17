'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createClient } from '@/utils/supabase/client'
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/utils/cn"
import type { Client } from '@/utils/types'

interface FormError {
  field: string;
  message: string;
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [newClient, setNewClient] = useState<Partial<Client>>({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    vat_number: '',
    address: '',
    city: '',
    country: ''
  })
  const [error, setError] = useState<string>('')
  const [errors, setErrors] = useState<FormError[]>([])
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')

    if (error) {
      setError('Failed to fetch clients')
      console.error('Error fetching clients:', error)
      return
    }

    setClients(data || [])
  }

  const validateForm = (): boolean => {
    const newErrors: FormError[] = []

    if (!newClient.company_name?.trim()) {
      newErrors.push({
        field: 'company_name',
        message: 'Company name is required'
      })
    }

    if (!newClient.email?.trim()) {
      newErrors.push({
        field: 'email',
        message: 'Email is required'
      })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.email)) {
      newErrors.push({
        field: 'email',
        message: 'Invalid email format'
      })
    }

    if (!newClient.phone?.trim()) {
      newErrors.push({
        field: 'phone',
        message: 'Phone number is required'
      })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCreateClient = async () => {
    if (!validateForm()) {
      return
    }

    const { error: insertError } = await supabase
      .from('clients')
      .insert([{
        company_name: newClient.company_name,
        contact_name: newClient.contact_name,
        email: newClient.email,
        phone: newClient.phone,
        vat_number: newClient.vat_number,
        address: newClient.address,
        city: newClient.city,
        country: newClient.country
      }])

    if (insertError) {
      setError('Failed to create client')
      console.error('Error creating client:', insertError)
      return
    }

    fetchClients()
    setNewClient({
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      vat_number: '',
      address: '',
      city: '',
      country: ''
    })
    setErrors([])
    setError('')
    setOpen(false)
  }

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the details for the new client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <TooltipProvider>
                {/* Company Name */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="company_name" className="text-right">
                        Company Name *
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the company name</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3 space-y-2">
                    <Input
                      id="company_name"
                      placeholder="Company Name"
                      value={newClient.company_name}
                      onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                      className={cn(
                        getFieldError('company_name') && "border-red-500 focus-visible:ring-red-500"
                      )}
                      required
                    />
                    {getFieldError('company_name') && (
                      <p className="text-sm text-red-500">
                        {getFieldError('company_name')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Name */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="contact_name" className="text-right">
                        Contact Name
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the primary contact name</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3">
                    <Input
                      id="contact_name"
                      placeholder="Contact Name"
                      value={newClient.contact_name}
                      onChange={(e) => setNewClient({ ...newClient, contact_name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-right">
                        Contact Info *
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter contact details</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@company.com"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        className={cn(
                          getFieldError('email') && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                      {getFieldError('email') && (
                        <p className="text-sm text-red-500">
                          {getFieldError('email')}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        className={cn(
                          getFieldError('phone') && "border-red-500 focus-visible:ring-red-500"
                        )}
                        required
                      />
                      {getFieldError('phone') && (
                        <p className="text-sm text-red-500">
                          {getFieldError('phone')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* VAT Number */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="vat_number" className="text-right">
                        VAT Number
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter company VAT number</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3">
                    <Input
                      id="vat_number"
                      placeholder="VAT Number"
                      value={newClient.vat_number}
                      onChange={(e) => setNewClient({ ...newClient, vat_number: e.target.value })}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-right">
                        Address
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter company address details</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="col-span-3 space-y-4">
                    <Input
                      id="address"
                      placeholder="Street Address"
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="city"
                        placeholder="City"
                        value={newClient.city}
                        onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                      />
                      <Input
                        id="country"
                        placeholder="Country"
                        value={newClient.country}
                        onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="col-span-4 rounded-md bg-red-50 p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TooltipProvider>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateClient}>
                Save
              </Button>
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
            <TableHead>VAT Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.company_name}</TableCell>
              <TableCell>{client.contact_name || '-'}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.vat_number || '-'}</TableCell>
              <TableCell>{client.address || '-'}</TableCell>
              <TableCell>{client.city || '-'}</TableCell>
              <TableCell>{client.country || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}