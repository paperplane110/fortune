import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.categories.$post>;

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });
      
      if (!response.ok) {
        throw new Error("Failed to create category.");
      }
      
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Category created");
      // invalidate 作废，让 key 是 categories 的请求结果作废，因为我们已经更新 categories.
      // queryKey "categories" 的来源是 use-get-categories.ts 中的 queryKey
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create category")
    }
  });

  return mutation
}
