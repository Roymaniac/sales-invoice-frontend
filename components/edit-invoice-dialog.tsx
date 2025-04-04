"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FileUpload } from "./file-upload"
import * as React from "react"
import axios from "axios"
import { toast } from "./ui/use-toast"

const formSchema = z.object({
  invoiceNo: z.string().min(1, "Invoice number is required"),
  customer: z.string().min(1, "Customer name is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.string().min(1, "Date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
})

type Invoice = {
  id: string
  invoiceNo: string
  date: string
  dueDate: string
  customer: string
  notes?: string
  amount: number
  status: "PAID" | "UNPAID" | "OVERDUE"
  createdAt?: string
  updatedAt?: string
}

interface EditInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice | null,
  onUpdated: () => void
}

export function EditInvoiceDialog({ open, onOpenChange, invoice, onUpdated }: EditInvoiceDialogProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNo: invoice?.invoiceNo || "",
      customer: invoice?.customer || "",
      amount: invoice?.amount?.toString() || "",
      date: invoice?.date ? new Date(invoice.date).toISOString().split("T")[0] : "",
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : "",
      status: invoice?.status || "",
      notes: invoice?.notes || "",
    },
  })

  React.useEffect(() => {
    if (invoice) {
      form.reset({
        invoiceNo: invoice.invoiceNo || "",
        customer: invoice.customer || "",
        amount: invoice.amount?.toString() || "",
        date: invoice.date ? new Date(invoice.date).toISOString().split("T")[0] : "",
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : "",
        status: invoice.status || "",
        notes: invoice.notes || "",
      })
    } else {
      form.reset() 
    }
  }, [invoice, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (invoice) {
        const updatedInvoice = {
          ...values,
          amount: parseFloat(values.amount),
        }

        // Update invoice in the database
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_API_URI}/invoice/${invoice.id}`, updatedInvoice)
        if (res.status === 200) {
          // Alert user that invoice was updated successfully
          toast({ title: "Success", description: "Invoice updated successfully!", variant: "default" })
          onUpdated()
          console.log("Invoice updated successfully")
        }
      
      } else {
        // Create invoice
        const newInvoice = {
          ...values,
          amount: parseFloat(values.amount),
        }

        // Save new invoice to the backend database
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URI}/invoice`, newInvoice)
        if (res.status === 201) {
          // Alert user that invoice was created successfully
          toast({ title: "Success", description: "Invoice created successfully!", variant: "default" })
          onOpenChange(false)
          onUpdated()
          console.log("Invoice created successfully")
        }

      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong!", variant: "destructive" })
      console.error("Error updating invoice:", error)
    }
    // Close the dialog after submission
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Make changes to the invoice here." : "Create a new invoice here."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="invoiceNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="UNPAID">Unpaid</SelectItem>
                        <SelectItem value="OVERDUE">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional notes here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {invoice && <FileUpload invoiceId={invoice.id} />}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

