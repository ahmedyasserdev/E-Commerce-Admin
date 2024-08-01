"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Store } from "@prisma/client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Check, PlusCircle, Store as StoreIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectTrigger>;

interface StoreSwitcherProps extends SelectTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const { onOpen } = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (storeId: string) => {
    router.push(`/${storeId}`);
  };

  return (
    <Select onValueChange={onStoreSelect}>
      <SelectTrigger
        className={cn(
          "w-full  border-none focus-visible:ring-transparent focus:ring-transparent transition-all duration-150  ",
          className
        )}
      >
        <div className="flex items-center gap-x-2.5 w-[100px]  md:w-[200px] p-medium-14">
          <StoreIcon className="size-6" />
          <SelectValue placeholder={currentStore?.label} />
        </div>
      </SelectTrigger>

      <SelectContent>
        {formattedItems.map((item) => (
          <SelectItem
            className={cn(" p-0 w-full my-2.5 pl-2 ") }
            key={item.value}
            value={item.value}
          >
              <div className = "flex items-center" >
              <StoreIcon className="mr-2 size-5" />
              <p className = "p-regular-16" >{item.label}</p>
              </div>
        

           
          </SelectItem>
        ))}

        <Separator className="bg-gray-200 my-2" />
        <Button onClick={() => onOpen()} variant="outline" className="w-full ">
          <PlusCircle className="mr-2 size-5" />
          Create Store
        </Button>
      </SelectContent>
    </Select>
  );
}
