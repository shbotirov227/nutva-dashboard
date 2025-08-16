"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import { createBlog } from "@/lib/api";
import { toast } from "react-toastify";

export default function CreateBlogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/dashboard/blog");
    },
    onError: (error) => {
      console.error("Blog yaratishda xatolik:", error);
    }
  });

  const handleSubmit = async (formData) => {
    try {
      // Transform form data to match API expectations
      const apiData = {
        Published: formData.Published,
        ImageFiles: formData.ImageFiles,
        VideoFiles: formData.VideoFiles,
        ImageUrls: formData.ImageUrls,
        VideoUrls: formData.VideoUrls,
        "En.Title": formData["En.Title"],
        "En.Subtitle": formData["En.Subtitle"],
        "En.Content": formData["En.Content"],
        "En.MetaTitle": formData["En.MetaTitle"],
        "En.MetaDescription": formData["En.MetaDescription"],
        "En.MetaKeywords": formData["En.MetaKeywords"],
        "Uz.Title": formData["Uz.Title"],
        "Uz.Subtitle": formData["Uz.Subtitle"],
        "Uz.Content": formData["Uz.Content"],
        "Uz.MetaTitle": formData["Uz.MetaTitle"],
        "Uz.MetaDescription": formData["Uz.MetaDescription"],
        "Uz.MetaKeywords": formData["Uz.MetaKeywords"],
        "Ru.Title": formData["Ru.Title"],
        "Ru.Subtitle": formData["Ru.Subtitle"],
        "Ru.Content": formData["Ru.Content"],
        "Ru.MetaTitle": formData["Ru.MetaTitle"],
        "Ru.MetaDescription": formData["Ru.MetaDescription"],
        "Ru.MetaKeywords": formData["Ru.MetaKeywords"],
      };

      await createMutation.mutateAsync(apiData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <BlogForm
        isEdit={false}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}