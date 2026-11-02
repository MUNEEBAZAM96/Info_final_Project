import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CloudGuard",
  description: "Offline analysis of sample AWS IAM, trust, and S3 policies.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
