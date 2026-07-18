import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SourcesClient from "./SourcesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenLaw - Sources",
};

export default async function SourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch legal sources from Supabase
  const { data: sources, error } = await supabase
    .from("legal_sources")
    .select(
      `
      id,
      title,
      short_title,
      source_type,
      jurisdiction,
      issuing_body,
      official_url,
      publication_date,
      effectivity_date,
      status,
      language
    `,
    )
    .order("title", { ascending: true });

  if (error) {
    console.error("[sources/page] Failed to load sources:", error);
  }

  return <SourcesClient initialSources={sources ?? []} />;
}
