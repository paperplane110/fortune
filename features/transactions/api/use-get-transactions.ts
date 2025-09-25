import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransactions = () => {
    const params = useSearchParams()
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    return useQuery({
        // TODO: check if params are needed in the queryKey
        // in use-edit-transaction, we invalidate the query only by the keyword "transactions"
        queryKey: ["transactions", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.transactions.$get({
                query: { from, to, accountId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions.");
            }
            const { data } = await response.json();
            return data.map((transaction) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount)
            }));
        }
    })
}
