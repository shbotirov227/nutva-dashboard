"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BannerForm from "@/components/BannerForm";
import { getBannerById, updateBanner } from "@/lib/api";
import { LANGS, BannerFormType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [initialData, setInitialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getBannerById(id as string).then((data) => {
        console.log("Banner API dan kelgan ma'lumotlar:", data);
        console.log("Banner Data strukturasi:", {
          length: data?.length,
          firstItem: data?.[0],
          hasImageUrls: data?.[0]?.imageUrls,
          imageUrlsType: typeof data?.[0]?.imageUrls,
          imageUrlsValue: data?.[0]?.imageUrls,
          link: data?.[0]?.link
        });
        setInitialData(data);
        setLoading(false);
      }).catch((error) => {
        console.error("Error loading banner:", error);
        setLoading(false);
      });
    }
  }, [id]);

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

      console.log("Update Banner FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      return updateBanner(id as string, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      router.push("/dashboard/banner");
      toast.success("Banner muvaffaqiyatli yangilandi", { position: "top-center", autoClose: 1500 });
    },
    onError: (error) => {
      console.error("Banner update error:", error);
      toast.error(`Xatolik: ${(error as Error).message}`, { position: "top-center", autoClose: 1500 });
    },
  });

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto animate-pulse">
        <CardHeader>
          <Skeleton className="h-6 w-48 rounded" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-48 w-full rounded" />
          {Object.values(LANGS).map((lang) => (
            <div key={lang} className="border p-4 space-y-3 rounded-lg">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-24 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 rounded" />
        </CardContent>
      </Card>
    );
  }

  console.log("Banner Initial Data:", initialData);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Bannerni tahrirlash</h1>
      <BannerForm
        initialData={initialData}
        onSubmit={(formValues, imageFiles) => {
          console.log("Edit banner form submitted with:", {
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