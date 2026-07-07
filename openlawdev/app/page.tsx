import { createClient } from "@/lib/supabase/server";
import LandingClientWrapper from "../components/landing/LandingClientWrapper";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingClientWrapper isAuthenticated={!!user} />;
}
