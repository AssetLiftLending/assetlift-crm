import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssetLift CRM",
  description: "Borrower, lender, and funding workflow CRM for AssetLift Lending.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
