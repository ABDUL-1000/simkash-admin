// components/add-expense-sheet.tsx
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useAddExpense } from "@/hooks/use-inifinite-scroll";
import { toast } from "sonner";

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
}

const AddExpenseSheet: React.FC<AddExpenseSheetProps> = ({ open, onClose }) => {
  const addExpenseMutation = useAddExpense();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    note: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addExpenseMutation.mutateAsync(formData);
      toast("Expense added successfully");
      setFormData({
        name: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
      onClose();
    } catch (error) {
      toast("Failed to add expense");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>Add Expense</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Write a description for category..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={addExpenseMutation.isPending}
            className="mt-4"
          >
            {addExpenseMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Expense
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddExpenseSheet;
