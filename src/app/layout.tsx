import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDFビューワー",
  description: "PDFを画像に変換するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
