import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json });
      
      if (!response.ok) {
        throw new Error("Failed to create transaction.");
      }
      
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Transaction created");
      // invalidate 作废，让 key 是 transactions 的请求结果作废，因为我们已经更新 transaction。
      // queryKey "transactions" 的来源是 use-get-transactions.ts 中的 queryKey
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: invalidate summary
    },
    onError: () => {
      toast.error("Failed to create transaction")
    }
  });

  return mutation
}
