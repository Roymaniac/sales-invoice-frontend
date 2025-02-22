"use client"
import * as React from "react"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { EditInvoiceDialog } from "@/components/edit-invoice-dialog"
import { InvoiceTable } from "@/components/invoice-table"
import { StatusFilter } from "@/components/status-filter"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const [selectedInvoice, setSelectedInvoice] = React.useState<any | null>(null)

  function handleOpenChange(open: boolean) {
    setSelectedInvoice(null)
    setOpen(open)
  }


  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-lg ml-5 font-semibold">Sales Invoices</h1>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <StatusFilter />
            <CalendarDateRangePicker />
          </div>
          <Button onClick={() => handleOpenChange(true)}>Create Invoice</Button>
        </div>
        <InvoiceTable />
      </div>
      <EditInvoiceDialog open={open} onOpenChange={handleOpenChange} invoice={selectedInvoice} />
    </div>
  )
}

