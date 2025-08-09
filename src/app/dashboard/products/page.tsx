/* eslint-disable react/no-unescaped-entities */
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { fetchProducts, deleteProduct } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  if (isLoading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xatolik: {(error as Error).message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mahsulotlar</CardTitle>
        <Link href="/dashboard/products/create">
          <Button>Yangi mahsulot</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                  <Link href={`/dashboard/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">Tahrirlash</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(product.id)}
                  >
                    O'chirish
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}