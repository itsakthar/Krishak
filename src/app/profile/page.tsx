"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { currentUser, logout, translate, updateProfile } = useKrishak();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setName(currentUser.name);
    setBio(currentUser.bio);
    setPhotoUrl(currentUser.photoUrl || "");
  }, [currentUser]);

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPhotoUrl(await fileToDataUrl(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateProfile({ name, bio, photoUrl });
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireUser>
      <PageShell subtitle="Manage your personal details. Your mobile number stays locked for safety." title={translate("profile")}>
        <form className="form-stack card-surface" onSubmit={handleSubmit}>
          <div className="profile-photo">
            {photoUrl ? (
              <Image alt="Profile preview" height={88} src={photoUrl} width={88} />
            ) : (
              <span>{name.slice(0, 1) || "K"}</span>
            )}
          </div>

          <label className="field">
            <span>Name</span>
            <input onChange={(event) => setName(event.target.value)} value={name} />
          </label>

          <label className="field">
            <span>Profile Photo (Optional)</span>
            <input accept="image/*" onChange={handlePhoto} type="file" />
          </label>

          <label className="field">
            <span>Mobile Number</span>
            <input disabled value={currentUser?.mobile || ""} />
          </label>

          <label className="field">
            <span>Bio</span>
            <textarea onChange={(event) => setBio(event.target.value)} rows={4} value={bio} />
          </label>

          {message ? <p className={`inline-message ${message.includes("success") ? "success" : "error"}`}>{message}</p> : null}

          <button className="primary-button tall" disabled={saving} type="submit">
            {saving ? "Saving..." : translate("save")}
          </button>
          <button className="ghost-block-button" onClick={() => void logout()} type="button">
            {translate("logout")}
          </button>
        </form>
      </PageShell>
    </RequireUser>
  );
}
