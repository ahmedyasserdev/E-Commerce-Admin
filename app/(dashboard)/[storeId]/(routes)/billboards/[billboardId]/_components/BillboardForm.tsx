"use client";

import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillboardFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
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
import ApiAlert from "@/components/shared/ApiAlert";
import { useOrigin } from "@/hooks/user-origin";
import ImageUploader from "@/components/shared/ImageUploader";
type BillboardFormValues = z.infer<typeof BillboardFormSchema>;
const BillboardForm = ({ initialData }: { initialData: Billboard | null }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard";
  const toastMessage = initialData ? "Billboard updated!" : "Billboard Created!";
  const action = initialData ? "Save changes" : "Create";
  const params = useParams();
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(BillboardFormSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });


  const onSubmit = (values: BillboardFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(
            `/api/${params?.storeId}/billboards/${params.billboardId}`,
            values
          );
        } else {
          await axios.post(`/api/${params.storeId}/billboards`, values);
        }
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
      } catch (error) {
        toast.error("Something went wrong ");
      }
    });
  };

  const deletedBillboard = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/billboards/${params?.billboardId}`);
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
        toast.success("Billboard deleted successfully!");
      } catch (error) {
        toast.error(
          "Make sure you remove all categories using this billboard first"
        );
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deletedBillboard}
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    disabled={isPending}
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={(ur) => field.onChange("")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3  gap-8 ">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Billboard label"
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

export default BillboardForm;
