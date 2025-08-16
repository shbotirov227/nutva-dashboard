/* eslint-disable @typescript-eslint/no-explicit-any */

export type LanguageFields = {
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;
};

export interface Product {
  id: string | undefined;
  price: number | null;
  imageUrls: string[];
  imageWidth?: number;
  imageHeight?: number;
  // en: LanguageFields;
  // uz: LanguageFields;
  // ru: LanguageFields;
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;
  [key: string]: any;
}

export type ProductFormType = {
  Uz: {
    Name: string;
    Description: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeywords: string;
    Slug: string;
  },
  Ru: {
    Name: string;
    Description: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeywords: string;
    Slug: string;
  },
  En: {
    Name: string;
    Description: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeywords: string;
    Slug: string;
  },
  // nameUz: string;
  // nameRu: string;
  // nameEn: string;
  // descriptionUz: string;
  // descriptionRu: string;
  // descriptionEn: string;
  Price: number | null;
  // slugUz: string;
  // slugRu: string;
  // slugEn: string;
  // metaTitleUz: string;
  // metaTitleRu: string;
  // metaTitleEn: string;
  // metaDescriptionUz: string;
  // metaDescriptionRu: string;
  // metaDescriptionEn: string;
  // metaKeywordsUz: string;
  // metaKeywordsRu: string;
  // metaKeywordsEn: string;
  ImageUrls: string[];
  token?: string
};

// export interface Blog {
//   id: string;
//   title: string;
//   metaTitle: string;
//   metaDescription: string;
//   metaKeywords: string;
// }

export interface LangFields {
  Title: string;
  Subtitle: string;
  Content: string;
  MetaTitle: string;
  MetaDescription: string;
  MetaKeywords: string;
}

export interface Blog {
  id?: string;
  En: LangFields;
  Uz: LangFields;
  Ru: LangFields;
  ImageFiles?: File[];
  VideoFiles?: File[];
  Published: boolean;
  ImageUrls?: string[];
  VideoUrls?: string[];
}

export interface VisitorsData {
  date: string;
  count: number;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  image?: string;
  token?: string;
  accessToken?: string;
}