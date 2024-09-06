import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Head } from "next/document";

export const metadata: Metadata = {
  title: "testifyth",
  description: "Pray for Unknown, Praise the Known",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-blk1 font-maison-mono">
      <head>
        <title>testifyth | Pray for Unknown. Praise the Known</title>
        <meta
          name="description"
          content="Join testifyth to share prayer requests and hear powerful testimonies from believers around the world."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:title"
          content="testifyth | Pray for Unknown. Praise the Known"
        />
        <meta
          property="og:description"
          content="Join testifyth to share prayer requests and hear powerful testimonies from believers around the world."
        />
        <meta property="og:url" content="https://testifyth.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="testifyth" />
        <meta property="og:image" content="/og-image.png" />

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
