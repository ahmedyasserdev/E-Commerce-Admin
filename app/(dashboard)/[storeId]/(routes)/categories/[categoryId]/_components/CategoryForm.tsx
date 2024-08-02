"use client";

import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CategoryFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {Billboard, Category } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import { useOrigin } from "@/hooks/use-origin";
 type CategoryFormValues = z.infer<typeof CategoryFormSchema>;
const CategoryForm = ({ initialData , billboards }: { initialData: Category | null ; billboards : Billboard[] }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add a new Category";
  const toastMessage = initialData ? "Category updated!" : "Category Created!";
  const action = initialData ? "Save changes" : "Create";
  const params = useParams();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });


  const onSubmit = (values: CategoryFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(
            `/api/${params?.storeId}/categories/${params.categoryId}`,
            values
          );
        } else {
          await axios.post(`/api/${params.storeId}/categories`, values);
        }
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/categories`);
      } catch (error) {
        toast.error("Something went wrong ");
      }
    });
  };

  const deletedCategory = () => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/categories/${params?.categoryId}`);
        router.refresh();
        router.push(`/${params.storeId}/categories`);
        toast.success("Category deleted successfully!");
      } catch (error) {
        toast.error(
          "Make sure you remove all products using this Category first"
        );
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deletedCategory}
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
                      placeholder="Category Name"
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select disabled = {isPending} defaultValue= {field.value} value = {field.value} onValueChange={field.onChange} >
                    <FormControl>
                    <SelectTrigger>
                      <SelectValue  placeholder="Select a billboard" defaultValue={field.value} />
                    </SelectTrigger>

                    </FormControl>

                    <SelectContent>
                    {
                      billboards.map((billboard) => (
                        <SelectItem key = {billboard.id} value = {billboard.id} >{billboard.label}</SelectItem>
                      ))
                    }
                    </SelectContent>

                  </Select>

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

export default CategoryForm;
