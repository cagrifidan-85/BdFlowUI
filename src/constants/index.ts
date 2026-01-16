
export declare type DialogBoxLayoutType = 'Error' | 'Information' | 'Confirmation' | 'Warning' | 'Success';
export enum MaterialType { Level = 'Level', Limit = 'Limit', Pressure = 'Pressure', SeparatorLayer = 'SeparatorLayer', Intensity = 'Intensity', MassFlow = 'MassFlow' }

export enum EnvironmentType { Gas = 'Gas', Liquid = 'Liquid' };

export enum FilterTypes {
  Sensors = 'Sensors',
  ConnectionType = 'Connection Type',
  Properties = 'Properties',
  Categories = 'Categories',
  Electronics = 'Electronics',
  Materials = 'Materials',
  Environments = 'Environments',
}


export interface FiterBaseModel {
  code: string;
  en: string;
  tr: string;
}
export interface ProductFiltersModel {
  sensors?: FiterBaseModel[];
  connectionTypes?: FiterBaseModel[];
  properties?: FiterBaseModel[];
  categories?: FiterBaseModel[];
  electronics?: FiterBaseModel[];
  materials?: FiterBaseModel[];
  environments?: FiterBaseModel[];
}

export enum CategoriesType  {
  LevelSensors = 'Level Sensors' ,
  PressureSensors = 'Pressure Sensors' ,
  FlowSensors = 'Flow Sensors' ,
  MicrowaveLevelSensors = 'Microwave Level Sensors',
  RadarLevelSensors = 'Radar Level Sensors'
}

export enum PropertyTypes {
  Waterproof = 'Waterproof',
  ExplosionProof = 'Explosion Proof',
  HighTemperature = 'High Temperature',
  LowTemperature = 'Low Temperature',
  Wireless = 'Wireless',
  CompactDesign = 'Compact Design',
  HighAccuracy = 'High Accuracy',
}

export enum ConnectionTypes {
  Wired = 'Wired',
  Wireless = 'Wireless',
  Bluetooth = 'Bluetooth',
  WiFi = 'WiFi',
}

export enum SensorTypes {
  Ultrasonic = 'Ultrasonic',
  Radar = 'Radar',
  Capacitive = 'Capacitive',
  Optical = 'Optical',
  Thermal = 'Thermal',
}

export enum ElectronicsTypes {
  Analog = 'Analog',
  Digital = 'Digital',
  Smart = 'Smart',
}

export interface ProductType {
  id: string;
  productNo: string;
  name: string;
  image: string;
  measurementRange: string;
  description: string;
  price: { amount: number; currency: string };
  bestSeller?: boolean;
  catalogUrl?: string;
  material?: MaterialType;
  environment?: EnvironmentType;
  stock?: number;
  sensor?: SensorTypes;
  connectionType?: ConnectionTypes;
  properties?: PropertyTypes;
  electronics?: ElectronicsTypes;
  category?: CategoriesType;
}