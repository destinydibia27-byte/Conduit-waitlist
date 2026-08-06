import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conduit — Join the Waitlist",
  description:
    "Settlement infrastructure for businesses. Invoice in the currency you keep your books in, and let customers and suppliers pay in whatever stablecoin they hold.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
