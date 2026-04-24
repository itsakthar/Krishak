import { Language } from "@/lib/data/types";

export function normalizeMobile(input: string) {
  return input.replace(/\D/g, "").slice(-10);
}

export function mobileToEmail(mobile: string) {
  return `${normalizeMobile(mobile)}@krishak.app`;
}

export function formatCurrency(value: number, language: Language = "en") {
  return new Intl.NumberFormat(language === "hi" ? "hi-IN" : language === "bn" ? "bn-BD" : "en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string, language: Language = "en") {
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : language === "bn" ? "bn-BD" : "en-IN", {
    day: "numeric",
    month: "short"
  }).format(new Date(value));
}

export function safeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(" ");
}
