"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Info, Check } from "lucide-react";

interface ImageUploadProps {
  label?: string;
  existingImages?: string[];
  newImages?: File[];
  onImagesChange?: (files: File[]) => void;
  onExistingImageRemove?: (index: number) => void;
  maxSize?: number;
  maxFiles?: number;
  acceptedFormats?: string[];
  showTips?: boolean;
  className?: string;
}

export default function ImageUpload({
  label = "Rasmlarni yuklash",
  existingImages = [],
  newImages = [],
  onImagesChange,
  onExistingImageRemove,
  maxSize = 10,
  maxFiles = 10,
  acceptedFormats = ["PNG", "JPG", "JPEG", "WEBP"],
  showTips = true,
  className = "",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= maxSize * 1024 * 1024;
      return isImage && isValidSize;
    });

    const remainingSlots = maxFiles - (existingImages.length + newImages.length);
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length > 0 && onImagesChange) {
      onImagesChange([...newImages, ...filesToAdd]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeNewImage = (index: number) => {
    if (onImagesChange) {
      const updatedFiles = newImages.filter((_, i) => i !== index);
      onImagesChange(updatedFiles);
    }
  };

  const totalImages = existingImages.length + newImages.length;
  const canAddMore = totalImages < maxFiles;

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {canAddMore && (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="image-upload"
          />
          <div
            className={`border-2 border-dashed transition-all duration-300 rounded-xl p-8 text-center ${isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:from-blue-50/50 hover:to-indigo-50/50'
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isDragging
                ? 'bg-blue-200 scale-110'
                : 'bg-blue-100 hover:bg-blue-200'
                }`}>
                {isDragging ? (
                  <Check className="w-8 h-8 text-blue-700" />
                ) : (
                  <Upload className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <p className={`text-lg font-medium transition-colors duration-300 ${isDragging ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                  {isDragging ? 'Rasmlarni qo\'ying!' : 'Rasmlarni yuklash'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {isDragging ? 'Bu yerga qo\'ying...' : 'Fayllarni bu yerga sudrab olib keling yoki'}
                </p>
                {!isDragging && (
                  <p className="text-sm font-medium text-blue-600 mt-2 underline">ko'rish uchun bosing</p>
                )}
              </div>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 dark:text-gray-900">
                <span className="flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  {acceptedFormats.join(', ')}
                </span>
                <span>•</span>
                <span>Maksimal {maxSize}MB</span>
                <span>•</span>
                <span>{maxFiles - totalImages} ta qoldi</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalImages > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Yuklangan rasmlar</h4>
            <div className="flex space-x-2 text-xs">
              {existingImages.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {existingImages.length} mavjud
                </span>
              )}
              {newImages.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {newImages.length} yangi
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="group relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-blue-300 transition-all duration-200">
                  <Image
                    src={url}
                    alt={`Mavjud rasm ${i + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      console.error(`Error loading image: ${url}`);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onExistingImageRemove?.(i)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 transform hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full shadow-lg">
                  Mavjud
                </div>
              </div>
            ))}

            {newImages.map((file, i) => (
              <div key={`new-${i}`} className="group relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-green-300 transition-all duration-200">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Yangi rasm ${i + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 transform hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full shadow-lg">
                  Yangi
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                  <p className="text-white text-xs truncate">{file.name}</p>
                  <p className="text-white/70 text-xs">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTips && totalImages === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Maslahatlar:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Yuqori sifatli rasmlar (HD yoki 4K) ishlatishni tavsiya qilamiz</li>
                <li>• Mahsulotni turli burchaklardan suratga oling</li>
                <li>• Birinchi rasm asosiy rasm sifatida ishlatiladi</li>
                <li>• Maksimal {maxFiles} ta rasm yuklash mumkin</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}