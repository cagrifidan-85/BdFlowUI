export declare type DialogBoxLayoutType = 'Error' | 'Information' | 'Confirmation' | 'Warning' | 'Success';

export enum FilterTypes {
    Sensors = 'Sensors',
    ConnectionType = 'Connection Type',
    Properties = 'Properties',
    Others = 'Others',
    Electronics = 'Electronics'
}
export interface ProductType {
  name: string;
  type: string;
  image: string;
  measurementRange: string;
  description: string;
  price: number;
  bestSeller?: boolean;
}