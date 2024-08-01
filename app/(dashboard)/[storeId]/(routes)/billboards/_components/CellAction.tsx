"use client";

import { Button } from "@/components/ui/button";
import { BillboardColumn } from "./Columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useTransition, useState } from "react";
import AlertModal from "@/components/modals/AlertModal";
type CellActionProps = {
  data: BillboardColumn;
};
export const CellAction = ({ data }: CellActionProps) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const deletedBillboard = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/billboards/${data?.id}`);

        router.refresh();
        toast.success("Billboard deleted successfully!");
      } catch (error) {
        toast.error(
          "Make sure you remove all categories using this billboard first"
        );
      }
    });
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard Id copied to the clipboard.");
  };
  return (
    <>
    <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deletedBillboard}
        isPending={isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 p-0 ">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            {" "}
            <Copy className="mr-2 size-4" /> Copy Id{" "}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/${params.storeId}/billboards/${data.id}`);
            }}
          >
            {" "}
            <Edit className="mr-2 size-4" /> Update{" "}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)} >
            {" "}
            <Trash className="mr-2 size-4" /> Delete{" "}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
    </>
  );
};
