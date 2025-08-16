/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, SquarePen, TrashIcon } from "lucide-react";
import { getProducts, deleteProduct } from "@/lib/api";
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
import { toast } from "react-toastify";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  console.log(products);

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

  if (isLoading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {(error as Error).message}</div>;

  if (!products.length) return <div>Mahsulotlar mavjud emas</div>;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Mahsulotlar</CardTitle>
        <Link href="/dashboard/products/create">
          <Button variant="outline" className="cursor-pointer">
            <PlusIcon /> Yangi mahsulot qo'shish
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Nomi</TableHead>
              <TableHead className="w-[120px]">Slug</TableHead>
              <TableHead className="w-[200px]">Meta Title</TableHead>
              <TableHead className="w-[250px]">Meta Description</TableHead>
              <TableHead className="w-[250px]">Meta Keywords</TableHead>
              <TableHead className="w-[100px]">Narx</TableHead>
              <TableHead className="w-[180px]">Rasm</TableHead>
              <TableHead className="w-[120px]">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: Product) => {
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-[120px] whitespace-normal break-words">
                    {product.name || "Noma'lum"}
                  </TableCell>
                  <TableCell className="max-w-[120px] whitespace-normal break-words">
                    {product.slug || "Noma'lum"}
                  </TableCell>
                  <TableCell className="max-w-[200px] whitespace-normal break-words">
                    {product.metaTitle || "Noma'lum"}
                  </TableCell>
                  <TableCell className="max-w-[250px] whitespace-normal break-words">
                    {product.metaDescription || "Noma'lum"}
                  </TableCell>
                  <TableCell className="max-w-[250px] whitespace-normal break-words">
                    {product.metaKeywords || "Noma'lum"}
                  </TableCell>
                  <TableCell className="max-w-[100px]">
                    {product.price !== null && product.price !== undefined ? formatPrice(product.price) : "Noma'lum"}
                  </TableCell>
                  <TableCell className="max-w-[180px]">
                    {product.imageUrls && product?.imageUrls?.[0] ? (
                      <Image
                        src={product.imageUrls[0]}
                        // alt={product.En?.Name || "Product image"}
                        alt={product?.en?.name || product?.name || "Product image"}

                        width={100}
                        height={100}
                        className="object-contain max-w-[100px] max-h-[100px]"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm italic">Rasm yo'q</div>
                    )}
                  </TableCell>
                  <TableCell className="w-[120px] align-middle">
                    <div className="flex justify-center gap-2">
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <Button size="sm" variant="outline" className="cursor-pointer">
                          <SquarePen />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => deleteMutation.mutate(product.id!)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}