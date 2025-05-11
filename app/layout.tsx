import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import Notice from "@/components/notice";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Origin Analyzer",
  description:
    "Analyze product images to determine origin and ethical insights",
    icons: "/logo.jpg"
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
              {children}
              <Notice />
            </div>
          </div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
