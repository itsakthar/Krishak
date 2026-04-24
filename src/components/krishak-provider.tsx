"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  AppUser,
  AuthPayload,
  BootstrapPayload,
  ChatRoom,
  LabourInput,
  Language,
  Order,
  Product,
  ProductInput,
  ProfileInput,
  UiSettings
} from "@/lib/data/types";
import { t } from "@/lib/i18n";

interface KrishakContextValue {
  loading: boolean;
  currentUser: AppUser | null;
  products: Product[];
  labourers: BootstrapPayload["labourers"];
  orders: Order[];
  chats: ChatRoom[];
  cartProductIds: string[];
  uiSettings: UiSettings;
  language: Language;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: AuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  changeLanguage: (language: Language) => Promise<void>;
  updateProfile: (payload: ProfileInput) => Promise<void>;
  submitProduct: (payload: ProductInput) => Promise<void>;
  submitLabour: (payload: LabourInput) => Promise<void>;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (type: "product" | "labour", targetId: string) => Promise<Order>;
  startChat: (type: "product" | "labour", targetId: string) => Promise<ChatRoom>;
  fetchChat: (chatId: string) => Promise<ChatRoom>;
  sendMessage: (chatId: string, text: string) => Promise<ChatRoom>;
  fetchMyProducts: () => Promise<Product[]>;
  translate: (key: keyof typeof import("@/lib/i18n").translations) => string;
}

const defaultUiSettings: UiSettings = {
  primaryColor: "#16a34a",
  backgroundTone: "#f6fff5",
  surfaceTone: "#ffffff",
  heroTitle: "Krishak helps farmers buy, sell, and hire quickly.",
  heroSubtitle: "Fast, mobile-first, and simple enough for daily village use."
};

const CART_STORAGE_KEY = "krishak-cart";

const KrishakContext = createContext<KrishakContextValue | null>(null);

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {})
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload as T;
}

export function KrishakProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [labourers, setLabourers] = useState<BootstrapPayload["labourers"]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [uiSettings, setUiSettings] = useState<UiSettings>(defaultUiSettings);
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);

  const language = currentUser?.preferences.language ?? "en";

  async function refresh() {
    const data = await request<BootstrapPayload>("/api/app/bootstrap", { method: "GET" });
    setCurrentUser(data.currentUser);
    setProducts(data.products);
    setLabourers(data.labourers);
    setOrders(data.orders);
    setChats(data.chats);
    setUiSettings(data.uiSettings);
  }

  useEffect(() => {
    const boot = async () => {
      try {
        const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (rawCart) {
          setCartProductIds(JSON.parse(rawCart));
        }
      } catch {
        setCartProductIds([]);
      }

      try {
        await refresh();
      } finally {
        setLoading(false);
      }
    };

    void boot();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartProductIds));
  }, [cartProductIds]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand", uiSettings.primaryColor);
    root.style.setProperty("--bg-soft", uiSettings.backgroundTone);
    root.style.setProperty("--surface", uiSettings.surfaceTone);
  }, [uiSettings]);

  const value = useMemo<KrishakContextValue>(
    () => ({
      loading,
      currentUser,
      products,
      labourers,
      orders,
      chats,
      cartProductIds,
      uiSettings,
      language,
      isAuthenticated: Boolean(currentUser),
      refresh,
      async login(payload) {
        await request<{ user: AppUser }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        await refresh();
      },
      async register(payload) {
        await request<{ user: AppUser }>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        await refresh();
      },
      async logout() {
        await request("/api/auth/logout", { method: "POST" });
        setCartProductIds([]);
        await refresh();
      },
      async changeLanguage(nextLanguage) {
        await request<{ user: AppUser }>("/api/app/language", {
          method: "PATCH",
          body: JSON.stringify({ language: nextLanguage })
        });
        await refresh();
      },
      async updateProfile(payload) {
        await request<{ user: AppUser }>("/api/app/profile", {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        await refresh();
      },
      async submitProduct(payload) {
        await request("/api/app/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        await refresh();
      },
      async submitLabour(payload) {
        await request("/api/app/labourers", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        await refresh();
      },
      addToCart(productId) {
        setCartProductIds((current) => (current.includes(productId) ? current : [...current, productId]));
      },
      removeFromCart(productId) {
        setCartProductIds((current) => current.filter((entry) => entry !== productId));
      },
      clearCart() {
        setCartProductIds([]);
      },
      async createOrder(type, targetId) {
        const response = await request<{ order: Order }>("/api/app/orders", {
          method: "POST",
          body: JSON.stringify({ type, targetId })
        });
        await refresh();
        return response.order;
      },
      async startChat(type, targetId) {
        const response = await request<{ chat: ChatRoom }>("/api/app/chats/start", {
          method: "POST",
          body: JSON.stringify({ type, targetId })
        });
        await refresh();
        return response.chat;
      },
      async fetchChat(chatId) {
        const response = await request<{ chat: ChatRoom }>(`/api/app/chats/${chatId}`, { method: "GET" });
        return response.chat;
      },
      async sendMessage(chatId, text) {
        const response = await request<{ chat: ChatRoom }>(`/api/app/chats/${chatId}/messages`, {
          method: "POST",
          body: JSON.stringify({ text })
        });
        setChats((current) => current.map((entry) => (entry.id === chatId ? response.chat : entry)));
        return response.chat;
      },
      async fetchMyProducts() {
        const response = await request<{ products: Product[] }>("/api/app/products?scope=mine", {
          method: "GET"
        });
        return response.products;
      },
      translate(key) {
        return t(language, key);
      }
    }),
    [loading, currentUser, products, labourers, orders, chats, cartProductIds, uiSettings, language]
  );

  return <KrishakContext.Provider value={value}>{children}</KrishakContext.Provider>;
}

export function useKrishak() {
  const context = useContext(KrishakContext);
  if (!context) {
    throw new Error("useKrishak must be used inside KrishakProvider.");
  }
  return context;
}
