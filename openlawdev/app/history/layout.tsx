import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      className="flex flex-col min-h-screen font-sans transition-colors duration-300"
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      <Header isAuthenticated={!!user} userEmail={user?.email} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer isAuthenticated={!!user} />
    </div>
  );
}
