import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZecCheckout | Shielded Payments on Zcash",
  description: "Private, encrypted e-commerce settlement widget",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
