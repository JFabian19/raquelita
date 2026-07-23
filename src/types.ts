export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Dish {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  labels: string[];
  available: boolean;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface BrandingConfig {
  restaurantName: string;
  slogan: string;
  logoUrl: string;
  coverImage: string;
  socials: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    tiktok?: string;
  };
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardBgColor: string;
  textColor: string;
  textMutedColor: string;
  borderRadius: string;
  fontFamily: string;
}

export interface StoreConfig {
  whatsappNumber: string;
  currency: string;
  enableCart: boolean;
  tax: number;
  deliveryCost: number;
}

export interface DataSourceConfig {
  type: "local" | "sheets";
  sheetsUrl: string;
}

export interface MenuConfig {
  branding: BrandingConfig;
  theme: ThemeConfig;
  store: StoreConfig;
  dataSource: DataSourceConfig;
}
