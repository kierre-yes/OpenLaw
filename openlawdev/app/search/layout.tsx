import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function SearchLayout({
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
      className="flex flex-col h-[100dvh] overflow-hidden font-sans transition-colors duration-300"
      style={{ backgroundColor: "var(--color-page-bg)" }}
    >
      <Header isAuthenticated={!!user} userEmail={user?.email} />
      <main className="flex-1 flex flex-col overflow-hidden min-h-0">{children}</main>
    </div>
  );
}
