"use client"

import { useMemo, useState } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable"

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export const Select = ({
  value,
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  // ? 格式化 value 为 react-select 要求的格式
  const onSelect = (
    option: SingleValue<{ label: string, value: string }>
  ) => {
    console.log('onSelect', option)
    onChange(option?.value)
  }

  // NOTE: don't understand 
  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  const handleCreateOptions = (newValue: string) => {
    setIsLoading(true);
    if (onCreate) {
      onCreate(newValue)
      onChange(newValue)
    }
    setIsLoading(false);
  }

  return (
    <CreateableSelect 
      isLoading={isLoading}
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": { borderColor: "#e2e8f0"},
        })
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={handleCreateOptions}
      isDisabled={disabled}
    />
  )
}