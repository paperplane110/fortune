"use client"
import { Suspense, useState } from "react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";

import { Plus } from "lucide-react";
import { transactions as transactionSchema } from "@/db/schema"
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import { columns } from "./columns";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { toast } from "sonner";

enum VARIANT {
  LIST = "LIST",
  IMPORT = "IMPORT"
}

const INITIAL_IMPORT_RESULT = {
  data: [],
  errors: [],
  meta: {},
}

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANT>(VARIANT.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULT);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
    console.log(results)
    setImportResults(results);
    setVariant(VARIANT.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULT);
    setVariant(VARIANT.LIST);
  };

  const newTransaction = useNewTransaction();
  const bulkCreateTransactions = useBulkCreateTransactions()
  const bulkDeleteTransactions = useBulkDeleteTransactions();
  // const transactionsQuery = useGetTransactions();
  // const transactions = transactionsQuery.data || [];
  // const isDisabled = transactionsQuery.isLoading || transactionsQuery.isPending;

  const onSubmitImport = async (
    values: typeof transactionSchema.$inferInsert[],  
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }))

    bulkCreateTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    })
  }

  // if (transactionsQuery.isLoading) {
  //   return (
  //     <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
  //       <Card className="border-none drop-shadow-sm">
  //         <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
  //           <Skeleton className="h-8 w-48" />
  //         </CardHeader>
  //         <CardContent>
  //           <div className="h-[500px] w-full flex justify-center items-center">
  //             <Loader2 className="size-6 text-slate-300 animate-spin" />
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  if (variant === VARIANT.IMPORT) {
    return (
      <Suspense>
        <AccountDialog />
        <ImportCard 
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </Suspense>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton 
              onUpload={onUpload}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<DataTable.Skeleton />}>
            <TransactionsTable
              columns={columns}
              onDelete={(rows) => {
                const ids = rows.map((row) => row.original.id);
                bulkDeleteTransactions.mutate({ ids });
              }}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

import { ColumnDef, Row } from "@tanstack/react-table";

// 在同文件内新增该子组件，让挂起发生在 Suspense 内部

// NOTE typeof useGetTransactions, Get the type of the function "useGetTransactions"
// ReturnType<f> get the return type of the "f"
// ReturnType<f>["data"] get the value of "data" property from return type
// NonNullable<...>, will return Non Nullable type, e.g. NonNullable<a|undefined> will return a
// [number], 对数组类型做“元素类型索引”，提取数组元素的类型。若是 Transaction[] ，则得到 Transaction
type TransactionRow = NonNullable<ReturnType<typeof useGetTransactions>["data"]>[number];

type TransactionsTableProps<TValue = unknown> = {
  columns: ColumnDef<TransactionRow, TValue>[];
  onDelete: (rows: Row<TransactionRow>[]) => void;
};

function TransactionsTable<TValue = unknown>({
  columns,
  onDelete,
}: TransactionsTableProps<TValue>) {
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];
  const isDisabled = transactionsQuery.isLoading || transactionsQuery.isPending;

  return (
    <DataTable<TransactionRow, TValue>
      filterKey="payee"
      columns={columns}
      data={transactions}
      onDelete={onDelete}
      disabled={isDisabled}
    />
  )
}

export default TransactionsPage;