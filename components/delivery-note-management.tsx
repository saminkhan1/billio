'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Mock data for delivery notes
const mockDeliveryNotes = [
    { id: 1, date: '2023-05-01', name: 'Acme Corp', contact: '(555) 123-4567', email: 'contact@acme.com' },
    { id: 2, date: '2023-05-05', name: 'Globex Inc', contact: '(555) 987-6543', email: 'info@globex.com' },
    { id: 3, date: '2023-05-08', name: 'Initech', contact: '(555) 246-8135', email: 'sales@initech.com' },
]

export function DeliveryNoteManagement() {
    const [deliveryNotes, setDeliveryNotes] = useState(mockDeliveryNotes)
    const [newDeliveryNote, setNewDeliveryNote] = useState({ date: '', name: '', contact: '', email: '' })

    const handleCreateDeliveryNote = () => {
        const deliveryNote = {
            id: deliveryNotes.length + 1,
            date: newDeliveryNote.date,
            name: newDeliveryNote.name,
            contact: newDeliveryNote.contact,
            email: newDeliveryNote.email,
        }
        setDeliveryNotes([...deliveryNotes, deliveryNote])
        setNewDeliveryNote({ date: '', name: '', contact: '', email: '' })
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
                                />
                            </div>
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