

export declare type DialogBoxLayoutType = 'Error' | 'Information' | 'Confirmation' | 'Warning' | 'Success';
export enum MaterialType { Level = 'Level', Limit = 'Limit', Pressure = 'Pressure', SeparatorLayer = 'SeparatorLayer', Intensity = 'Intensity', MassFlow = 'MassFlow' }

export enum EnvironmentType { Gas = 'Gas', Liquid = 'Liquid' };

export enum FilterTypes {
  Sensors = 'Sensors',
  ConnectionType = 'Connection Type',
  Properties = 'Properties',
  Others = 'Others',
  Electronics = 'Electronics',
 
}



export interface ProductType {
  name: string;
  type: string;
  image: string;
  measurementRange: string;
  description: string;
  price: number;
  bestSeller?: boolean;
  catalogUrl?: string;
  material?: MaterialType;
  environment?: EnvironmentType;
}