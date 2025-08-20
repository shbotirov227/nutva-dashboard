"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { LANGS, BannerFormType, BannerLang } from "@/lib/types";
import ImageUpload from "@/components/ImageUpload";

interface BannerFormProps {
  initialData?: any[];
  onSubmit: (values: BannerFormType, imageFiles: File[]) => void;
  loading?: boolean;
  defaultLang?: LANGS;
}

const emptyLang: BannerLang = {
  Title: "",
  Subtitle: "",
  MetaTitle: "",
  MetaDescription: "",
  MetaKeywords: "",
};

const emptyForm: BannerFormType = {
  Link: "",
  ImageUrls: [],
  [LANGS.Uz]: { ...emptyLang },
  [LANGS.Ru]: { ...emptyLang },
  [LANGS.En]: { ...emptyLang },
};

export default function BannerForm({
  initialData,
  onSubmit,
  loading,
  defaultLang = LANGS.Uz,
}: BannerFormProps) {
  const [form, setForm] = useState<BannerFormType>(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (initialData && initialData.length) {
      const newForm: BannerFormType = { ...emptyForm };
      let imageUrls: string[] = [];
      let link = "";

      initialData.forEach(item => {
        const langMap: Record<string, keyof BannerFormType> = {
          uz: LANGS.Uz,
          ru: LANGS.Ru,
          en: LANGS.En,
        };

        const langKey = langMap[item.language.toLowerCase()];
        if (langKey) {
          newForm[langKey] = {
            Title: item.title || "",
            Subtitle: item.subtitle || "",
            MetaTitle: item.metaTitle || "",
            MetaDescription: item.metaDescription || "",
            MetaKeywords: item.metaKeywords || "",
          };

          if (item.link && !link) {
            link = item.link;
          }

          if (item.imageUrls && Array.isArray(item.imageUrls) && imageUrls.length === 0) {
            imageUrls = [...item.imageUrls];
          }
        }
      });

      newForm.Link = link;
      newForm.ImageUrls = imageUrls;
      setForm(newForm);

      console.log("Loaded banner form data:", newForm);
      console.log("Banner Image URLs:", imageUrls);
    }
  }, [initialData]);

  const handleChange = (field: keyof BannerFormType, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLangChange = (
    lang: keyof BannerFormType,
    field: keyof BannerLang,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [lang]: { ...(prev[lang] as BannerLang), [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, imageFiles);
  };

  const handleExistingImageRemove = (index: number) => {
    setForm(prev => ({
      ...prev,
      ImageUrls: (prev.ImageUrls as string[]).filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto animate-pulse">
        <CardHeader><Skeleton className="h-6 w-48 rounded" /></CardHeader>
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

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader><CardTitle>Banner formasi</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium mb-2">Link</Label>
            <Input
              type="url"
              placeholder="Banner linki"
              value={form.Link || ""}
              onChange={(e) => handleChange("Link", e.target.value)}
              required
            />
          </div>

          <ImageUpload
            label="Banner rasmlari"
            existingImages={form.ImageUrls as string[]}
            newImages={imageFiles}
            onImagesChange={setImageFiles}
            onExistingImageRemove={handleExistingImageRemove}
            maxSize={10}
            maxFiles={5}
            showTips={true}
          />

          {Object.values(LANGS).map((lang) => {
            const cap = lang as LANGS;
            const langData = form[cap] as BannerLang;
            if (!langData) return null;

            return (
              <div key={lang} className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold uppercase">{lang} ma'lumotlari</h3>
                <Input
                  placeholder="Banner sarlavhasi"
                  value={langData?.Title}
                  onChange={(e) => handleLangChange(cap, "Title", e.target.value)}
                  required={lang === defaultLang}
                />
                <Input
                  placeholder="Banner tavsifi"
                  value={langData?.Subtitle}
                  onChange={(e) => handleLangChange(cap, "Subtitle", e.target.value)}
                  required={lang === defaultLang}
                />
                <Input
                  placeholder="Meta sarlavha"
                  value={langData?.MetaTitle}
                  onChange={(e) => handleLangChange(cap, "MetaTitle", e.target.value)}
                />
                <Textarea
                  placeholder="Meta tasnif"
                  value={langData?.MetaDescription}
                  onChange={(e) => handleLangChange(cap, "MetaDescription", e.target.value)}
                />
                <Input
                  placeholder="Meta kalit so'zlar"
                  value={langData?.MetaKeywords}
                  onChange={(e) => handleLangChange(cap, "MetaKeywords", e.target.value)}
                />
              </div>
            );
          })}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4 cursor-pointer flex items-center justify-center"
          >
            {loading ? "Yuklanmoqda..." : "Saqlash"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}