import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SearchClient from "./SearchClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenLaw - Search",
};

export default async function SearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <SearchClient />;
}
