export enum ProductType {
  SHIRT = 'Shirt',
  TIE = 'Tie',
  KEYCHAIN = 'Keychain'
}

export interface DraggableItem {
  id: string;
  type: 'sticker' | 'text';
  content: string; // Emoji or Text string
  x: number;
  y: number;
  scale: number;
}

export interface UserSession {
  username: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export interface CartItem {
  id: string;
  product: ProductType;
  baseColor: string;
  items: DraggableItem[];
  price: number;
  timestamp: number;
}

export interface DesignState {
  product: ProductType;
  baseColor: string;
  items: DraggableItem[];
}

export interface CheckoutDetails {
  address: string;
  phoneNumber: string;
  notes: string;
}