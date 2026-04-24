"use client";

import { useRouter } from "next/navigation";

import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { languages } from "@/lib/i18n";

export default function LanguagePage() {
  const router = useRouter();
  const { changeLanguage, currentUser } = useKrishak();

  async function handleSelect(language: (typeof languages)[number]["code"]) {
    await changeLanguage(language);
    router.push("/marketplace");
  }

  return (
    <RequireUser>
      <div className="auth-shell">
        <section className="auth-card">
          <div className="brand-chip">Krishak</div>
          <h1>Choose your preferred language</h1>
          <p>Pick a language once now. You can change it later from the floating button on every page.</p>

          <div className="language-grid">
            {languages.map((option) => (
              <button
                className={`language-choice ${
                  currentUser?.preferences.language === option.code ? "selected" : ""
                }`}
                key={option.code}
                onClick={() => void handleSelect(option.code)}
                type="button"
              >
                <strong>{option.nativeLabel}</strong>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </RequireUser>
  );
}
