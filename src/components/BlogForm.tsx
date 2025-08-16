/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  ImageIcon,
  Video,
  Globe,
  FileText,
  Hash,
  Calendar,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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

export default function BlogForm({ 
  initialData = null, 
  isEdit = false,
  onSubmit,
  onDelete = null,
  isLoading = false 
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    Published: initialData?.Published || false,
    ImageFiles: [],
    VideoFiles: [],
    ImageUrls: initialData?.ImageUrls || [],
    VideoUrls: initialData?.VideoUrls || [],
    // English fields
    "En.Title": initialData?.["En.Title"] || "",
    "En.Subtitle": initialData?.["En.Subtitle"] || "",
    "En.Content": initialData?.["En.Content"] || "",
    "En.MetaTitle": initialData?.["En.MetaTitle"] || "",
    "En.MetaDescription": initialData?.["En.MetaDescription"] || "",
    "En.MetaKeywords": initialData?.["En.MetaKeywords"] || "",
    // Uzbek fields
    "Uz.Title": initialData?.["Uz.Title"] || "",
    "Uz.Subtitle": initialData?.["Uz.Subtitle"] || "",
    "Uz.Content": initialData?.["Uz.Content"] || "",
    "Uz.MetaTitle": initialData?.["Uz.MetaTitle"] || "",
    "Uz.MetaDescription": initialData?.["Uz.MetaDescription"] || "",
    "Uz.MetaKeywords": initialData?.["Uz.MetaKeywords"] || "",
    // Russian fields
    "Ru.Title": initialData?.["Ru.Title"] || "",
    "Ru.Subtitle": initialData?.["Ru.Subtitle"] || "",
    "Ru.Content": initialData?.["Ru.Content"] || "",
    "Ru.MetaTitle": initialData?.["Ru.MetaTitle"] || "",
    "Ru.MetaDescription": initialData?.["Ru.MetaDescription"] || "",
    "Ru.MetaKeywords": initialData?.["Ru.MetaKeywords"] || "",
  });

  const [activeTab, setActiveTab] = useState("Uz");
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle media upload
  const handleMediaUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));

    setFormData(prev => ({
      ...prev,
      ImageFiles: [...prev.ImageFiles, ...imageFiles],
      VideoFiles: [...prev.VideoFiles, ...videoFiles]
    }));
  }, []);

  // Remove media item
  const removeMedia = useCallback((index, type) => {
    const field = type === 'image' ? 'ImageFiles' : 'VideoFiles';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  const removeMediaUrl = useCallback((index, type) => {
    const field = type === 'image' ? 'ImageUrls' : 'VideoUrls';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredUzFields = ['Uz.Title', 'Uz.Subtitle', 'Uz.Content'];
    const hasUzContent = requiredUzFields.every(field => (formData[field] as keyof as typeof formData).trim());
    
    if (!hasUzContent) {
      toast.error("Kamida O'zbek tilida barcha majburiy maydonlarni to'ldiring");
      return;
    }

    try {
      await onSubmit(formData);
      toast.success(isEdit ? "Blog muvaffaqiyatli yangilandi" : "Blog muvaffaqiyatli yaratildi");
    } catch (error) {
      toast.error("Xatolik yuz berdi: " + error.message);
    }
  };

  // Language completion percentage
  const getCompletionPercentage = (lang) => {
    const fields = [`${lang}.Title`, `${lang}.Subtitle`, `${lang}.Content`];
    const completed = fields.filter(field => formData[field].trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  const languages = [
    { key: 'Uz', label: 'O\'zbekcha', flag: '🇺🇿' },
    { key: 'En', label: 'English', flag: '🇺🇸' },
    { key: 'Ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Blogni tahrirlash' : 'Yangi blog yaratish'}
            </h1>
            {isEdit && initialData?.id && (
              <p className="text-muted-foreground text-sm mt-1">
                ID: {initialData.id}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Tahrirlash' : 'Ko\'rish'}
          </Button>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="published" className="text-sm font-medium">
              Nashr qilish
            </Label>
            <Switch
              id="published"
              checked={formData.Published}
              onCheckedChange={(checked) => handleInputChange('Published', checked)}
            />
          </div>
        </div>
      </div>

      {showPreview ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Ko'rinish rejimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {languages.map(({ key, label, flag }) => (
                <Card key={key} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{flag}</span>
                    <h3 className="font-semibold">{label}</h3>
                    <Badge variant="outline" className="ml-auto">
                      {getCompletionPercentage(key)}%
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{formData[`${key}.Title` as keyof typeof formData] || 'Sarlavha mavjud emas'}</h4>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formData[`${key}.Subtitle` as keyof typeof formData] || 'Tagline mavjud emas'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {formData[`${key}.Content` as keyof typeof formData] || 'Kontent mavjud emas'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {(formData.ImageFiles.length > 0 || formData.VideoFiles.length > 0 || formData.ImageUrls.length > 0 || formData.VideoUrls.length > 0) && (
              <div>
                <h3 className="font-semibold mb-3">Media fayllar</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.ImageUrls.map((url: string, index: number) => (
                    <div key={`preview-img-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={url}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {formData.ImageFiles.map((file, index) => (
                    <div key={`preview-new-img-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`New image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {formData.VideoUrls.map((url: string, index: number) => (
                    <video
                      key={`preview-vid-${index}`}
                      src={url}
                      className="aspect-square object-cover rounded-lg"
                      controls
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Asosiy sozlamalar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Nashr holati</Label>
                  <p className="text-sm text-muted-foreground">
                    Blog {formData.Published ? 'nashr qilingan' : 'qoralama'} holatda
                  </p>
                </div>
                <Badge variant={formData.Published ? "default" : "secondary"}>
                  {formData.Published ? 'Published' : 'Draft'}
                </Badge>
              </div>

              {/* Media Upload */}
              <div>
                <Label className="text-base font-medium mb-3 block">Media fayllar</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Fayllarni yuklang</p>
                    <p className="text-sm text-muted-foreground text-center">
                      Rasm va video fayllarni bu yerga tashlang yoki tanlash uchun bosing
                    </p>
                  </label>
                </div>

                {/* Media Preview */}
                {(formData.ImageFiles.length > 0 || formData.VideoFiles.length > 0 || formData.ImageUrls.length > 0 || formData.VideoUrls.length > 0) && (
                  <div className="space-y-4 mt-4">
                    {formData.ImageFiles.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Yangi rasmlar</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.ImageFiles.map((file, index) => (
                            <div key={`new-image-${index}`} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={`New image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMedia(index, 'image')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.VideoFiles.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Yangi videolar</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.VideoFiles.map((file, index) => (
                            <div key={`new-video-${index}`} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                <Video className="h-8 w-8 text-muted-foreground" />
                                <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-1 rounded">
                                  {file.name}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMedia(index, 'video')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.ImageUrls.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Mavjud rasmlar</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.ImageUrls.map((url: string, index: number) => (
                            <div key={`existing-image-${index}`} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <Image
                                  src={url}
                                  alt={`Existing image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMediaUrl(index, 'image')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.VideoUrls.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Mavjud videolar</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.VideoUrls.map((url: string, index: number) => (
                            <div key={`existing-video-${index}`} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <video
                                  src={url}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMediaUrl(index, 'video')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Language Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Kontent (tillarga qarab)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  {languages.map(({ key, label, flag }) => (
                    <TabsTrigger key={key} value={key} className="gap-2">
                      <span>{flag}</span>
                      <span>{label}</span>
                      <Badge variant="outline" className="ml-2">
                        {getCompletionPercentage(key)}%
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {languages.map(({ key, label }) => (
                  <TabsContent key={key} value={key} className="space-y-4 mt-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`title-${key}`} className="text-base font-medium">
                          Sarlavha *
                        </Label>
                        <Input
                          id={`title-${key}`}
                          value={formData[`${key}.Title` as keyof typeof formData]}
                          onChange={(e) => handleInputChange(`${key}.Title`, e.target.value)}
                          placeholder={`Blog sarlavhasi (${label})`}
                          className="text-lg"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`subtitle-${key}`} className="text-base font-medium">
                          Tagline *
                        </Label>
                        <Input
                          id={`subtitle-${key}`}
                          value={formData[`${key}.Subtitle` as keyof typeof formData]}
                          onChange={(e) => handleInputChange(`${key}.Subtitle`, e.target.value)}
                          placeholder={`Qisqa tavsif (${label})`}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`content-${key}`} className="text-base font-medium">
                          Kontent *
                        </Label>
                        <Textarea
                          id={`content-${key}`}
                          value={formData[`${key}.Content` as keyof typeof formData]}
                          onChange={(e) => handleInputChange(`${key}.Content`, e.target.value)}
                          placeholder={`Blog kontenti (${label})`}
                          className="min-h-[200px] resize-y"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData[`${key}.Content` as keyof typeof formData].length} belgi
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* SEO Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <h4 className="font-medium">SEO sozlamalari</h4>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`metaTitle-${key}`}>Meta sarlavha</Label>
                          <Input
                            id={`metaTitle-${key}`}
                            value={formData[`${key}.MetaTitle` as keyof typeof formData]}
                            onChange={(e) => handleInputChange(`${key}.MetaTitle`, e.target.value)}
                            placeholder="SEO uchun sarlavha"
                            maxLength={60}
                          />
                          <p className="text-xs text-muted-foreground">
                            {formData[`${key}.MetaTitle` as keyof typeof formData].length}/60 belgi
                          </p>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`metaDescription-${key}`}>Meta tavsif</Label>
                          <Textarea
                            id={`metaDescription-${key}`}
                            value={formData[`${key}.MetaDescription` as keyof typeof formData]}
                            onChange={(e) => handleInputChange(`${key}.MetaDescription`, e.target.value)}
                            placeholder="SEO uchun qisqa tavsif"
                            rows={3}
                            maxLength={160}
                          />
                          <p className="text-xs text-muted-foreground">
                            {formData[`${key}.MetaDescription` as keyof typeof formData].length}/160 belgi
                          </p>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`metaKeywords-${key}`}>Kalit so'zlar</Label>
                          <Input
                            id={`metaKeywords-${key}`}
                            value={formData[`${key}.MetaKeywords` as keyof typeof formData]}
                            onChange={(e) => handleInputChange(`${key}.MetaKeywords`, e.target.value)}
                            placeholder="kalit so'z 1, kalit so'z 2, kalit so'z 3"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div>
              {isEdit && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button">
                      Blogni o'chirish
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
                      <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        O'chirish
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Bekor qilish
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="gap-2 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEdit ? 'Yangilash' : 'Saqlash'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}