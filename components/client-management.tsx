import { useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Mock data for clients
const mockClients = [
  { id: 1, name: 'Acme Corp', contact_number: '123-456-7890', email: 'contact@acmecorp.com' },
  { id: 2, name: 'TechStart Inc', contact_number: '987-654-3210', email: 'info@techstart.com' },
  { id: 3, name: 'Global Services LLC', contact_number: '456-789-0123', email: 'support@globalservices.com' },
]

export function ClientManagement() {
  const [clients, setClients] = useState(mockClients)
  const [newClient, setNewClient] = useState({ name: '', contact_number: '', email: '' })
  const [selectedClient, setSelectedClient] = useState(null)

  const handleCreateClient = () => {
    const client = {
      id: clients.length + 1,
      name: newClient.name,
      contact_number: newClient.contact_number,
      email: newClient.email,
    }
    setClients([...clients, client])
    setNewClient({ name: '', contact_number: '', email: '' })
  }

  const handleViewSummary = (client) => {
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
                />
              </div>
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