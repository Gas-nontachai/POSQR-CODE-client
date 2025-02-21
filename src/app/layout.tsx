"use client";
import { Navbar } from "@/components/component";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const noNavbarPages = ["/home"]

  return (
    <html lang="en">
      <body>
        {!noNavbarPages.includes(pathname) && <Navbar />}
        {children}
      </body>
    </html>
  );
}
