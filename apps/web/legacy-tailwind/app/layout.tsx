import type { ReactNode } from "react";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/AppShell";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "CloudGuard",
  description: "Offline analysis of sample AWS IAM, trust, and S3 policies.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-[#0b1020] text-slate-100 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
