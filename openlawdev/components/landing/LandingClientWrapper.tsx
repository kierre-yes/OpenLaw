"use client";

import Header from "./Header";
import Hero from "./Hero";
import Steps from "./Steps";
import FAQ from "./FAQ";
import Footer from "./Footer";

import { useRouter } from "next/navigation";

export default function LandingClientWrapper({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
  userEmail?: string;
}) {
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(href);
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
    </div>
  );
}
