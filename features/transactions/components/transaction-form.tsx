import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTransactionSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// 定义表单的 schema
// 这里的 schema 是 ZodObject 对象的一个实例，而非类型
const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categorId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});
const apiSchema = insertTransactionSchema.omit({ id: true });

// 定义表单的值类型
type FormValues = z.input<typeof formSchema>;
type ApiFormValue = z.input<typeof apiSchema>;

// 定义组件的 props 类型
type Props = {
  id?: string;
  defaultValue?: FormValues;
  onSubmit: (values: ApiFormValue) => void;
  onDelete?: () => void;
  disabled?: boolean;
  categoryOptions: { label: string; value: string }[];
  onCreateCategory: (name: string) => void;
  accountOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
}

export const TransactionForm = ({
  id,
  defaultValue,
  onSubmit,
  onDelete,
  disabled,
  categoryOptions,
  onCreateCategory,
  accountOptions,
  onCreateAccount,
}: Props) => {
  // form 实例
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Cash, Bank, Credit Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={disabled}>
          {id ? "Save changes" : "Create account"}
        </Button>
        {id && <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={handleDelete}
          disabled={disabled}
        >
          <Trash className="size-4" />
          Delete account
        </Button>}
      </form>
    </Form>
  )
}