"use client";

import { useRef } from "react";
import { OfferingsProvider } from "@/contexts/OfferingsContext";
import { Footer, NavBar } from "@/components";
import { UserProvider } from "@/contexts/UserContext";

interface AppContentProps {
  children: React.ReactNode;
}

interface CustomCSSProperties extends React.CSSProperties {
  "--transition-duration"?: string;
}

function AppContent({ children }: AppContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const containerClasses = `
    flex-grow transition-all ease-in-out
    md:translate-x-0 md:translate-y-0 md:scale-100 lg:translate-x-0 lg:scale-100 xl:translate-x-0 xl:scale-100
    transform origin-top-left
    bg-white
  `;

  const containerStyle: CustomCSSProperties = {
    "--transition-duration": "700ms",
    transitionDuration: "var(--transition-duration)",
  };

  return (
    <div className={`flex flex-col min-h-screen bg-pattern`}>
      <div
        id="app-container"
        className={containerClasses}
        style={containerStyle}
      >
        <div ref={scrollContainerRef} className={`flex flex-col min-h-full`}>
          <NavBar />
          <main className="flex-grow w-full">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <UserProvider>
      <OfferingsProvider>
        <AppContent>{children}</AppContent>
      </OfferingsProvider>
    </UserProvider>
  );
}
