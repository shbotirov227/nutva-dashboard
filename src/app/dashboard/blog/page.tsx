"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusIcon,
  SquarePen,
  TrashIcon,
  Eye,
  Calendar,
  Globe,
  ImageIcon,
  Video,
  MoreVertical,
  Search,
  Filter
} from "lucide-react";
import { getAllBlogs, deleteBlog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { useState } from "react";
import { formatDate } from "@/lib/formatDate";

export default function BlogPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rawData = [], isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog muvaffaqiyatli o'chirildi", {
        position: "top-center",
        autoClose: 1500,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Bloglar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="text-lg font-semibold">Xatolik yuz berdi</p>
            <p className="text-sm text-muted-foreground mt-2">
              {(error as Error).message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Data processing
  const allBlogs = rawData.flat();
  const groupedBlogs = Object.values(
    allBlogs.reduce((acc, blog) => {
      if (!acc[blog.id]) {
        acc[blog.id] = {
          id: blog.id,
          media: blog.media || [],
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          published: blog.published,
        };
      }
      if (blog.language?.toLowerCase() === "uz") acc[blog.id].uz = blog;
      if (blog.language?.toLowerCase() === "en") acc[blog.id].en = blog;
      if (blog.language?.toLowerCase() === "ru") acc[blog.id].ru = blog;
      return acc;
    }, {})
  );

  // Filter blogs based on search
  const filteredBlogs = groupedBlogs.filter((blog) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      blog.uz?.title?.toLowerCase().includes(searchLower) ||
      blog.en?.title?.toLowerCase().includes(searchLower) ||
      blog.ru?.title?.toLowerCase().includes(searchLower) ||
      blog.id.toLowerCase().includes(searchLower)
    );
  });

  const splitMedia = (media: any) => {
    const images = media?.filter((item: any) => item.mediaType === "Image") || [];
    const videos = media?.filter((item: any) => item.mediaType === "Video") || [];
    return { images, videos };
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('uz-UZ', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric'
  //   });
  // };

  if (!groupedBlogs.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bloglar</h1>
            <p className="text-muted-foreground mt-2">
              Barcha bloglaringizni boshqaring
            </p>
          </div>
          <Link href="/dashboard/blog/create">
            <Button className="gap-2 cursor-pointer">
              <PlusIcon className="h-4 w-4" />
              Yangi blog
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        <Card className="text-center py-16">
          <CardContent>
            <div className="mx-auto max-w-sm">
              <div className="rounded-full bg-muted p-6 w-fit mx-auto mb-6">
                <Globe className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hech qanday blog mavjud emas</h3>
              <p className="text-muted-foreground mb-6">
                Birinchi bloginggizni yarating va kontent boshqaruvini boshlang
              </p>
              <Link href="/dashboard/blog/create">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Birinchi blogni yaratish
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bloglar</h1>
          <p className="text-muted-foreground mt-2">
            {groupedBlogs.length} ta blog mavjud
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Bloglarni qidirish..."
              className="pl-9 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/dashboard/blog/create">
            <Button className="gap-2 cursor-pointer">
              <PlusIcon className="h-4 w-4" />
              Yangi blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredBlogs.map((blog: any) => {
          const { images, videos } = splitMedia(blog.media);
          const primaryImage = images[0];
          const viewCount = blog.uz?.viewCount || blog.en?.viewCount || blog.ru?.viewCount || 0;

          return (
            <Card key={blog.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.altText || "Blog image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Rasm mavjud emas</p>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant={blog.published ? "default" : "secondary"} className="bg-white/90 dark:bg-black/50 dark:text-white text-black">
                    {blog.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                {/* Media Count */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {images.length > 0 && (
                    <Badge variant="outline" className="bg-white/90 dark:bg-black/50 text-xs">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {images.length}
                    </Badge>
                  )}
                  {videos.length > 0 && (
                    <Badge variant="outline" className="bg-white/90 dark:bg-black/50 text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      {videos.length}
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6 flex flex-col flex-grow">
                {/* Languages */}
                <div className="flex gap-2 mb-4">
                  {["uz", "en", "ru"].map((lang) => (
                    <Badge
                      key={lang}
                      variant={blog[lang] ? "default" : "outline"}
                      className={`text-xs ${blog[lang] ? '' : 'opacity-50'}`}
                    >
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>

                {/* Title and Subtitle */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">
                    {blog.uz?.title || blog.en?.title || blog.ru?.title || "Sarlavha mavjud emas"}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {blog.uz?.subtitle || blog.en?.subtitle || blog.ru?.subtitle || "Tagline mavjud emas"}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  {viewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      <span>{viewCount} ko'rishlar</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      ID: {blog.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t flex items-center justify-between">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/blog/${blog.id}/edit`}>
                      <Button size="sm" variant="outline" className="gap-2 cursor-pointer">
                        <SquarePen className="h-3 w-3" />
                        Tahrirlash
                      </Button>
                    </Link>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="gap-2 cursor-pointer">
                        <TrashIcon className="h-3 w-3" />
                        O'chirish
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Blogni o'chirishni tasdiqlaysizmi?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu amal ortga qaytarib bo'lmaydi. Blog butunlay o'chiriladi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(blog.id)}
                          disabled={deleteMutation.isPending}
                          className="bg-destructive text-white cursor-pointer hover:bg-destructive/90"
                        >
                          {deleteMutation.isPending ? "O'chirilmoqda..." : "O'chirish"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Search Results */}
      {searchTerm && filteredBlogs.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hech narsa topilmadi</h3>
            <p className="text-muted-foreground">
              "{searchTerm}" bo'yicha qidiruv natijasi yo'q
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}