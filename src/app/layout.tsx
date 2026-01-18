import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { AppearanceProvider } from "@/contexts/appearance-context";
import { SubscriptionProvider } from "@/contexts/subscription-context";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ObitoX",
  description: "Enterprise-grade API management, rate limiting, and monitoring platform. Secure and scale your APIs with confidence.",
  icons: {
    icon: "/logoo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SubscriptionProvider>
            <AppearanceProvider>
              <ToastProvider>
                {children}
                <Toaster position="bottom-right" theme="dark" richColors />
              </ToastProvider>
            </AppearanceProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
