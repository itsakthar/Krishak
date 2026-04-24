import { randomUUID } from "crypto";

import { isDemoMode } from "@/lib/env";
import {
  AppUser,
  AuthPayload,
  BootstrapPayload,
  ChatRoom,
  LabourInput,
  Language,
  Order,
  OrderType,
  Product,
  ProductInput,
  ProfileInput,
  StoredUserRecord,
  UiSettings,
  Unit
} from "@/lib/data/types";
import { readDemoDb, updateDemoDb } from "@/lib/server/demo-db";
import { createPasswordRecord, verifyPassword } from "@/lib/server/passwords";
import {
  ADMIN_SESSION_COOKIE,
  USER_SESSION_COOKIE,
  clearSessionCookie,
  createDemoSession,
  getSessionCookieValue,
  hashToken,
  setSessionCookie
} from "@/lib/server/sessions";
import { normalizeMobile, toTitleCase } from "@/lib/utils";

function publicUser(record: StoredUserRecord): AppUser {
  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...user } = record;
  return user;
}

function assertValidMobile(mobile: string) {
  if (normalizeMobile(mobile).length !== 10) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }
}

function assertValidPassword(password: string) {
  if (password.trim().length < 4) {
    throw new Error("Password must be at least 4 characters.");
  }
}

function assertNonEmpty(value: string, fieldName: string) {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }
}

function parseNumber(value: number, fieldName: string) {
  if (Number.isNaN(value) || value <= 0) {
    throw new Error(`${fieldName} must be greater than 0.`);
  }
  return value;
}

async function currentSessionUserRecord() {
  const token = getSessionCookieValue(USER_SESSION_COOKIE);
  if (!token) {
    return null;
  }

  const demoDb = await readDemoDb();
  const session = demoDb.sessions.find((entry) => entry.tokenHash === hashToken(token));
  if (!session) {
    return null;
  }

  return demoDb.users.find((user) => user.id === session.userId) ?? null;
}

export async function getCurrentUser() {
  const user = await currentSessionUserRecord();
  return user ? publicUser(user) : null;
}

async function requireCurrentUserRecord() {
  const user = await currentSessionUserRecord();
  if (!user) {
    throw new Error("Please login to continue.");
  }
  return user;
}

async function currentAdminSessionExists() {
  const token = getSessionCookieValue(ADMIN_SESSION_COOKIE);
  if (!token) {
    return false;
  }

  const demoDb = await readDemoDb();
  return demoDb.admin.sessions.some((entry) => entry.tokenHash === hashToken(token));
}

export async function requireAdminSession() {
  const hasSession = await currentAdminSessionExists();
  if (!hasSession) {
    throw new Error("Admin login required.");
  }
}

export async function registerUser(payload: AuthPayload) {
  assertNonEmpty(payload.name ?? "", "Name");
  assertValidMobile(payload.mobile);
  assertValidPassword(payload.password);

  const mobile = normalizeMobile(payload.mobile);

  return updateDemoDb((demoDb) => {
    if (demoDb.users.some((user) => user.mobile === mobile)) {
      throw new Error("This mobile number is already registered.");
    }

    const { passwordHash, passwordSalt } = createPasswordRecord(payload.password);
    const newUser: StoredUserRecord = {
      id: `user-${randomUUID()}`,
      name: toTitleCase(payload.name!.trim()),
      mobile,
      bio: "",
      photoUrl: "",
      preferences: {
        language: "en",
        hasSelectedLanguage: false
      },
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt
    };

    demoDb.users.push(newUser);
    const { token, record } = createDemoSession(newUser.id);
    demoDb.sessions.push(record);
    setSessionCookie(USER_SESSION_COOKIE, token);

    return publicUser(newUser);
  });
}

export async function loginUser(payload: AuthPayload) {
  assertValidMobile(payload.mobile);
  assertValidPassword(payload.password);

  const mobile = normalizeMobile(payload.mobile);

  return updateDemoDb((demoDb) => {
    const user = demoDb.users.find((entry) => entry.mobile === mobile);
    if (!user || !verifyPassword(payload.password, user.passwordHash, user.passwordSalt)) {
      throw new Error("Incorrect mobile number or password.");
    }

    const { token, record } = createDemoSession(user.id);
    demoDb.sessions.push(record);
    setSessionCookie(USER_SESSION_COOKIE, token);

    return publicUser(user);
  });
}

