"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
};
const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Are you sure"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >  

    <div className="pt-6 flex-end space-x-2 w-full">
        <Button disabled = {isPending}  variant = "outline" onClick={onClose} >
            Cancel 
        </Button>
        <Button disabled = {isPending}  variant = "destructive" onClick={onConfirm} >
            Continue 
        </Button>
    </div>
    </Modal>
  );
};

export default AlertModal;
