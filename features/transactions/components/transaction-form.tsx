import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { Button } from "@/components/ui/button";
import { insertTransactionSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { convertAmountToMiliunits } from "@/lib/utils";

// 定义表单的 schema
// 这里的 schema 是 ZodObject 对象的一个实例，而非类型
const formSchema = z.object({
  /**
   * 这里和教程不同，没有使用强制类型转化，原因如下
   * 首先，当使用 coerce 时，useForm 会将 field.value 推断为 unknown，因为 coerce 接受任何类型的输入。
   * 这将与 DatePicker 组件的 value 属性类型 Date|undefined 不匹配。
   * 其次，我们能够保证 DatePicker 中的 Calendar 组件调用 onChange 时，会传递一个 Date 类型的参数。
   * 这是因为在 Calendar 组件中 onSelect 回调中，传入类型与 value 类型一致。
   */
  date: z.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
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
    defaultValues: defaultValue || {
      payee: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMiliunits = convertAmountToMiliunits(amount);
  
    console.log(values)
    onSubmit({
      ...values,
      amount: amountInMiliunits,
    });
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
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder="Add a payee"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput 
                  // 这里不是 {...field}
                  // 当在 FormField 中使用 {...field} 时，React Hook Form 会传递一个 ref 给组件，用于表单验证和焦点管理。
                  // 函数组件不能直接接收 ref ：普通的函数组件不能直接接收 ref 属性，需要使用 React.forwardRef() 来包装。
                  // 或者直接明确向 AmountInput 组件传递的属性。
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Optional notes"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={disabled}>
          {id ? "Save changes" : "Create transaction"}
        </Button>
        {id && <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={handleDelete}
          disabled={disabled}
        >
          <Trash className="size-4" />
          Delete transaction
        </Button>}
      </form>
    </Form>
  )
}