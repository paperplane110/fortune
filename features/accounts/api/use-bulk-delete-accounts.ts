import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];
type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
      
      if (!response.ok) {
        throw new Error("Failed to bulk delete accounts.");
      }
      
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Accounts deleted");
      // invalidate 作废，让 key 是 accounts 的请求结果作废，因为我们已经更新 account。
      // queryKey "accounts" 的来源是 use-get-accounts.ts 中的 queryKey
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete accounts")
    }
  });

  return mutation
}
