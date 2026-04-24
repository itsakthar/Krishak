"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  AppUser,
  ChatRoom,
  Labourer,
  Order,
  Product,
  UiSettings
} from "@/lib/data/types";

interface AdminDashboardPayload {
  users: AppUser[];
  products: Product[];
  labourers: Labourer[];
  orders: Order[];
  chats: ChatRoom[];
  uiSettings: UiSettings;
}

const defaultSettings: UiSettings = {
  primaryColor: "#16a34a",
  backgroundTone: "#f6fff5",
  surfaceTone: "#ffffff",
  heroTitle: "Krishak helps farmers buy, sell, and hire quickly.",
  heroSubtitle: "Fast, mobile-first, and simple enough for daily village use."
};

async function adminRequest<T>(url: string, options?: RequestInit): Promise<T> {
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

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [uiSettings, setUiSettings] = useState<UiSettings>(defaultSettings);

  async function loadDashboard() {
    const data = await adminRequest<AdminDashboardPayload>("/api/admin/dashboard", { method: "GET" });
    setDashboard(data);
    setUiSettings(data.uiSettings);
    setAuthenticated(true);
  }

  useEffect(() => {
    const boot = async () => {
      try {
        await loadDashboard();
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    void boot();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      await adminRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password })
      });
      setPassword("");
      await loadDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to login.");
    }
  }

  async function handleLogout() {
    await adminRequest("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setDashboard(null);
  }

  async function handleProductSave(event: FormEvent<HTMLFormElement>, productId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await adminRequest(`/api/admin/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: formData.get("name"),
        price: Number(formData.get("price")),
        quantityValue: Number(formData.get("quantityValue")),
        unit: formData.get("unit"),
        location: formData.get("location"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        status: formData.get("status")
      })
    });

    await loadDashboard();
    setMessage("Product updated.");
  }

  async function handleProductDelete(productId: string) {
    await adminRequest(`/api/admin/products/${productId}`, { method: "DELETE" });
    await loadDashboard();
    setMessage("Product deleted.");
  }

  async function handleLabourSave(event: FormEvent<HTMLFormElement>, labourId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await adminRequest(`/api/admin/labourers/${labourId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        pricePerDay: Number(formData.get("pricePerDay")),
        location: formData.get("location"),
        status: formData.get("status")
      })
    });

    await loadDashboard();
    setMessage("Labour profile updated.");
  }

  async function handleLabourDelete(labourId: string) {
    await adminRequest(`/api/admin/labourers/${labourId}`, { method: "DELETE" });
    await loadDashboard();
    setMessage("Labour profile deleted.");
  }

  async function handleOrderUpdate(orderId: string, status: Order["status"]) {
    await adminRequest(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await loadDashboard();
    setMessage("Order updated.");
  }

  async function handleSettingsSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await adminRequest("/api/admin/ui-settings", {
      method: "PATCH",
      body: JSON.stringify(uiSettings)
    });
    await loadDashboard();
    setMessage("UI settings saved.");
  }

  if (loading) {
    return <div className="screen-center">Loading admin dashboard...</div>;
  }

  if (!authenticated || !dashboard) {
    return (
      <div className="auth-shell">
        <section className="auth-card">
          <div className="brand-chip">Krishak Admin</div>
          <h1>Secure admin access</h1>
          <p>Password is verified in the backend using environment variables. It is never hardcoded in the UI.</p>
          <form className="form-stack" onSubmit={handleLogin}>
            <label className="field">
              <span>Admin Password</span>
              <input onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
            </label>
            <button className="primary-button tall" type="submit">
              Login to Admin
            </button>
          </form>
          {message ? <p className="inline-message error">{message}</p> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <div className="brand-chip">Krishak Admin</div>
          <h1>Dashboard</h1>
          <p>Approve products and labour, manage orders, review chats, and adjust the app theme.</p>
        </div>
        <button className="ghost-link-button" onClick={() => void handleLogout()} type="button">
          Logout
        </button>
      </header>

      {message ? <p className="inline-message success">{message}</p> : null}

      <section className="admin-stats">
        <article className="summary-card">
          <strong>{dashboard.users.length}</strong>
          <span>Users</span>
        </article>
        <article className="summary-card">
          <strong>{dashboard.products.length}</strong>
          <span>Products</span>
        </article>
        <article className="summary-card">
          <strong>{dashboard.labourers.length}</strong>
          <span>Labourers</span>
        </article>
        <article className="summary-card">
          <strong>{dashboard.orders.length}</strong>
          <span>Orders</span>
        </article>
      </section>

      <section className="admin-section">
        <div className="section-head">
          <h2>UI Settings</h2>
        </div>
        <form className="admin-form-grid" onSubmit={handleSettingsSave}>
          <label className="field">
            <span>Primary Color</span>
            <input
              onChange={(event) => setUiSettings((current) => ({ ...current, primaryColor: event.target.value }))}
              value={uiSettings.primaryColor}
            />
          </label>
          <label className="field">
            <span>Background Tone</span>
            <input
              onChange={(event) => setUiSettings((current) => ({ ...current, backgroundTone: event.target.value }))}
              value={uiSettings.backgroundTone}
            />
          </label>
          <label className="field">
            <span>Surface Tone</span>
            <input
              onChange={(event) => setUiSettings((current) => ({ ...current, surfaceTone: event.target.value }))}
              value={uiSettings.surfaceTone}
            />
          </label>
          <label className="field">
            <span>Hero Title</span>
            <input
              onChange={(event) => setUiSettings((current) => ({ ...current, heroTitle: event.target.value }))}
              value={uiSettings.heroTitle}
            />
          </label>
          <label className="field field-wide">
            <span>Hero Subtitle</span>
            <textarea
              onChange={(event) => setUiSettings((current) => ({ ...current, heroSubtitle: event.target.value }))}
              rows={3}
              value={uiSettings.heroSubtitle}
            />
          </label>
          <button className="primary-button" type="submit">
            Save Theme
          </button>
        </form>
      </section>

      <section className="admin-section">
        <div className="section-head">
          <h2>Products</h2>
        </div>
        <div className="list-stack">
          {dashboard.products.map((product) => (
            <form className="admin-item-card" key={product.id} onSubmit={(event) => void handleProductSave(event, product.id)}>
              <div className="admin-grid">
                <label className="field">
                  <span>Name</span>
                  <input defaultValue={product.name} name="name" />
                </label>
                <label className="field">
                  <span>Price</span>
                  <input defaultValue={product.price} name="price" />
                </label>
                <label className="field">
                  <span>Quantity</span>
                  <input defaultValue={product.quantityValue} name="quantityValue" />
                </label>
                <label className="field">
                  <span>Unit</span>
                  <select defaultValue={product.unit} name="unit">
                    <option value="kg">kg</option>
                    <option value="grams">grams</option>
                    <option value="quintal">quintal</option>
                  </select>
                </label>
                <label className="field">
                  <span>Location</span>
                  <input defaultValue={product.location} name="location" />
                </label>
                <label className="field">
                  <span>Status</span>
                  <select defaultValue={product.status} name="status">
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </label>
                <label className="field field-wide">
                  <span>Image URL</span>
                  <input defaultValue={product.imageUrl} name="imageUrl" />
                </label>
                <label className="field field-wide">
                  <span>Description</span>
                  <textarea defaultValue={product.description} name="description" rows={3} />
                </label>
              </div>
              <div className="button-row">
                <button className="primary-button" type="submit">
                  Save
                </button>
                <button className="danger-button" onClick={() => void handleProductDelete(product.id)} type="button">
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-head">
          <h2>Labour Registrations</h2>
        </div>
        <div className="list-stack">
          {dashboard.labourers.map((labourer) => (
            <form className="admin-item-card" key={labourer.id} onSubmit={(event) => void handleLabourSave(event, labourer.id)}>
              <div className="admin-grid">
                <label className="field">
                  <span>Name</span>
                  <input defaultValue={labourer.name} name="name" />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input defaultValue={labourer.phone} name="phone" />
                </label>
                <label className="field">
                  <span>Price per day</span>
                  <input defaultValue={labourer.pricePerDay} name="pricePerDay" />
                </label>
                <label className="field">
                  <span>Location</span>
                  <input defaultValue={labourer.location} name="location" />
                </label>
                <label className="field">
                  <span>Status</span>
                  <select defaultValue={labourer.status} name="status">
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </label>
              </div>
              <div className="button-row">
                <button className="primary-button" type="submit">
                  Save
                </button>
                <button className="danger-button" onClick={() => void handleLabourDelete(labourer.id)} type="button">
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-head">
          <h2>Users</h2>
        </div>
        <div className="list-stack">
          {dashboard.users.map((user) => (
            <article className="simple-card" key={user.id}>
              <strong>{user.name}</strong>
              <p>{user.mobile}</p>
              <p className="muted-text">{user.bio || "No bio yet."}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-head">
          <h2>Orders</h2>
        </div>
        <div className="list-stack">
          {dashboard.orders.map((order) => (
            <article className="admin-item-card" key={order.id}>
              <div className="listing-title-row">
                <strong>{order.title}</strong>
                <span className={`status-pill ${order.status}`}>{order.status}</span>
              </div>
              <p>
                {order.buyerName} to {order.sellerName}
              </p>
              <div className="button-row">
                <button className="secondary-button" onClick={() => void handleOrderUpdate(order.id, "confirmed")} type="button">
                  Confirm
                </button>
                <button className="primary-button" onClick={() => void handleOrderUpdate(order.id, "completed")} type="button">
                  Complete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-head">
          <h2>Chats</h2>
        </div>
        <div className="list-stack">
          {dashboard.chats.map((chat) => (
            <article className="simple-card" key={chat.id}>
              <strong>{chat.title}</strong>
              <p>{chat.lastMessage}</p>
              <p className="muted-text">
                {chat.buyerName} and {chat.sellerName}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
