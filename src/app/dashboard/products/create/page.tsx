"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "@/lib/api";
import { ProductFormType } from "@/lib/types";

export default function CreateProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ProductFormType) => {
      const formData = new FormData();
      formData.append("En.Name", values.En.Name);
      formData.append("En.Description", values.En.Description);
      formData.append("En.MetaTitle", values.En.MetaTitle);
      formData.append("En.MetaDescription", values.En.MetaDescription);
      formData.append("En.MetaKeywords", values.En.MetaKeywords);
      formData.append("En.Slug", values.En.Slug);

      formData.append("Uz.Name", values.Uz.Name);
      formData.append("Uz.Description", values.Uz.Description);
      formData.append("Uz.MetaTitle", values.Uz.MetaTitle);
      formData.append("Uz.MetaDescription", values.Uz.MetaDescription);
      formData.append("Uz.MetaKeywords", values.Uz.MetaKeywords);
      formData.append("Uz.Slug", values.Uz.Slug);

      formData.append("Ru.Name", values.Ru.Name);
      formData.append("Ru.Description", values.Ru.Description);
      formData.append("Ru.MetaTitle", values.Ru.MetaTitle);
      formData.append("Ru.MetaDescription", values.Ru.MetaDescription);
      formData.append("Ru.MetaKeywords", values.Ru.MetaKeywords);
      formData.append("Ru.Slug", values.Ru.Slug);

      formData.append("Price", values.Price?.toString() || "");

      values.ImageUrls.forEach((file, i) => {
        formData.append(`Images[${i}]`, file);
      });


      return createProduct(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/dashboard/products");
      toast.success("Mahsulot muvaffaqiyatli yaratildi", {
        position: "top-center",
        autoClose: 1500,
      });
    },
    onError: (error) => {
      toast.error(`Xatolik: ${(error as Error).message}`);
    },
  });

  return (
    <ProductForm onSubmit={(data) => mutation.mutate(data)} loading={mutation.isPending} />
  );
}
