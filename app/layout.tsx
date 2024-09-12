import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationContext";
import NavBar from "./components/NavBar";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: "testifyth",
  description: "Pray for Unknown, Praise the Known",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(GeistMono.variable);
  return (
    <html lang="en" className={`${GeistMono.className} font-light bg-blk1`}>
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
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
        <meta
          property="og:image:alt"
          content="testifyth | Pray for Unknown. Praise the Known"
        />

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body >
        <AuthProvider>
          <NotificationsProvider>
            <NavBar />
            {children}
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
