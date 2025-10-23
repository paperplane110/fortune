import z from "zod";
import { Loader2 } from "lucide-react";

import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory, ResponseType as CreateCategoryRespType } from "@/features/categories/api/use-create-category";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount, ResponseType as CreateAccountRespType } from "@/features/accounts/api/use-create-account";

import { insertTransactionSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// 定义表单的 schema
// 这里的 schema 是 ZodObject 对象的一个实例，而非类型
const formSchema = insertTransactionSchema.omit({ id: true });

// 定义表单的值类型
type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory()
  // NOTE 这里为 onSuccess 留出了开口，可以让调用方在创建成功后做一些额外的操作，比如为表单赋予新创建的值
  const onCreateCategory = (name: string, onSuccess?: (category: CreateCategoryRespType) => void) => categoryMutation.mutate({ name }, { onSuccess });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  // NOTE 这里为 onSuccess 留出了开口，可以让调用方在创建成功后做一些额外的操作，比如为表单赋予新创建的值
  const onCreateAccount = (name: string, onSuccess?: (account: CreateAccountRespType) => void) => accountMutation.mutate({ name }, { onSuccess });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  // while pending, the form would be disabled
  const isPending = 
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  // while loading, the skeleton would be shown
  const isLoading = 
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => { onClose(); },
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-white">
        <SheetHeader>
          <SheetTitle>
            New Transaction
          </SheetTitle>
          <SheetDescription>
            Add a new transaction
          </SheetDescription>
        </SheetHeader>
        {isLoading 
          ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) 
          : (
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )
        }
      </SheetContent>
    </Sheet>
  )
}