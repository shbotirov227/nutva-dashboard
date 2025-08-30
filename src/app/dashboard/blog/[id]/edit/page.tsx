"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import { getBlogById, updateBlog, deleteBlog } from "@/lib/api";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { Blog } from "@/lib/types";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const blogId = params.id as string;

  // Fetch blog data
  const { data: rawBlogData = [], isLoading, error } = useQuery({
    queryKey: ["blog", blogId as string],
    queryFn: () => getBlogById(blogId),
    enabled: !!blogId
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await updateBlog(blogId as string, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
      router.push("/dashboard/blog");
    },
    onError: (error) => {
      console.error("Blog yangilashda xatolik:", error);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteBlog(blogId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/dashboard/blog");
      toast.success("Blog muvaffaqiyatli o'chirildi");
    },
    onError: (error) => {
      console.error("Blog o'chirishda xatolik:", error);
      toast.error("Blog o'chirishda xatolik yuz berdi");
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Blog ma'lumotlari yuklanmoqda...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4 max-w-md">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h3 className="text-lg font-semibold">Blog topilmadi</h3>
              <p className="text-muted-foreground">
                {error.message || "Kechirasiz, bu blog mavjud emas yoki o'chirilgan bo'lishi mumkin."}
              </p>
              <button
                onClick={() => router.push("/dashboard/blog")}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Bloglar ro'yxatiga qaytish
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const processedBlogData = rawBlogData ? (() => {
    const data = {
      id: blogId,
      Published: false,
      ImageFiles: [],
      VideoFiles: [],
      ImageUrls: [],
      VideoUrls: [],
      "En.Title": "",
      "En.Subtitle": "",
      "En.Content": "",
      "En.MetaTitle": "",
      "En.MetaDescription": "",
      "En.MetaKeywords": "",
      "Uz.Title": "",
      "Uz.Subtitle": "",
      "Uz.Content": "",
      "Uz.MetaTitle": "",
      "Uz.MetaDescription": "",
      "Uz.MetaKeywords": "",
      "Ru.Title": "",
      "Ru.Subtitle": "",
      "Ru.Content": "",
      "Ru.MetaTitle": "",
      "Ru.MetaDescription": "",
      "Ru.MetaKeywords": "",
    };

    if (Array.isArray(rawBlogData) && rawBlogData.length > 0) {
      // Common fields from first item
      data.id = rawBlogData[0].id || blogId;
      data.Published = rawBlogData[0].published || false;
      data.ImageUrls = (rawBlogData[0].media || []).filter(m => m.mediaType === "Image").map(m => m.url) || [];
      data.VideoUrls = (rawBlogData[0].media || []).filter(m => m.mediaType === "Video").map(m => m.url) || [];
    }

    // Language-specific fields
    rawBlogData.forEach(blog => {
      if (blog.language) {
        const lang = blog.language.toLowerCase();
        const prefix = lang.charAt(0).toUpperCase() + lang.slice(1); // e.g., "en" -> "En", "uz" -> "Uz", "ru" -> "Ru"
        data[`${prefix}.Title`] = blog.title || "";
        data[`${prefix}.Subtitle`] = blog.subtitle || "";
        data[`${prefix}.Content`] = blog.content || "";
        data[`${prefix}.MetaTitle`] = blog.metaTitle || "";
        data[`${prefix}.MetaDescription`] = blog.metaDescription || "";
        data[`${prefix}.MetaKeywords`] = blog.metaKeywords || "";
      }
    });

    return data;
  })() : null;

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

      await updateMutation.mutateAsync(apiData);
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
  };

  if (!processedBlogData) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h3 className="text-lg font-semibold">Blog ma'lumotlari yuklanmadi</h3>
              <p className="text-muted-foreground">
                Blog ma'lumotlarini yuklashda muammo yuz berdi.
              </p>
              <button
                onClick={() => router.push("/dashboard/blog")}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Bloglar ro'yxatiga qaytish
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <BlogForm
        initialData={processedBlogData}
        isEdit={true}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={updateMutation.isPending || deleteMutation.isPending}
      />
    </div>
  );
}