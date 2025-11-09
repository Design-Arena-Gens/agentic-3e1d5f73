import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SahpathiApp - Accessible Student Companion",
  description: "Inclusive learning companion with voice control, screen reader support, and accessibility features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
