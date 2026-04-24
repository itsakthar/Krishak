import type { Metadata } from "next";

import { KrishakProvider } from "@/components/krishak-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Krishak",
  description: "A mobile-first marketplace and labour platform for farmers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KrishakProvider>{children}</KrishakProvider>
      </body>
    </html>
  );
}
