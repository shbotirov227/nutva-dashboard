"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, SquarePen, TrashIcon, ChevronDown, ChevronRight, Eye, ExternalLink } from "lucide-react";
import { getAllBanners, deleteBanner } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { getLanguageFlag } from "@/lib/getLanguageFlag";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  link: string;
  imageUrls: string[];
  language: string;
}

interface GroupedBanner {
  id: string;
  languages: BannerItem[];
  link: string;
  imageUrls: string[];
}

export default function BannerListPage() {
  const queryClient = useQueryClient();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: banners = [], isLoading, error } = useQuery({
    queryKey: ["banners"],
    queryFn: getAllBanners,
  });

  const groupedBanners: GroupedBanner[] = banners.reduce((acc: GroupedBanner[], bannerGroup: BannerItem[]) => {
    if (Array.isArray(bannerGroup) && bannerGroup.length > 0) {
      const firstBanner = bannerGroup[0];
      acc.push({
        id: firstBanner.id!,
        languages: bannerGroup,
        link: firstBanner.link!,
        imageUrls: firstBanner.imageUrls || [],
      });
    }
    return acc;
  }, []);

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast.success("Banner muvaffaqiyatli o'chirildi", {
        position: "top-center",
        autoClose: 1500,
      });
    },
    onError: (error) => {
      console.error("Banner delete error:", error);
      toast.error(`Xatolik: ${(error as Error).message}`, {
        position: "top-center",
        autoClose: 1500,
      });
    },
  });

  const toggleRow = (bannerId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(bannerId)) {
      newExpanded.delete(bannerId);
    } else {
      newExpanded.add(bannerId);
    }
    setExpandedRows(newExpanded);
  };

  // const getLanguageFlag = (lang: string) => {
  //   const flags: { [key: string]: string } = {
  //     "en": "/flag-en.svg",
  //     "uz": "/flag-uz.svg",
  //     "ru": "/flag-ru.svg"
  //   };
  //   return flags[lang] || "🏳️";
  // };

  const handleDelete = (id: string) => deleteMutation.mutate(id);

  if (isLoading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {(error as Error).message}</div>;

  if (!groupedBanners.length) return <div>Bannerlar mavjud emas</div>;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Bannerlar</CardTitle>
        <Link href="/dashboard/banner/create">
          <Button variant="outline" className="cursor-pointer">
            <PlusIcon className="w-4 h-4 mr-2" /> Yangi banner qo'shish
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[200px]">Banner ma'lumotlari</TableHead>
              <TableHead className="w-[150px]">Mavjud tillar</TableHead>
              <TableHead className="w-[200px]">Link</TableHead>
              <TableHead className="w-[120px]">Rasm</TableHead>
              <TableHead className="w-[120px]">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedBanners.map((groupedBanner) => {
              const mainBanner = groupedBanner.languages.find(b => b.language === "uz") || groupedBanner.languages[0];
              const isExpanded = expandedRows.has(groupedBanner.id);

              return (
                <React.Fragment key={groupedBanner.id}>
                  {/* Main Row */}
                  <TableRow key={groupedBanner.id} className="border-b">
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleRow(groupedBanner.id)}
                        className="p-0 h-8 w-8 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {mainBanner.title || "Noma'lum"}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[180px]">
                          {mainBanner.subtitle || "Noma'lum"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[250px]">
                      <div className="flex flex-wrap gap-2">
                        {groupedBanner.languages.map((banner) => (
                          <Badge key={banner.language} variant="secondary" className="text-sm">
                            <Image
                              src={getLanguageFlag(banner.language)}
                              alt={banner.language}
                              width={20}
                              height={20}
                              className="inline-block mr-1"
                            />
                            {banner.language.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <a
                          href={groupedBanner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-[150px]"
                        >
                          {groupedBanner.link || "Noma'lum"}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {groupedBanner.imageUrls && groupedBanner.imageUrls[0] ? (
                        <div className="relative">
                          <Image
                            src={groupedBanner.imageUrls[0]}
                            alt={mainBanner.title || "Banner image"}
                            width={100}
                            height={60}
                            className="object-cover rounded border cursor-pointer"
                          />
                          {groupedBanner.imageUrls.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              +{groupedBanner.imageUrls.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Image
                          src="/no-image.webp"
                          alt={"No image"}
                          width={100}
                          height={60}
                          className="object-cover rounded border cursor-pointer"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/banner/${groupedBanner.id}/edit`}>
                          <Button size="sm" variant="outline" className="cursor-pointer">
                            <SquarePen className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => handleDelete(groupedBanner.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="bg-gray-50 dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700">
                          {groupedBanner.languages.map((banner, index) => (
                            <div key={`${banner.id}-${banner.language}`}
                              className={`p-4 ${index !== groupedBanner.languages.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}`}>
                              <div className="flex items-start gap-4">
                                <Badge variant="outline" className="mt-1">
                                  <Image
                                    src={getLanguageFlag(banner.language)}
                                    alt={banner.language}
                                    width={20}
                                    height={20}
                                    className="inline-block mr-1"
                                  />
                                  {banner.language.toUpperCase()}
                                </Badge>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Sarlavha:</div>
                                    <div className="text-gray-600 dark:text-gray-300">{banner.title}</div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Tavsif:</div>
                                    <div className="text-gray-600 dark:text-gray-300">{banner.subtitle}</div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Meta Title:</div>
                                    <div className="text-gray-600 dark:text-gray-300">{banner.metaTitle}</div>
                                  </div>
                                  <div className="md:col-span-2">
                                    <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Meta Description:</div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm">{banner.metaDescription}</div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Keywords:</div>
                                    <div className="text-gray-600 text-sm break-all">{banner.metaKeywords}</div>
                                  </div>
                                  <div className="md:col-span-3">
                                    <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Link:</div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                                      <a
                                        href={banner.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 break-all"
                                      >
                                        {banner.link}
                                      </a>
                                    </div>
                                  </div>
                                  {banner.imageUrls && banner.imageUrls.length > 0 && (
                                    <div className="md:col-span-3">
                                      <div className="font-medium text-gray-700 dark:text-gray-200 mb-2">Rasmlar:</div>
                                      <div className="flex gap-2 flex-wrap">
                                        {banner.imageUrls.map((url: string, imgIndex: number) => (
                                          <Image
                                            key={imgIndex}
                                            src={url}
                                            alt={`Banner image ${imgIndex + 1}`}
                                            width={80}
                                            height={50}
                                            className="object-cover rounded border"
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}