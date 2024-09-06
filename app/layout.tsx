import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "testify",
  description: "Pray for Unknown, Praise the Known",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-blk1 font-maison-mono">
      <body>
        {children}
      </body>
    </html>
  );
}
