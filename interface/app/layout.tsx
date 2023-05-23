import { ReactNode } from "react";
import type { Metadata } from "next";

import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const metadata: Metadata = {
  title: "TaH Monitoring System",
  description: "Temperature and Humidity Monitoring System",
};

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hans-TW">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
export { metadata };
