"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/hooks/use-toast";
import { Trash2 } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";

// Zod schema for validating the finance transaction form data
const financeSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be positive"),
  type: z.enum(["income", "expense"]),
});

// Transaction type that matches your database schema.
export type Transaction = {
  id?: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

// Define a type for operations we want to queue.
// For deletes, we now include the transaction details for undo support.
type TransactionOperation =
  | { type: "add"; transaction: Transaction }
  | { type: "delete"; id: number; transaction: Transaction };

function FinanceChart({ transactions }: { transactions: Transaction[] }) {
  // Group transactions by date (formatted as YYYY-MM-DD)
  const grouped = transactions.reduce(
    (acc, t) => {
      const dateKey = new Date(t.date).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { income: 0, expense: 0 };
      }
      acc[dateKey][t.type] += t.amount;
      return acc;
    },
    {} as Record<string, { income: number; expense: number }>,
  );
  const sortedDates = Object.keys(grouped).sort();
  const data = sortedDates.map((date) => ({
    date,
    income: grouped[date].income,
    expense: grouped[date].expense,
  }));

  const chartConfig = {
    income: { label: "Income", color: "green" },
    expense: { label: "Expense", color: "red" },
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Transactions Over Time</h3>
      <ChartContainer id="finance-chart" config={chartConfig}>
        <RechartsPrimitive.LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
          <RechartsPrimitive.XAxis dataKey="date" />
          <RechartsPrimitive.YAxis />
          <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
          <RechartsPrimitive.Legend content={<ChartLegendContent />} />
          <RechartsPrimitive.Line
            type="monotone"
            dataKey="income"
            stroke="var(--color-income)"
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
          <RechartsPrimitive.Line
            type="monotone"
            dataKey="expense"
            stroke="var(--color-expense)"
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </RechartsPrimitive.LineChart>
      </ChartContainer>
    </div>
  );
}

//
// FinancesSection Component
//
export default function FinancesSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectType, setSelectType] = useState<"income" | "expense">("expense");
  const { toast } = useToast();

  // Queue to hold pending database operations.
  const [operationQueue, setOperationQueue] = useState<TransactionOperation[]>(
    [],
  );
  const isProcessingQueue = useRef(false);

  // Ref to track pending deletion timeouts for undo functionality.
  const pendingDeletionRef = useRef<{
    [id: number]: ReturnType<typeof setTimeout>;
  }>({});
  // Process operations one at a time.
  const processQueue = async () => {
    if (operationQueue.length === 0) return;
    const op = operationQueue[0];
    const db = createClient();

    try {
      if (op.type === "add") {
        const { data: insertedData, error } = await db
          .from("transactions")
          .insert(op.transaction)
          .select();
        if (error || !insertedData) {
          throw new Error(error?.message || "Error inserting transaction.");
        }
        setTransactions((prev) => [
          ...(insertedData as Transaction[]),
          ...prev,
        ]);
        reset({ description: "", amount: 0, type: selectType });
      } else if (op.type === "delete") {
        const { error } = await db
          .from("transactions")
          .delete()
          .eq("id", op.id);
        if (error) throw new Error(error.message);
        // The UI was already updated upon deletion.
        toast({ title: "Transaction deleted" });
      }
    } catch (err: any) {
      toast({
        title:
          op.type === "add"
            ? "Error adding transaction"
            : "Error deleting transaction",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setOperationQueue((q) => q.slice(1));
    }
  };
  // Initialize react-hook-form with zod schema
  const form = useForm<z.infer<typeof financeSchema>>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
    },
  });
  const { handleSubmit, register, reset, setValue, formState } = form;

  // Load transactions from the database.
  async function fetchTransactions() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("id", { ascending: false });
      if (error || !data) {
        throw new Error(error?.message || "Error fetching transactions.");
      }
      setTransactions(data as Transaction[]);
    } catch (err: any) {
      toast({
        title: "Error fetching transactions",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const processQueueIfNeeded = async () => {
      if (operationQueue.length > 0 && !isProcessingQueue.current) {
        isProcessingQueue.current = true;
        await processQueue();
        isProcessingQueue.current = false;
      }
    };
    processQueueIfNeeded();
  }, [operationQueue]);

  // Handle form submission to add a transaction.
  async function onSubmit(data: z.infer<typeof financeSchema>) {
    const newTransaction: Transaction = {
      ...data,
      date: new Date().toLocaleString(),
    };
    // Enqueue the add operation.
    setOperationQueue((q) => [
      ...q,
      { type: "add", transaction: newTransaction },
    ]);
  }

  // Handle deletion with undo support.
  function deleteTransaction(id: number) {
    const transactionToDelete = transactions.find((t) => t.id === id);
    if (!transactionToDelete) return;
    // Optimistically remove the transaction from state.
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Show a toast with an Undo button.
    toast({
      title: "Transaction deleted",
      description: "You can undo this action.",
      action: (
        <Button
          variant="link"
          onClick={() => handleUndoDelete(id, transactionToDelete)}
        >
          Undo
        </Button>
      ),
    });

    // Set a timeout before enqueuing the delete operation.
    const timeoutId = setTimeout(() => {
      setOperationQueue((q) => [
        ...q,
        { type: "delete", id, transaction: transactionToDelete },
      ]);
      delete pendingDeletionRef.current[id];
    }, 5000); // 5-second delay before finalizing deletion

    pendingDeletionRef.current[id] = timeoutId;
  }

  // Undo deletion: cancel the timeout and restore the transaction.
  function handleUndoDelete(id: number, transaction: Transaction) {
    const pendingTimeout = pendingDeletionRef.current[id];
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
      delete pendingDeletionRef.current[id];
      setTransactions((prev) => [transaction, ...prev]);
      toast({
        title: "Undo successful",
        description: "Transaction has been restored.",
      });
    }
  }

  // Calculate totals.
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  return (
    <div className="w-full max-w-2xl mt-4 space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight">Finances</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row items-center gap-2"
      >
        <Input
          placeholder="Description"
          {...register("description")}
          className="md:flex-1"
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Amount"
          {...register("amount", { valueAsNumber: true })}
          className="md:w-32"
        />
        <Select
          defaultValue="expense"
          onValueChange={(val: "income" | "expense") => {
            setSelectType(val);
            setValue("type", val);
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Add</Button>
      </form>

      {formState.errors.description && (
        <p className="text-red-500 text-sm">
          {formState.errors.description.message}
        </p>
      )}
      {formState.errors.amount && (
        <p className="text-red-500 text-sm">
          {formState.errors.amount.message}
        </p>
      )}

      <Separator />
      <div className="flex justify-between text-sm font-medium">
        <span className="text-green-600">Income: ${income.toFixed(2)}</span>
        <span className="text-red-600">Expenses: ${expense.toFixed(2)}</span>
        <span className="text-blue-600">Balance: ${balance.toFixed(2)}</span>
      </div>

      <ScrollArea className="h-64 border rounded-md p-2">
        {loading ? (
          <p className="text-center text-muted-foreground">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li
                key={t.id}
                className={cn(
                  "p-2 rounded-md flex justify-between items-center border",
                  t.type === "income"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30",
                )}
              >
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (t.id) deleteTransaction(t.id);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
      {transactions.length > 0 && <FinanceChart transactions={transactions} />}
    </div>
  );
}
