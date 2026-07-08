import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenLaw — History",
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: sessions, error } = await supabase
    .from("chat_sessions")
    .select("id, created_at, title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load chat sessions:", error);
  }

  return <HistoryClient initialSessions={sessions || []} />;
}
