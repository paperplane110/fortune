import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];
type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({ json });
      
      if (!response.ok) {
        throw new Error("Failed to bulk delete categories.");
      }
      
      return await response.json()
    },
    onSuccess: () => {
      toast.success("Categories deleted");
      // invalidate 作废，让 key 是 categories 的请求结果作废，因为我们已经更新 category
      // queryKey "categories" 的来源是 use-get-categories.ts 中的 queryKey
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete categories")
    }
  });

  return mutation
}
