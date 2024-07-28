"use client";
import {useState} from "react"
import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { CreateStoreSchema } from "@/schemas";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";
import {toast} from "react-hot-toast"
const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isLoading , setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof CreateStoreSchema>>({
      resolver: zodResolver(CreateStoreSchema),
      defaultValues: {
        name: "",
      },
    });

    async function onSubmit(values: z.infer<typeof CreateStoreSchema>) {
        try {
            setIsLoading(true); 
            const response = await axios.post('/api/stores', values)
            console.log(response.data)
        }catch (error) {
          toast.error('Something went wrong!')
        }finally {
          setIsLoading(false)
        }
    }

  return (
    <Modal
      title="Create Store"
      description="Add a new Store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
        <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled = {isLoading} placeholder="E-Commerce" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

            <div className="pt-6 flex-end w-full space-x-2">
        <Button  disabled = {isLoading}  onClick = {onClose} variant = "outline">Cancel</Button>
        <Button disabled = {isLoading}  type="submit">Continue</Button>

            </div>
      </form>
    </Form>
        </div>
    </Modal>
  );
};

export default StoreModal;
