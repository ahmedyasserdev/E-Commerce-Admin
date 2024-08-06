"use client";

import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, Category, Image, Size, Color } from "@prisma/client";
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
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ImageUploader from "@/components/shared/ImageUploader";

import { SelectItem } from "@/components/ui/select";
import DropdownSelect from "@/components/shared/DropdownSelect";
type ProductFormValues = z.infer<typeof ProductFormSchema>;
type ProductFormProps = {
  initialData: (Product & { images: Image[] }) | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
};

const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit a Product" : "Add a new Product";
  const toastMessage = initialData ? "Product updated!" : "Product Created!";
  const action = initialData ? "Save changes" : "Create";
  const params = useParams();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData?.price)) }
      : {
          name: "",
          images: [],
          categoryId: "",
          colorId: "",
          price: 0,
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = (values: ProductFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(
            `/api/${params?.storeId}/products/${params.productId}`,
            values
          );
        } else {
          await axios.post(`/api/${params.storeId}/products`, values);
        }
        toast.success(toastMessage);
        router.refresh();
        router.push(`/${params.storeId}/products`);
      } catch (error) {
        toast.error("Something went wrong ");
      }
    });
  };

  const deletedProduct = () => {
    startTransition(async () => {
      try {
        await axios.delete(
          `/api/${params.storeId}/products/${params?.productId}`
        );
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success("Product deleted successfully!");
      } catch (error) {
        toast.error(
          "Something went wrong"
        );
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deletedProduct}
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUploader
                    disabled={isPending}
                    value={field.value.map((image) => image.url)}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(ur) =>
                      field.onChange(
                        field.value.filter(
                          (currentImage) => currentImage.url !== ur
                        )
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3  gap-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product Name"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="9.99"
                      type="number"
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <DropdownSelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a Category"
                      disabled={isPending}
                    >
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </DropdownSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <DropdownSelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a Size"
                      disabled={isPending}
                    >
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </DropdownSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <DropdownSelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a Color"
                      disabled={isPending}
                    >
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </DropdownSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row p-4 items-start space-x-3 space-y-0 rounded-md border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none space-y-1">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      this product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
         
         
         
         <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row p-4 items-start space-x-3 space-y-0 rounded-md border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none space-y-1">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      this product won&apos;t appear anywhere in the store
                    </FormDescription>
                  </div>
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

export default ProductForm;
