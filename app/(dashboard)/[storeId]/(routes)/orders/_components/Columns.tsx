"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id : string;
  phone : string ;
  address : string ;
  isPaid : boolean;
  products : string ;
  totalPrice : string;
  createdAt : string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "product",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
 
 
];
