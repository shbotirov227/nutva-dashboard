/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormType } from "@/lib/types";
import Image from "next/image";

const LANGS = ["uz", "ru", "en"] as const;

// export type ProductFormValues = {
//   price: string;
//   imageUrls: File[];

//   Uz: {
//     Name: string;
//     Description: string;
//     MetaTitle: string;
//     MetaDescription: string;
//     MetaKeywords: string;
//     Slug: string;
//   },
//   Ru: {
//     Name: string;
//     Description: string;
//     MetaTitle: string;
//     MetaDescription: string;
//     MetaKeywords: string;
//     Slug: string;
//   },
//   En: {
//     Name: string;
//     Description: string;
//     MetaTitle: string;
//     MetaDescription: string;
//     MetaKeywords: string;
//     Slug: string;
//   },
//   // nameUz: string;
//   // nameRu: string;
//   // nameEn: string;
//   // descriptionUz: string;
//   // descriptionRu: string;
//   // descriptionEn: string;
//   // metaTitleUz: string;
//   // metaDescriptionUz: string;
//   // metaKeywordsUz: string;
//   // metaTitleRu: string;
//   // metaDescriptionRu: string;
//   // metaKeywordsRu: string;
//   // metaTitleEn: string;
//   // metaDescriptionEn: string;
//   // metaKeywordsEn: string;
//   // slugUz: string;
//   // slugRu: string;
//   // slugEn: string;
// };

// type ProductFormInitialData = {
//   description: string;
//   id: string;
//   imageUrls: string[];
//   metaDescription: string;
//   metaKeywords: string;
//   metaTitle: string;
//   name: string;
//   price: number;
//   slug: string;
// }

interface ProductFormProps {
  initialData?: ProductFormType;
  onSubmit: (values: ProductFormType) => void;
  loading?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  loading,
}: ProductFormProps) {
  const emptyForm: ProductFormType = {
    Price: null,
    ImageUrls: [],

    Uz: {
      Name: "",
      Description: "",
      MetaTitle: "",
      MetaDescription: "",
      MetaKeywords: "",
      Slug: "",
    },
    Ru: {
      Name: "",
      Description: "",
      MetaTitle: "",
      MetaDescription: "",
      MetaKeywords: "",
      Slug: "",
    },
    En: {
      Name: "",
      Description: "",
      MetaTitle: "",
      MetaDescription: "",
      MetaKeywords: "",
      Slug: "",
    }
    // nameUz: "",
    // nameRu: "",
    // nameEn: "",
    // descriptionUz: "",
    // descriptionRu: "",
    // descriptionEn: "",
    // metaTitleUz: "",
    // metaDescriptionUz: "",
    // metaKeywordsUz: "",
    // metaTitleRu: "",
    // metaDescriptionRu: "",
    // metaKeywordsRu: "",
    // metaTitleEn: "",
    // metaDescriptionEn: "",
    // metaKeywordsEn: "",
    // slugUz: "",
    // slugRu: "",
    // slugEn: "",
  };

  const [form, setForm] = useState<ProductFormType>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        Uz: { ...emptyForm.Uz, ...initialData.Uz },
        Ru: { ...emptyForm.Ru, ...initialData.Ru },
        En: { ...emptyForm.En, ...initialData.En },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);


  const handleChange = (field: keyof ProductFormType, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLangChange = (
    lang: "Uz" | "Ru" | "En",
    field: keyof ProductFormType["Uz"],
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Mahsulot formasi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Narx</label>
            <Input
              type="number"
              placeholder="Narx"
              value={initialData?.Price || form.Price!}
              onChange={(e) => handleChange("Price", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Rasm fayllari (bir nechta tanlash mumkin)
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              // value={initialData?.ImageUrls || form.ImageUrls}
              onChange={(e) =>
                handleChange("ImageUrls", e.target.files ? Array.from(e.target.files) : [])
              }
            />

            {initialData?.ImageUrls && initialData?.ImageUrls?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {initialData?.ImageUrls.map((url, i) => (
                  <Image
                    key={i}
                    src={url}
                    alt={`Image ${i + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {LANGS.map((lang) => {
            // const cap = lang.charAt(0).toUpperCase() + lang.slice(1);
            const cap = lang.charAt(0).toUpperCase() + lang.slice(1) as "Uz" | "Ru" | "En";
            return (
              <div key={lang} className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold uppercase">{lang} ma'lumotlari</h3>
                <Input
                  placeholder="Mahsulot nomi"
                  value={form[cap as "Uz" | "Ru" | "En"].Name}
                  onChange={(e) =>
                    handleLangChange(cap as "Uz" | "Ru" | "En", "Name", e.target.value)
                  }
                  required
                />
                <Textarea
                  placeholder="Mahsulot haqida"
                  value={form[cap].Description}
                  onChange={(e) =>
                    handleLangChange(cap, "Description", e.target.value)
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Slug"
                  value={form[cap].Slug}
                  onChange={(e) =>
                    handleLangChange(cap, "Slug", e.target.value)
                  }
                  required
                />
                <Input
                  placeholder="Meta sarlavha"
                  value={form[cap].MetaTitle}
                  onChange={(e) =>
                    handleLangChange(cap, "MetaTitle", e.target.value)
                  }
                />
                <Textarea
                  placeholder="Meta tasnif"
                  value={form[cap].MetaDescription}
                  onChange={(e) =>
                    handleLangChange(cap, "MetaDescription", e.target.value)
                  }
                />
                <Input
                  placeholder="Meta kalit so'zlar"
                  value={form[cap].MetaKeywords}
                  onChange={(e) =>
                    handleLangChange(cap, "MetaKeywords", e.target.value)
                  }
                />
              </div>
            );
          })}

          <Button type="submit" disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Saqlash"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
