import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ModalProvider from "@/providers/ModalProvider";
import ToastProvider from "@/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:{
    template: "%s Admin Dashboard",
    default: "Admin Dashboard",
  },
  description: "Admin Dashboard",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider afterSignOutUrl={'/sign-in'}>
        <html lang="en">
      <body className={inter.className}>
        <main className="h-full container" >
          <ToastProvider  />
          <ModalProvider/>
        {children}
        </main>
      </body>
    </html>
      </ClerkProvider>
  );
}
