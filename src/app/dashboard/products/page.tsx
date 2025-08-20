"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, SquarePen, TrashIcon, ChevronDown, ChevronRight, Eye } from "lucide-react";
import { getAllProducts, deleteProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
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
import { formatPrice } from "@/lib/formatPrice";
import { getLanguageFlag } from "@/lib/getLanguageFlag";

interface GroupedProduct {
  id: string;
  languages: Product[];
  price: number;
  imageUrls: string[];
  viewCount: number;
  buyClickCount: number;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const groupedProducts: GroupedProduct[] = products.reduce((acc: GroupedProduct[], productGroup: Product[]) => {
    if (Array.isArray(productGroup) && productGroup.length > 0) {
      const firstProduct = productGroup[0];
      acc.push({
        id: firstProduct.id!,
        languages: productGroup,
        price: firstProduct.price!,
        imageUrls: firstProduct.imageUrls,
        viewCount: firstProduct.viewCount,
        buyClickCount: firstProduct.buyClickCount,
      });
    }
    return acc;
  }, []);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Mahsulot muvaffaqiyatli o'chirildi", {
        position: "top-center",
        autoClose: 1500,
      });
    },
  });

  const toggleRow = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
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

  if (isLoading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {(error as Error).message}</div>;

  if (!groupedProducts.length) return <div>Mahsulotlar mavjud emas</div>;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Mahsulotlar</CardTitle>
        <Link href="/dashboard/products/create">
          <Button variant="outline" className="cursor-pointer">
            <PlusIcon className="w-4 h-4 mr-2" /> Yangi mahsulot qo'shish
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[200px]">Mahsulot ma'lumotlari</TableHead>
              <TableHead className="w-[150px]">Mavjud tillar</TableHead>
              <TableHead className="w-[120px]">Mahsulot narxi</TableHead>
              <TableHead className="w-[120px]">Ko'rishlar soni</TableHead>
              <TableHead className="w-[120px]">Rasm</TableHead>
              <TableHead className="w-[120px]">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedProducts.map((groupedProduct) => {
              const mainProduct = groupedProduct.languages.find(p => p.language === "en") || groupedProduct.languages[0];
              const isExpanded = expandedRows.has(groupedProduct.id);

              return (
                <React.Fragment key={groupedProduct.id}>
                  {/* Main Row */}
                  <TableRow key={groupedProduct.id} className="border-b">
                    <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleRow(groupedProduct.id)}
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
                          {mainProduct.name || "Noma'lum"}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[180px]">
                          {mainProduct.metaTitle || "Noma'lum"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[250px]">
                      <div className="flex flex-wrap gap-4">
                        {groupedProduct.languages.map((product) => (
                          <Badge key={product.language} variant="secondary" className="text-sm">
                            <Image
                              src={getLanguageFlag(product.language)}
                              alt={product.language}
                              width={20} height={20}
                              className="inline-block mr-1"
                            />
                            {product.language.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {groupedProduct.price ? formatPrice(groupedProduct.price) + " so'm" : "Noma'lum"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{groupedProduct.viewCount || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {groupedProduct.imageUrls && groupedProduct.imageUrls[0] ? (
                        <Image
                          src={groupedProduct.imageUrls[0]}
                          alt={mainProduct.name || "Product image"}
                          width={50}
                          height={50}
                          className="object-contain rounded border w-[100px] h-[100px] max-w-[100px] max-h-[100px] cursor-pointer"
                        />
                      ) : (
                        <Image
                          src="/no-image.webp"
                          alt={"No image"}
                          width={50}
                          height={50}
                          className="object-contain rounded border w-[100px] h-[100px] max-w-full max-h-full cursor-pointer"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/products/${groupedProduct.id}/edit`}>
                          <Button size="sm" variant="outline" className="cursor-pointer">
                            <SquarePen className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => deleteMutation.mutate(groupedProduct.id)}
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
                      <TableCell colSpan={7} className="p-0">
                        <div className="bg-gray-50 border-t">
                          {groupedProduct.languages.map((product, index) => (
                            <div key={`${product.id}-${product.language}`}
                              className={`p-4 ${index !== groupedProduct.languages.length - 1 ? "border-b border-gray-200" : ""}`}>
                              <div className="flex items-start gap-4">
                                <Badge variant="outline" className="mt-1">
                                  {/* {getLanguageFlag(product.language)} */}
                                  <Image
                                    src={getLanguageFlag(product.language)}
                                    alt={product.language}
                                    width={20} height={20}
                                    className="inline-block mr-1"
                                  />
                                  {product.language.toUpperCase()}
                                </Badge>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Nomi:</div>
                                    <div className="text-gray-600">{product.name}</div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Slug:</div>
                                    <div className="text-gray-600 break-all">{product.slug}</div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Meta Title:</div>
                                    <div className="text-gray-600">{product.metaTitle}</div>
                                  </div>
                                  <div className="md:col-span-2">
                                    <div className="font-medium text-gray-700 mb-1">Meta Description:</div>
                                    <div className="text-gray-600 text-sm">{product.metaDescription}</div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Keywords:</div>
                                    <div className="text-gray-600 text-sm break-all">{product.metaKeywords}</div>
                                  </div>
                                  <div className="md:col-span-3">
                                    <div className="font-medium text-gray-700 mb-1">Tavsif:</div>
                                    <div className="text-gray-600 text-sm">{product.description}</div>
                                  </div>
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