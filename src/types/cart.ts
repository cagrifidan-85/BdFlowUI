import { ProductType } from '@constants/index';

export interface CartItem {
  product: ProductType;
  quantity: number;
  key: string;
  materialLabel?: string;
  environmentLabel?: string;
}

export interface SerializedCartItem {
  productId: string;
  productNo?: string;
  name: string;
  quantity: number;
  price?: {
    amount?: number;
    currency?: string;
  };
  materialLabel?: string;
  environmentLabel?: string;
}

export interface PriceRequestPayload {
  items: SerializedCartItem[];
  requesterName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  note?: string;
}

export interface PriceRequestFormValues {
  requesterName: string;
  companyName: string;
  email: string;
  phone: string;
  note: string;
}
