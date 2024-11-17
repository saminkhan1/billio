'use client'

import { useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Client } from '@/utils/types'
import { mockClients } from '@/utils/mocks'

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({ name: '', contact_number: '', email: '' })
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [error, setError] = useState<string>('')

  const handleCreateClient = () => {
    const { name, contact_number, email } = newClient
    if (!name || !contact_number || !email) {
      setError('All fields are required.')
      return
    }
    const client: Client = {
      id: clients.length + 1,
      name,
      contact_number,
      email,
    }
    setClients([...clients, client])
    setNewClient({ name: '', contact_number: '', email: '' })
    setError('')
  }

  const handleViewSummary = (client: Client) => {
    setSelectedClient(client)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the details for the new client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Client Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_number" className="text-right">
                  Contact Number
                </Label>
                <Input
                  id="contact_number"
                  value={newClient.contact_number}
                  onChange={(e) => setNewClient({ ...newClient, contact_number: e.target.value })}
                  className="col-span-3"
                  placeholder="123-456-7890"
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
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
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
              <Button onClick={handleCreateClient}>Add Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.contact_number}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleViewSummary(client)}
                  variant="outline"
                  size="sm"
                >
                  <FileText className="mr-2 h-4 w-4" /> View Summary
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Client Summary</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedClient.name}</p>
              <p><strong>Contact Number:</strong> {selectedClient.contact_number}</p>
              <p><strong>Email:</strong> {selectedClient.email}</p>
              {/* Add more client summary information here */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}