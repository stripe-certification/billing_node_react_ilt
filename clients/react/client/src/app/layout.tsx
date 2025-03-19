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
  viewport: "width=device-width, initial-scale=1",
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

        {/* GOOGLE ANALYTICS - DO NOT REMOVE */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4WLNJQ7QF9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-4WLNJQ7QF9');
        `}
        </Script>

        {/* UMAMI ANALYTICS - DO NOT REMOVE */}
        <script
          defer
          src="https://analytics-hub.stripedemos.com/script.js"
          data-website-id="cb163646-e18a-4c58-87e0-e66f6050b092"
        ></script>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
