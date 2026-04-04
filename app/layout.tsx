import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Youth Empowerment Platform",
  description: "Community empowerment, contributions, projects and MLM system",
  manifest: "/manifest.json", // ✅ FIXED
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA SETTINGS */}
        <link rel="manifest" href="/manifest.json" />

        {/* Mobile App Feel */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        {/* iOS Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* App Title on Phone */}
        <meta name="apple-mobile-web-app-title" content="YEP Platform" />
      </head>

      <body className="bg-slate-900">
        {children}
      </body>
    </html>
  );
}