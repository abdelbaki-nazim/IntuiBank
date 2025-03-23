import type { Metadata } from "next";
import "../../styles/globals.css";
import { Poppins } from "next/font/google";
import LayoutClient from "@/app/LayoutClient";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intuibank",
  description: "Intuibank, Banking, Intuitively Smart",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Intuibank" />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
