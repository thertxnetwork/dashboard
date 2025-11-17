import type { Metadata } from "next";
import "./globals.css";
import "../styles/nprogress.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import RouteLoading from "@/components/RouteLoading";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Complete admin panel with Next.js and Django",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RouteLoading />
              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
