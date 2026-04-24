"use client";

import { useState } from "react";

import { useKrishak } from "@/components/krishak-provider";
import { languages } from "@/lib/i18n";

export function LanguageFab() {
  const [open, setOpen] = useState(false);
  const { changeLanguage, currentUser, language, translate } = useKrishak();

  async function handleSelect(nextLanguage: (typeof languages)[number]["code"]) {
    if (!currentUser) {
      setOpen(false);
      return;
    }

    await changeLanguage(nextLanguage);
    setOpen(false);
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="language-fab-wrap">
      {open ? (
        <div className="language-panel">
          <div className="panel-label">{translate("switchLanguage")}</div>
          {languages.map((option) => (
            <button
              className={`language-option ${language === option.code ? "active" : ""}`}
              key={option.code}
              onClick={() => void handleSelect(option.code)}
              type="button"
            >
              <span>{option.nativeLabel}</span>
              <span className="muted-text">{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
      <button
        aria-label={translate("switchLanguage")}
        className="fab-button"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {language.toUpperCase()}
      </button>
    </div>
  );
}
