import { Inter } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../app/api/uploadthing/core";
import { AuthProvider } from './contexts/AuthContext';
import Header from '../components/Header';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AgriTrade — Invest in Farmers, Harvest Hope",
  description:
    "Buy shares in agricultural yields, earn profits, and help reduce farmer debt. Together, we can save lives and build sustainable farming.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
