"use client";

import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettingsFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/shared/ApiAlert";
import { useOrigin } from "@/hooks/use-origin";
type SettingsFormValues = z.infer<typeof SettingsFormSchema>;
const SettingsForm = ({ initialData }: { initialData: Store }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const origin = useOrigin()
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: initialData,
  });

  const onSubmit = (values: SettingsFormValues) => {
    startTransition(async () => {
      try {
        await axios.patch(`/api/stores/${initialData.id}`, values);
        router.refresh();
        toast.success("Store updated successfully!");
      } catch (error) {
        toast.error("Something went wrong ");
      }
    });
  };

  const deleteStore = () => {
    startTransition(async() => {
        try {
            await axios.delete(`/api/stores/${initialData.id}`);
            router.refresh()
            router.push('/');
            toast.success("Store deleted successfully!");
        }catch (error){
            toast.error("Make sure you remove all products and categories first")
        }
    } )
  }

  return (
    <>
        <AlertModal 
            isOpen = {open}
            onClose = {() => setOpen(false)}
            onConfirm = {deleteStore}
            isPending = {isPending}
        />

      <div className="flex-between">
        <Heading title="Settings" description="Manage Store preferences" />

        <Button
          size="icon"
          variant="destructive"
          onClick={() => setOpen(true)}
          disabled={isPending}
        >
          <Trash className="size-4" />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3  gap-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Store name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {form.formState.isSubmitting
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </form>
      </Form>
      <Separator />
                <ApiAlert  title = "NEXT_PUBLIC_API_URL" description= {`${origin}/api/${initialData.id}`} variant = "public" />

    </>
  );
};

export default SettingsForm;
