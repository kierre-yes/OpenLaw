import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth Callback Route
 *
 * Supabase email confirmation and password-reset links redirect here
 * with a short-lived `code` query parameter. This handler exchanges that
 * code for a full user session (via PKCE), then sends the user to the
 * appropriate page.
 *
 * Flow:
 *   Email confirmation  → /auth/confirm
 *   Password recovery   → /auth/confirm?type=recovery
 *   Generic error       → /auth/confirm?error=<description>
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const type = searchParams.get("type"); // "recovery" | "email" | etc.
  const next = searchParams.get("next"); // optional override destination

  // Derive the base origin for redirects (respects Vercel deployment URLs)
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || origin;

  if (!code) {
    // No code — something went wrong upstream
    return NextResponse.redirect(
      `${siteUrl}/auth/confirm?error=missing_code`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(
      `${siteUrl}/auth/confirm?error=${encodeURIComponent(error.message)}`
    );
  }

  // Successful code exchange — redirect to final destination
  if (next) {
    return NextResponse.redirect(`${siteUrl}${next}`);
  }

  if (type === "recovery") {
    // Password reset: take the user to the reset-password form
    return NextResponse.redirect(`${siteUrl}/auth/reset-password`);
  }

  // Default: email confirmation
  return NextResponse.redirect(`${siteUrl}/auth/confirm`);
}
