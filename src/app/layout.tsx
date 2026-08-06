import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Modern productivity for focused work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
          position="bottom-right"
          richColors
          closeButton
          theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}