export async function logoutUser() {
  const token = getSessionCookieValue(USER_SESSION_COOKIE);
  if (token) {
    await updateDemoDb((demoDb) => {
      demoDb.sessions = demoDb.sessions.filter((entry) => entry.tokenHash !== hashToken(token));
    });
  }

  clearSessionCookie(USER_SESSION_COOKIE);
}

export async function loginAdmin(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    throw new Error("ADMIN_PASSWORD is not set.");
  }

  if (password !== expectedPassword) {
    throw new Error("Incorrect admin password.");
  }

  await updateDemoDb((demoDb) => {
    const { token, record } = createDemoSession("admin");
    demoDb.admin.sessions.push(record);
    setSessionCookie(ADMIN_SESSION_COOKIE, token);
  });
}

export async function logoutAdmin() {
  const token = getSessionCookieValue(ADMIN_SESSION_COOKIE);
  if (token) {
    await updateDemoDb((demoDb) => {
      demoDb.admin.sessions = demoDb.admin.sessions.filter((entry) => entry.tokenHash !== hashToken(token));
    });
  }

  clearSessionCookie(ADMIN_SESSION_COOKIE);
}

export async function getBootstrapData(): Promise<BootstrapPayload> {
  const [demoDb, currentUser] = await Promise.all([readDemoDb(), getCurrentUser()]);
  const userId = currentUser?.id;

  return {
    currentUser,
    products: demoDb.products.filter((product) => product.status === "approved"),
    labourers: demoDb.labourers.filter((labourer) => labourer.status === "approved"),
    orders: userId
      ? demoDb.orders.filter((order) => order.buyerId === userId || order.sellerId === userId)
      : [],
    chats: userId
      ? demoDb.chats.filter((chat) => chat.buyerId === userId || chat.sellerId === userId)
      : [],
    uiSettings: demoDb.admin.uiSettings,
    demoMode: isDemoMode
  };
}

export async function listSellerProducts() {
  const currentUser = await requireCurrentUserRecord();
  const demoDb = await readDemoDb();
  return demoDb.products.filter((product) => product.sellerId === currentUser.id);
}

function sanitizeImageUrl(imageUrl: string) {
  const trimmed = imageUrl.trim();
  if (!trimmed) {
    return "/images/okra.svg";
  }

  return trimmed.startsWith("data:image") || trimmed.startsWith("/") ? trimmed : "/images/okra.svg";
}

