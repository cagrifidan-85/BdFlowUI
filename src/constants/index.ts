
export declare type DialogBoxLayoutType = 'Error' | 'Information' | 'Confirmation' | 'Warning' | 'Success';

export interface FilterBaseModel {
  code: string;
  en: string;
  tr: string;
}
export interface ProductFiltersModel {
  sensors?: FilterBaseModel[];
  connectionTypes?: FilterBaseModel[];
  properties?: FilterBaseModel[];
  categories?: FilterBaseModel[];
  electronics?: FilterBaseModel[];
  materials?: FilterBaseModel[];
  environments?: FilterBaseModel[];
}

export type ProductFilterGroup =
  | 'sensors'
  | 'connectionTypes'
  | 'properties'
  | 'categories'
  | 'electronics'
  | 'materials'
  | 'environments';

export const PRODUCT_FILTER_GROUPS: ProductFilterGroup[] = [
  'categories',
  'materials',
  'environments',
  'sensors',
  'connectionTypes',
  'properties',
  'electronics',
];



export interface ProductType {
  id: string;
  productNo: string;
  name: string;
  nameEn?: string;
  image: string;
  measurementRange: string;
  description: string;
  descriptionEn?: string;
  price?: { amount: number; currency: string };
  bestSeller?: boolean;
  catalogUrl?: string;
  material?: string;
  environment?: string;
  stock?: number;
  sensor?: string;
  connectionType?: string;
  properties?: string;
  electronics?: string;
  category?: string;
}