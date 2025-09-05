import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await client.api.categories[":id"].$delete({
        param: { id }
      });
      return await response.json()
    },
    onSuccess: async () => {
      toast.success("Category deleted");
      // 这里和教程不同，使用 react-query 中推荐的用法
      await Promise.all([
        // 这里和教程不同，由于教程中没有使用 Promise 阻塞，所以 onSuccess 能立即返回
        // 其实在 InvalidQueries 之后会触发后台多次 retry 404，阻塞 onSuccess 返回
        // 所以改用 removeQueries，不再触发 query retry
        queryClient.removeQueries({ queryKey: ["category", { id }]}),
        queryClient.invalidateQueries({ queryKey: ["categories"]})
      ])
    },
    onError: () => {
      toast.error("Failed to delete category");
    }
  });

  return mutation
}