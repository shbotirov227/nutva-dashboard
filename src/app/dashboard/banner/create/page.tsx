"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import BannerForm from "@/components/BannerForm";
import { createBanner } from "@/lib/api";
import { BannerFormType } from "@/lib/types";

export default function CreateBannerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ formValues, imageFiles }: { formValues: BannerFormType, imageFiles: File[] }) => {
      const formData = new FormData();

      // Til ma'lumotlarini qo'shish
      Object.keys(formValues).forEach((key) => {
        if (["Uz", "Ru", "En"].includes(key)) {
          const langData = formValues[key as keyof BannerFormType];
          if (langData && typeof langData === 'object' && !Array.isArray(langData)) {
            Object.keys(langData).forEach((field) => {
              formData.append(`${key}.${field}`, (langData as any)[field]);
            });
          }
        }
      });

      // Link ni qo'shish
      formData.append("Link", formValues.Link || "");

      // Rasm fayllarini bitta array sifatida qo'shish
      imageFiles.forEach(file => {
        formData.append("Images", file);
      });

      console.log("Create Banner FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      return createBanner(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      router.push("/dashboard/banner");
      toast.success("Banner muvaffaqiyatli yaratildi", { position: "top-center", autoClose: 1500 });
    },
    onError: (error) => {
      console.error("Banner creation error:", error);
      toast.error(`Xatolik: ${(error as Error).message}`, { position: "top-center", autoClose: 1500 });
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Banner qo'shish</h1>
      <BannerForm
        onSubmit={(formValues, imageFiles) => {
          console.log("Create banner form submitted with:", {
            formValues,
            imageFiles: imageFiles.map(f => ({ name: f.name, size: f.size }))
          });
          mutation.mutate({ formValues, imageFiles });
        }}
        loading={mutation.isPending}
      />
    </div>
  );
}