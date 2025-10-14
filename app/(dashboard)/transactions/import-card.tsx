import { useState } from "react";
import { format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { ImportTable } from "./import-table";
import { convertAmountToMiliunits } from "@/lib/utils";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
  "amount",
  "date",
  "payee",
];

/* * something like { "column_1": "amount", "column_2": null, ... }
*/
interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void
}

export const ImportCard = ({
  data,
  onCancel,
  onSubmit,
}: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({})

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null,
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev }  // deep copy previous record

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          // Let's say previously column 1 is assigned to "amount"
          // now the user chose column 2 as "amount",
          // we need to remove the previous assignment of column 1, whose value is "amount"
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    })
  }

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getKeyName = (index: number) => {
      return `column_${index}`;
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        // ! here is different from the tutorial
        // const columnIndex = getColumnIndex(`column_${index}`);
        // return selectedColumns[`column_${columnIndex}`] || null;
        const columnIndex = getKeyName(index)
        return selectedColumns[columnIndex] || null
      }),
      body: body.map((row) => { // body is a list of TRANSFORMED ROW
        const transformedRow = row.map((cell, index) => {
          // transformedRow is a list of cell, 
          // whose value will be remained only if it's column has been selected, 
          // otherwise it will be replaced by null
          const columnIndex = getKeyName(index);
          return selectedColumns[columnIndex] ? cell : null;
        });

        // make sure at least one cell has value in one row, 
        // otherwise this row is an empty row, which is a []
        return transformedRow.every((item) => item === null)
          ? []
          : transformedRow
      })
        .filter((row) => row.length > 0)  // filter empty rows
    }

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index]
        if (header !== null) {
          acc[header] = cell
        }
        return acc
      }, {})
    })

    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat)
    }));

    onSubmit(formattedData)
  }

    return(
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Import Transaction
            </CardTitle>
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <Button
                size="sm"
                onClick={onCancel}
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={progress < requiredOptions.length}
                onClick={handleContinue}
                className="w-full lg:w-auto"
              >
                Countinue ({progress} / {requiredOptions.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ImportTable
              headers={headers}
              body={body}
              selectedColumns={selectedColumns}
              onTableHeadSelectChange={onTableHeadSelectChange}
            />
          </CardContent>
        </Card>
      </div>
    )
}