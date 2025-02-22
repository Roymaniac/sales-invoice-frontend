"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditInvoiceDialog } from "./edit-invoice-dialog"
import { ViewInvoiceDialog } from "./view-invoice-dialog"

type Invoice = {
  id: string
  invoiceNo: string
  date: string
  dueDate: string
  customer: string
  amount: number
  notes?: string
  status: "PAID" | "UNPAID" | "OVERDUE"
  createdAt?: string
  updatedAt?: string
}

const data: Invoice[] = []
export function InvoiceTable() {
  const [invoices, setInvoices] = React.useState<Invoice[]>()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [viewInvoice, setViewInvoice] = React.useState<Invoice | null>(null)
  const [editInvoice, setEditInvoice] = React.useState<Invoice | null>(null)

  
  async function fetchInvoices() {
    try {
      const res = await axios.get("http://localhost:3000/invoice");
      setInvoices(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  }

  React.useEffect(() => {
    fetchInvoices();
  }, [])

  
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoiceNo",
      header: "Invoice Number",
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Due Date
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const dueDate = new Date(row.getValue("dueDate"))
        return dueDate.toLocaleDateString()
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div
            className={cn(
              "w-fit rounded-md px-2 py-1 text-xs font-medium",
              status === "PAID" && "bg-green-100 text-green-700",
              status === "UNPAID" && "bg-yellow-100 text-yellow-700",
              status === "OVERDUE" && "bg-red-100 text-red-700",
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = new Date(row.getValue("createdAt"))
        return createdAt.toLocaleDateString()
      }
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => {
        const updatedAt = new Date(row.getValue("updatedAt"))
        return updatedAt.toLocaleDateString()
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewInvoice(invoice)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditInvoice(invoice)}>Edit Invoice</DropdownMenuItem>
              <DropdownMenuItem>Download PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: invoices || data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
    <ViewInvoiceDialog
        open={!!viewInvoice}
        onOpenChange={(open) => !open && setViewInvoice(null)}
        invoice={viewInvoice}
      />
      <EditInvoiceDialog
        open={!!editInvoice}
        onOpenChange={(open) => !open && setEditInvoice(null)}
        invoice={editInvoice}
      />
    </>
  )
}

