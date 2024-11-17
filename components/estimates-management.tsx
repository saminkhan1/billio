'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Mock data for estimates
const mockEstimates = [
  { id: 1, date: '2023-05-01', name: 'Acme Corp', contact: '(555) 123-4567', email: 'contact@acme.com', amount: 1000 },
  { id: 2, date: '2023-05-05', name: 'Globex Inc', contact: '(555) 987-6543', email: 'info@globex.com', amount: 1500 },
  { id: 3, date: '2023-05-08', name: 'Initech', contact: '(555) 246-8135', email: 'sales@initech.com', amount: 800 },
]

export function EstimatesManagement() {
  const [estimates, setEstimates] = useState(mockEstimates)
  const [newEstimate, setNewEstimate] = useState({ date: '', name: '', contact: '', email: '', amount: '' })

  const handleCreateEstimate = () => {
    const estimate = {
      id: estimates.length + 1,
      date: newEstimate.date,
      name: newEstimate.name,
      contact: newEstimate.contact,
      email: newEstimate.email,
      amount: parseFloat(newEstimate.amount),
    }
    setEstimates([...estimates, estimate])
    setNewEstimate({ date: '', name: '', contact: '', email: '', amount: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end ">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Estimate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Estimate</DialogTitle>
              <DialogDescription>
                Enter the details for the new estimate.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newEstimate.date}
                  onChange={(e) => setNewEstimate({ ...newEstimate, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newEstimate.name}
                  onChange={(e) => setNewEstimate({ ...newEstimate, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact #
                </Label>
                <Input
                  id="contact"
                  value={newEstimate.contact}
                  onChange={(e) => setNewEstimate({ ...newEstimate, contact: e.target.value })}
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
                  value={newEstimate.email}
                  onChange={(e) => setNewEstimate({ ...newEstimate, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newEstimate.amount}
                  onChange={(e) => setNewEstimate({ ...newEstimate, amount: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEstimate}>Create Estimate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Estimate #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact #</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estimates.map((estimate) => (
            <TableRow key={estimate.id}>
              <TableCell>{estimate.date}</TableCell>
              <TableCell>{estimate.id}</TableCell>
              <TableCell>{estimate.name}</TableCell>
              <TableCell>{estimate.contact}</TableCell>
              <TableCell>{estimate.email}</TableCell>
              <TableCell>${estimate.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 