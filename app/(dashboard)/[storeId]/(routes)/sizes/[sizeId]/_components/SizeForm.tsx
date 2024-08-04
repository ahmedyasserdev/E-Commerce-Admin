"use client";

import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SizeFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUploader from "@/components/shared/ImageUploader";
type SizeFormValues = z.infer<typeof SizeFormSchema>;
const SizeForm = ({ initialData }: { initialData: Size | null }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit a Size" : "Add a new Size";
  const toastMessage = initialData ? "Size updated!" : "Size Created!";
  const action = initialData ? "Save changes" : "Create";
  const params = useParams();
  const form = useForm<SizeFormValues>({
    resolver: zodResolver(SizeFormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });


  const onSubmit = (values: SizeFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(
            `/api/${params?.storeId}/sizes/${params.sizeId}`,
            values
          );
        } else {
          await axios.post(`/api/${params.storeId}/sizes`, values);
        }
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
      } catch (error) {
        toast.error("Something went wrong ");
      }
    });
  };

  const deletedSize = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/sizes/${params?.sizeId}`);
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
        toast.success("Size deleted successfully!");
      } catch (error) {
        toast.error(
          "Make sure you remove all categories using this Size first"
        );
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deletedSize}
        isPending={isPending}
      />

      <div className="flex-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            size="icon"
            variant="destructive"
            onClick={() => setOpen(true)}
            disabled={isPending}
          >
            <Trash className="size-4" />
          </Button>
        )}
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Size Name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Size Value"
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
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default SizeForm;
