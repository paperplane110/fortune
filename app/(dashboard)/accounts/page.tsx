"use client"

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const AccountsPage = () => {
  const newAccount = useNewAccount();
  const bulkDeleteAccount = useBulkDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];

  const isDisabled = accountsQuery.isLoading || accountsQuery.isPending;

  if (accountsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex justify-center items-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Accounts
          </CardTitle>
          <Button
            size="sm"
            onClick={newAccount.onOpen}
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <Suspense fallback={DataTable.Skeleton()}>
            <DataTable
              filterKey="name"
              columns={columns}
              data={accounts}
              onDelete={(rows) => {
                const ids = rows.map((row) => row.original.id);
                bulkDeleteAccount.mutate({ ids });
              }}
              disabled={isDisabled}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountsPage;