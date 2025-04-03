import Script from "next/script";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";
import { Metadata } from "next";
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export const metadata: Metadata = {
  title: "Lora | Demo",
  description: "Sample application for Billing training",
};

export default async function RootLayout(props: RootLayoutProps) {
  const params = await props.params;

  const { children } = props;

  return (
    <html lang="en">
      <head>
        <Script
          src="https://js.stripe.com/v3"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link href="/favicon.png" rel="icon" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
