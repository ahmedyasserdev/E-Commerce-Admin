import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const billboardToDelete = async(billboardId : string) => {
      await axios.delete(`/api/billboards/${billboardId}`);
   
};


export const priceFormatter = (price : number) => {
  return new Intl.NumberFormat("en-US", {
    style : "currency",
    currency : "USD"
  }).format(price)
}