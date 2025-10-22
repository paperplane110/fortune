"use client";

import { useRef, useState } from "react";

import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-account";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/select";

export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name
  });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null); // NOTE understand this
  // Why use useRef? 
  // If using useState, dialog will refresh and flash when the value is changed.
  // NOTE Why use useState will cause flash:
  // Because useState will refresh the component when the value is changed.
  const selectValue = useRef<string>();

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve })
  })


  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  }

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  }

  const ConfirmationDialog = () => (
    // 这里和教程不同，是为了解决 model 点击周围黑色区域以及右上角 x 不退出的情况
    // 教程中 dialog 的显示只依赖 promise，导致了 bug
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>Please select an account to continue.</DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => selectValue.current = value}
          disabled={accountQuery.isLoading || accountMutation.isPending}
        />
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmationDialog, confirm]
}