"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Steps from "./Steps";
import FAQ from "./FAQ";
import Footer from "./Footer";
import LoadingScreen from "./LoadingScreen";

import { useRouter } from "next/navigation";

export default function LandingClientWrapper({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
  userEmail?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    setIsLoading(true);

    if (href.startsWith("#")) {
      // Simulate API fetch / route transition delay for smooth scroll
      setTimeout(() => {
        setIsLoading(false);

        // Smooth scroll to target element
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 1800);
    } else {
      // Page transition delay
      setTimeout(() => {
        setIsLoading(false);
        router.push(href);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header onLinkClick={handleLinkClick} isAuthenticated={isAuthenticated} userEmail={userEmail} />
      <main className="flex-1">
        <Hero isAuthenticated={isAuthenticated} />
        <Steps isAuthenticated={isAuthenticated} />
        <FAQ />
      </main>
      <Footer isAuthenticated={isAuthenticated} />

      {/* Global simulated loading overlay */}
      <LoadingScreen isLoading={isLoading} />
    </div>
  );
}
