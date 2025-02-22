"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Download, File } from "lucide-react"

interface ViewInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: any
}

export function ViewInvoiceDialog({ open, onOpenChange, invoice }: ViewInvoiceDialogProps) {
  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between mt-4">
            <span>Invoice #{invoice.invoiceNumber}</span>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div>
                  <div className="text-sm font-medium">{invoice.customer}</div>
                  <div className="text-sm text-muted-foreground">customer@example.com</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  123 Business Street
                  <br />
                  City, State 12345
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Amount</div>
                  <div>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(invoice.amount)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Status</div>
                  <div
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium",
                      invoice.status === "PAID" && "bg-green-100 text-green-700",
                      invoice.status === "UNPAID" && "bg-yellow-100 text-yellow-700",
                      invoice.status === "OVERDUE" && "bg-red-100 text-red-700",
                    )}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Due Date</div>
                  <div className="text-sm">{new Date(invoice.dueDate).toUTCString() || "N/A"}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Attached Files</CardTitle>
              <CardDescription>Files and documents attached to this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {/* Example attached files */}
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-sm">
                    <p className="truncate font-medium">invoice-details.pdf</p>
                    <p className="text-xs text-muted-foreground">2.5MB</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download file</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">Via Bank Transfer</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">$1,234.56</p>
                    <p className="text-sm text-muted-foreground">2024-02-21</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Invoice Created</p>
                    <p className="text-sm text-muted-foreground">Due in 30 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">$1,234.56</p>
                    <p className="text-sm text-muted-foreground">2024-02-20</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

