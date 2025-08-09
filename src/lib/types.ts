export interface Product {
  id: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface Blog {
  id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface VisitorsData {
  date: string;
  count: number;
}