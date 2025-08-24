// components/expense-table.tsx
"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  Search,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useDeleteExpense, useExpenses } from "@/hooks/use-inifinite-scroll"
import { toast } from "sonner"
import AddExpenseSheet from "@/components/modals/expensesSheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ExpenseTable: React.FC = () => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null)

  const deleteExpenseMutation = useDeleteExpense()

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useExpenses({
    page: currentPage,
    limit: 10,
  })

  const expenses = data?.expenses || []
  const pagination = data?.pagination

  const handleDeleteClick = (expenseId: number) => {
    setExpenseToDelete(expenseId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return
    
    try {
      await deleteExpenseMutation.mutateAsync(expenseToDelete)
      toast.success("Expense deleted successfully")
      setDeleteDialogOpen(false)
      setExpenseToDelete(null)
    } catch (error) {
      toast.error("Failed to delete expense")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.note.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading && !isFetching) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Manage Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading expenses...</span>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Manage Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{"Error: " + error?.message}</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or note"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 && !isFetching ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No expenses found</h3>
              <p className="text-sm text-gray-500">No expenses match your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">S/N</TableHead>
                    <TableHead>Expense Category</TableHead>
                    <TableHead>Amount (₦)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense, index) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * (pagination?.limit || 10) + (index + 1)}
                      </TableCell>
                      <TableCell>
                        <span>{expense.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">₦{Number(expense.amount).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{expense.date}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{expense.note}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(expense.id)}
                          disabled={deleteExpenseMutation.isPending}
                        >
                          {deleteExpenseMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {isFetching && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                        Fetching more expenses...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isFetching}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNumber: number
                    
                    if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    
                    pageNumber = Math.max(1, Math.min(pageNumber, pagination.totalPages))
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className={currentPage === pageNumber ? "bg-primary text-primary-foreground" : ""}
                        disabled={isFetching}
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || isFetching}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseSheet
        open={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpense}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteExpenseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

export default ExpenseTable