export async function createProductSubmission(input: ProductInput) {
  const currentUser = await requireCurrentUserRecord();
  assertNonEmpty(input.name, "Product name");
  assertNonEmpty(input.location, "Location");
  parseNumber(input.price, "Price");
  parseNumber(input.quantityValue, "Quantity");

  const validUnits: Unit[] = ["kg", "grams", "quintal"];
  if (!validUnits.includes(input.unit)) {
    throw new Error("Please choose a valid unit.");
  }

  return updateDemoDb((demoDb) => {
    const newProduct: Product = {
      id: `product-${randomUUID()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: currentUser.mobile,
      name: toTitleCase(input.name.trim()),
      imageUrl: sanitizeImageUrl(input.imageUrl),
      price: input.price,
      quantityValue: input.quantityValue,
      unit: input.unit,
      location: input.location.trim(),
      description: input.description?.trim(),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    demoDb.products.unshift(newProduct);
    return newProduct;
  });
}

export async function createLabourSubmission(input: LabourInput) {
  const currentUser = await requireCurrentUserRecord();
  assertNonEmpty(input.name, "Name");
  assertValidMobile(input.phone);
  assertNonEmpty(input.location, "Location");
  parseNumber(input.pricePerDay, "Price");

  return updateDemoDb((demoDb) => {
    const newLabour = {
      id: `labour-${randomUUID()}`,
      userId: currentUser.id,
      name: toTitleCase(input.name.trim()),
      phone: normalizeMobile(input.phone),
      pricePerDay: input.pricePerDay,
      location: input.location.trim(),
      status: "pending" as const,
      createdAt: new Date().toISOString()
    };

    demoDb.labourers.unshift(newLabour);
    return newLabour;
  });
}

export async function updateLanguage(language: Language) {
  const currentUser = await requireCurrentUserRecord();

  return updateDemoDb((demoDb) => {
    const user = demoDb.users.find((entry) => entry.id === currentUser.id);
    if (!user) {
      throw new Error("User not found.");
    }

    user.preferences.language = language;
    user.preferences.hasSelectedLanguage = true;
    return publicUser(user);
  });
}

export async function updateProfile(input: ProfileInput) {
  const currentUser = await requireCurrentUserRecord();
  assertNonEmpty(input.name, "Name");

  return updateDemoDb((demoDb) => {
    const user = demoDb.users.find((entry) => entry.id === currentUser.id);
    if (!user) {
      throw new Error("User not found.");
    }

    user.name = toTitleCase(input.name.trim());
    user.bio = input.bio.trim();
    user.photoUrl = sanitizeImageUrl(input.photoUrl || "");
    return publicUser(user);
  });
}

export async function listMyOrders() {
  const currentUser = await requireCurrentUserRecord();
  const demoDb = await readDemoDb();
  return demoDb.orders.filter((order) => order.buyerId === currentUser.id || order.sellerId === currentUser.id);
}

function findTarget(
  type: OrderType,
  targetId: string,
  demoDb: Awaited<ReturnType<typeof readDemoDb>>
): { title: string; sellerId: string; sellerName: string; sellerPhone: string } {
  if (type === "product") {
    const product = demoDb.products.find((entry) => entry.id === targetId && entry.status === "approved");
    if (!product) {
      throw new Error("Product not found.");
    }

    return {
      title: product.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerPhone: product.sellerPhone
    };
  }

  const labourer = demoDb.labourers.find((entry) => entry.id === targetId && entry.status === "approved");
  if (!labourer) {
    throw new Error("Labour profile not found.");
  }

  return {
    title: labourer.name,
    sellerId: labourer.userId,
    sellerName: labourer.name,
    sellerPhone: labourer.phone
  };
}

export async function createOrder(type: OrderType, targetId: string) {
  const currentUser = await requireCurrentUserRecord();

  return updateDemoDb((demoDb) => {
    const target = findTarget(type, targetId, demoDb);
    const existing = demoDb.orders.find(
      (order) => order.buyerId === currentUser.id && order.type === type && order.targetId === targetId
    );

    if (existing) {
      return existing;
    }

    const newOrder: Order = {
      id: `order-${randomUUID()}`,
      type,
      targetId,
      title: target.title,
      buyerId: currentUser.id,
      sellerId: target.sellerId,
      buyerName: currentUser.name,
      sellerName: target.sellerName,
      sellerPhone: target.sellerPhone,
      status: "contacted",
      createdAt: new Date().toISOString()
    };

    demoDb.orders.unshift(newOrder);
    return newOrder;
  });
}

export async function startChat(type: OrderType, targetId: string) {
  const currentUser = await requireCurrentUserRecord();

  return updateDemoDb((demoDb) => {
    const target = findTarget(type, targetId, demoDb);
    const existing = demoDb.chats.find(
      (chat) => chat.buyerId === currentUser.id && chat.type === type && chat.targetId === targetId
    );

    if (existing) {
      return existing;
    }

    const order = demoDb.orders.find(
      (item) => item.buyerId === currentUser.id && item.type === type && item.targetId === targetId
    );

    if (!order) {
      demoDb.orders.unshift({
        id: `order-${randomUUID()}`,
        type,
        targetId,
        title: target.title,
        buyerId: currentUser.id,
        sellerId: target.sellerId,
        buyerName: currentUser.name,
        sellerName: target.sellerName,
        sellerPhone: target.sellerPhone,
        status: "contacted",
        createdAt: new Date().toISOString()
      });
    }

    const newChat: ChatRoom = {
      id: `chat-${randomUUID()}`,
      title: `${target.title} enquiry`,
      type,
      targetId,
      buyerId: currentUser.id,
      sellerId: target.sellerId,
      buyerName: currentUser.name,
      sellerName: target.sellerName,
      lastMessage: "Conversation started",
      lastMessageAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${randomUUID()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: "Namaste, I would like to discuss this listing.",
          createdAt: new Date().toISOString()
        }
      ]
    };

    demoDb.chats.unshift(newChat);
    return newChat;
  });
}

export async function getChat(chatId: string) {
  const currentUser = await requireCurrentUserRecord();
  const demoDb = await readDemoDb();
  const chat = demoDb.chats.find((entry) => entry.id === chatId);

  if (!chat || (chat.buyerId !== currentUser.id && chat.sellerId !== currentUser.id)) {
    throw new Error("Chat not found.");
  }

  return chat;
}

export async function sendChatMessage(chatId: string, text: string) {
  const currentUser = await requireCurrentUserRecord();
  assertNonEmpty(text, "Message");

  return updateDemoDb((demoDb) => {
    const chat = demoDb.chats.find((entry) => entry.id === chatId);
    if (!chat || (chat.buyerId !== currentUser.id && chat.sellerId !== currentUser.id)) {
      throw new Error("Chat not found.");
    }

    const message = {
      id: `msg-${randomUUID()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    chat.messages.push(message);
    chat.lastMessage = message.text;
    chat.lastMessageAt = message.createdAt;
    return chat;
  });
}

export async function getAdminDashboard() {
  await requireAdminSession();
  const demoDb = await readDemoDb();

  return {
    users: demoDb.users.map(publicUser),
    products: demoDb.products,
    labourers: demoDb.labourers,
    orders: demoDb.orders,
    chats: demoDb.chats,
    uiSettings: demoDb.admin.uiSettings
  };
}

export async function updateAdminProduct(
  productId: string,
  updates: Partial<Product> & { status?: Product["status"] }
) {
  await requireAdminSession();

  return updateDemoDb((demoDb) => {
    const product = demoDb.products.find((entry) => entry.id === productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    if (updates.name) {
      product.name = toTitleCase(updates.name);
    }
    if (typeof updates.price === "number") {
      product.price = parseNumber(updates.price, "Price");
    }
    if (typeof updates.quantityValue === "number") {
      product.quantityValue = parseNumber(updates.quantityValue, "Quantity");
    }
    if (updates.unit) {
      product.unit = updates.unit;
    }
    if (updates.location) {
      product.location = updates.location.trim();
    }
    if (typeof updates.description === "string") {
      product.description = updates.description.trim();
    }
    if (updates.imageUrl) {
      product.imageUrl = sanitizeImageUrl(updates.imageUrl);
    }
    if (updates.status) {
      product.status = updates.status;
    }

    return product;
  });
}

export async function deleteAdminProduct(productId: string) {
  await requireAdminSession();

  return updateDemoDb((demoDb) => {
    demoDb.products = demoDb.products.filter((entry) => entry.id !== productId);
    demoDb.orders = demoDb.orders.filter((entry) => !(entry.type === "product" && entry.targetId === productId));
    demoDb.chats = demoDb.chats.filter((entry) => !(entry.type === "product" && entry.targetId === productId));
  });
}

export async function updateAdminLabour(
  labourId: string,
  updates: { name?: string; phone?: string; pricePerDay?: number; location?: string; status?: "pending" | "approved" | "rejected" }
) {
  await requireAdminSession();

  return updateDemoDb((demoDb) => {
    const labourer = demoDb.labourers.find((entry) => entry.id === labourId);
    if (!labourer) {
      throw new Error("Labour profile not found.");
    }

    if (updates.name) {
      labourer.name = toTitleCase(updates.name);
    }
    if (updates.phone) {
      labourer.phone = normalizeMobile(updates.phone);
    }
    if (typeof updates.pricePerDay === "number") {
      labourer.pricePerDay = parseNumber(updates.pricePerDay, "Price");
    }
    if (updates.location) {
      labourer.location = updates.location.trim();
    }
    if (updates.status) {
      labourer.status = updates.status;
    }

    return labourer;
  });
}

export async function deleteAdminLabour(labourId: string) {
  await requireAdminSession();

  return updateDemoDb((demoDb) => {
    demoDb.labourers = demoDb.labourers.filter((entry) => entry.id !== labourId);
    demoDb.orders = demoDb.orders.filter((entry) => !(entry.type === "labour" && entry.targetId === labourId));
    demoDb.chats = demoDb.chats.filter((entry) => !(entry.type === "labour" && entry.targetId === labourId));
  });
}

export async function updateUiSettings(input: UiSettings) {
  await requireAdminSession();
  assertNonEmpty(input.primaryColor, "Primary color");
  assertNonEmpty(input.backgroundTone, "Background color");
  assertNonEmpty(input.surfaceTone, "Surface color");
  assertNonEmpty(input.heroTitle, "Hero title");
  assertNonEmpty(input.heroSubtitle, "Hero subtitle");

  return updateDemoDb((demoDb) => {
    demoDb.admin.uiSettings = input;
    return demoDb.admin.uiSettings;
  });
}

export async function updateAdminOrder(
  orderId: string,
  updates: { status?: "pending" | "contacted" | "confirmed" | "completed" }
) {
  await requireAdminSession();

  return updateDemoDb((demoDb) => {
    const order = demoDb.orders.find((entry) => entry.id === orderId);
    if (!order) {
      throw new Error("Order not found.");
    }

    if (updates.status) {
      order.status = updates.status;
    }

    return order;
  });
}
