"use client";

import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColorFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
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

type ColorFormValues = z.infer<typeof ColorFormSchema>;
const ColorForm = ({ initialData }: { initialData: Color | null }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData ? "Edit a Color" : "Add a new Color";
  const toastMessage = initialData ? "Color updated!" : "Color Created!";
  const action = initialData ? "Save changes" : "Create";
  const params = useParams();
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(ColorFormSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });


  const onSubmit = (values: ColorFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(
            `/api/${params?.storeId}/colors/${params.colorId}`,
            values
          );
        } else {
          await axios.post(`/api/${params.storeId}/colors`, values);
        }
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/colors`);
      } catch (error) {
        toast.error("Something went wrong ");
      }
    });
  };

  const deletedColor = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/colors/${params?.colorId}`);
        router.refresh();
        router.push(`/${params.storeId}/colors`);
        toast.success("Color deleted successfully!");
      } catch (error) {
        toast.error(
          "Make sure you remove all categories using this color first"
        );
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deletedColor}
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
                      placeholder="Color Name"
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
                    <div className="flex items-center gap-x-2">
                    <Input
                      placeholder="Color Value"
                      disabled={isPending}
                      {...field}
                    />
                    <div  className = 'p-4 border rounded-full' style={{backgroundColor : field.value}} />
                    </div>
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

export default ColorForm;
