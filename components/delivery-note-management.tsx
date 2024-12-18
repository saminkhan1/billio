'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid'
import { DeliveryNote } from '@/utils/types'
import { mockDeliveryNotes } from '@/utils/mocks'

export function DeliveryNoteManagement() {
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>(mockDeliveryNotes)
  const [newDeliveryNote, setNewDeliveryNote] = useState<Omit<DeliveryNote, 'id'>>({ date: '', name: '', contact: '', email: '' })
  const [error, setError] = useState<string>('')

  const handleCreateDeliveryNote = () => {
    const { date, name, contact, email } = newDeliveryNote
    if (!date || !name || !contact || !email) {
      setError('All fields are required.')
      return
    }
    const deliveryNote: DeliveryNote = {
      id: uuidv4(),
      date,
      name,
      contact,
      email,
    }
    setDeliveryNotes([...deliveryNotes, deliveryNote])
    setNewDeliveryNote({ date: '', name: '', contact: '', email: '' })
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Delivery Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Delivery Note</DialogTitle>
              <DialogDescription>
                Enter the details for the new delivery note.
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
                  value={newDeliveryNote.date}
                  onChange={(e) => setNewDeliveryNote({ ...newDeliveryNote, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newDeliveryNote.name}
                  onChange={(e) => setNewDeliveryNote({ ...newDeliveryNote, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Recipient Name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact #
                </Label>
                <Input
                  id="contact"
                  value={newDeliveryNote.contact}
                  onChange={(e) => setNewDeliveryNote({ ...newDeliveryNote, contact: e.target.value })}
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
                  value={newDeliveryNote.email}
                  onChange={(e) => setNewDeliveryNote({ ...newDeliveryNote, email: e.target.value })}
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
              <Button onClick={handleCreateDeliveryNote}>Add Delivery Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>D Note #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact #</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryNotes.map((note) => (
            <TableRow key={note.id}>
              <TableCell>{note.date}</TableCell>
              <TableCell>{note.id}</TableCell>
              <TableCell>{note.name}</TableCell>
              <TableCell>{note.contact}</TableCell>
              <TableCell>{note.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}