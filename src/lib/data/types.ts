export type Language = "en" | "bn" | "hi";

export type ProductStatus = "pending" | "approved" | "rejected";
export type LabourStatus = "pending" | "approved" | "rejected";
export type OrderType = "product" | "labour";
export type OrderStatus = "pending" | "contacted" | "confirmed" | "completed";
export type Unit = "kg" | "grams" | "quintal";

export interface UserPreferences {
  language: Language;
  hasSelectedLanguage: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  mobile: string;
  bio: string;
  photoUrl?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface StoredUserRecord extends AppUser {
  passwordHash: string;
  passwordSalt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  name: string;
  imageUrl: string;
  price: number;
  quantityValue: number;
  unit: Unit;
  location: string;
  description?: string;
  status: ProductStatus;
  createdAt: string;
}

export interface Labourer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  pricePerDay: number;
  location: string;
  status: LabourStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  type: OrderType;
  targetId: string;
  title: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  sellerName: string;
  sellerPhone: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  title: string;
  type: OrderType;
  targetId: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  sellerName: string;
  lastMessage: string;
  lastMessageAt: string;
  messages: ChatMessage[];
}

export interface UiSettings {
  primaryColor: string;
  backgroundTone: string;
  surfaceTone: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface DemoSession {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
}

export interface DemoDatabase {
  users: StoredUserRecord[];
  products: Product[];
  labourers: Labourer[];
  orders: Order[];
  chats: ChatRoom[];
  admin: {
    uiSettings: UiSettings;
    sessions: DemoSession[];
  };
  sessions: DemoSession[];
}

export interface ProductInput {
  name: string;
  imageUrl: string;
  price: number;
  quantityValue: number;
  unit: Unit;
  location: string;
  description?: string;
}

export interface LabourInput {
  name: string;
  phone: string;
  pricePerDay: number;
  location: string;
}

export interface ProfileInput {
  name: string;
  bio: string;
  photoUrl?: string;
}

export interface AuthPayload {
  name?: string;
  mobile: string;
  password: string;
}

export interface BootstrapPayload {
  currentUser: AppUser | null;
  products: Product[];
  labourers: Labourer[];
  orders: Order[];
  chats: ChatRoom[];
  uiSettings: UiSettings;
  demoMode: boolean;
}
