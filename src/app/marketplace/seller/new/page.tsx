"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { Unit } from "@/lib/data/types";

const units: Unit[] = ["kg", "grams", "quintal"];

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SellerNewPage() {
  const router = useRouter();
  const { submitProduct, translate } = useKrishak();
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setImageUrl(dataUrl);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await submitProduct({
        name,
        imageUrl,
        price: Number(price),
        quantityValue: Number(quantityValue),
        unit,
        location,
        description
      });
      router.push("/marketplace/seller/history");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireUser>
      <PageShell backHref="/marketplace/seller" subtitle="Fill the details once and the listing will wait for admin approval." title={translate("newSell")}>
        <form className="form-stack card-surface" onSubmit={handleSubmit}>
          <label className="field">
            <span>Product Name</span>
            <input onChange={(event) => setName(event.target.value)} value={name} />
          </label>

          <label className="field">
            <span>Product Image Upload</span>
            <input accept="image/*" onChange={handleImage} type="file" />
          </label>

          <label className="field">
            <span>Product Price</span>
            <input inputMode="numeric" onChange={(event) => setPrice(event.target.value)} value={price} />
          </label>

          <label className="field">
            <span>Quantity</span>
            <input inputMode="numeric" onChange={(event) => setQuantityValue(event.target.value)} value={quantityValue} />
          </label>

          <label className="field">
            <span>Unit</span>
            <select onChange={(event) => setUnit(event.target.value as Unit)} value={unit}>
              {units.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Location</span>
            <input onChange={(event) => setLocation(event.target.value)} value={location} />
          </label>

          <label className="field">
            <span>Description (Optional)</span>
            <textarea onChange={(event) => setDescription(event.target.value)} rows={4} value={description} />
          </label>

          {message ? <p className="inline-message error">{message}</p> : null}

          <button className="primary-button tall" disabled={saving} type="submit">
            {saving ? "Submitting..." : translate("submit")}
          </button>
        </form>
      </PageShell>
    </RequireUser>
  );
}
