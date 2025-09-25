"use client"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"


import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Actions } from "./actions"
import { AccoutColumn } from "./account-column"

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date
                <ArrowUpDown className="size-4 ml-2" />
            </Button>
        )
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return (
        <span>
          {format(date, "yyyy-MM-dd")}
        </span>
      )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Category
                <ArrowUpDown className="size-4 ml-2" />
            </Button>
        )
    },
    cell: ({ row }) => {
      return (
        <span>
          {row.original.category}
        </span>
      )
    }
  },
  {
    accessorKey: "payee",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Payee
                <ArrowUpDown className="size-4 ml-2" />
            </Button>
        )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount
                <ArrowUpDown className="size-4 ml-2" />
            </Button>
        )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <span
          className={cn(
            "text-xs font-medium",
            amount > 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {formatCurrency(amount)}
        </span>
      )
    }
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Account
                <ArrowUpDown className="size-4 ml-2" />
            </Button>
        )
    },
    cell: ({ row }) => {
      return (
        <AccoutColumn
          account={row.original.account}
          accountId={row.original.accountId}
        />
      )
    }
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <Actions id={row.original.id} />
      )
    }
  },
]