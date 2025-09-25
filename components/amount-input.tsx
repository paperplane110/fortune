import CurrencyInput from "react-currency-input-field"
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  disabled?: boolean;
}

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) => {
  const parseValue = parseFloat(value);
  const isIncome = parseValue > 0;
  const isExpense = parseValue < 0;

  const onReverseValue = () => {
    if (!value) {
      return;
    }
    onChange((parseValue * -1).toString())
  }


  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button type="button" onClick={onReverseValue}
              className={cn(
                "absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center"
              )}
            >
              {!parseValue && <Info className="size-3 text-muted-foreground" />}
              {/* 这里和教程不同 */}
              {isIncome && <PlusCircle className="size-3 text-green-600" />}
              {isExpense && <MinusCircle className="size-3 text-red-600" />}
            </button>
          </TooltipTrigger>
          <TooltipContent align="start">
            Switch income or an expense
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput 
        prefix="¥"
        className="pl-8 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        placeholder={placeholder}
        value={value}
        decimalsLimit={2}
        decimalScale={2}
        onValueChange={onChange}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground mt-2">
        {isIncome && 'This will count as income'}
        {isExpense && 'This will count as an expense'}
      </p>
    </div>
  )
}