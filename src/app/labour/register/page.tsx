"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";

export default function LabourRegisterPage() {
  const router = useRouter();
  const { submitLabour, translate } = useKrishak();
  const [name, setName] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await submitLabour({
        name,
        phone,
        pricePerDay: Number(pricePerDay),
        location
      });
      router.push("/labour");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit labour profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireUser>
      <PageShell backHref="/labour" subtitle="Register once as a labour profile. It will appear after admin approval." title={translate("labourTools")}>
        <div className="option-stack">
          <div className="option-card">
            <strong>{translate("registerLabour")}</strong>
            <span>Complete this form and wait for admin approval.</span>
          </div>
        </div>

        <form className="form-stack card-surface" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input onChange={(event) => setName(event.target.value)} value={name} />
          </label>
          <label className="field">
            <span>Price (₹ per day)</span>
            <input inputMode="numeric" onChange={(event) => setPricePerDay(event.target.value)} value={pricePerDay} />
          </label>
          <label className="field">
            <span>Location</span>
            <input onChange={(event) => setLocation(event.target.value)} value={location} />
          </label>
          <label className="field">
            <span>Phone Number</span>
            <input inputMode="numeric" onChange={(event) => setPhone(event.target.value)} value={phone} />
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
