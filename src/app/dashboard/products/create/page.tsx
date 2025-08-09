/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/dashboard/products");
    },
    onError: (error) => {
      alert(`Xatolik: ${(error as Error).message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Yangi mahsulot qo'shish</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Mahsulot nomi
            </label>
            <Input
              id="name"
              placeholder="Mahsulot nomi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium">
              Meta sarlavha
            </label>
            <Input
              id="metaTitle"
              placeholder="Meta sarlavha"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium">
              Meta tasnif
            </label>
            <Textarea
              id="metaDescription"
              placeholder="Meta tasnif"
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="metaKeywords" className="block text-sm font-medium">
              Meta kalit so'zlar
            </label>
            <Input
              id="metaKeywords"
              placeholder="Meta kalit so'zlar"
              value={form.metaKeywords}
              onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Yuklanmoqda..." : "Yaratish"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}