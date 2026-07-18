"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

/* ─────────────────────────────────────────
   Shared helpers
───────────────────────────────────────── */

type ActionResult = {
  error?: string;
  message?: string;
};

const emailSchema = z.string().email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

/* ─────────────────────────────────────────
   Sign-in
───────────────────────────────────────── */

export async function signIn(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;

  const emailParse = emailSchema.safeParse(rawEmail);
  if (!emailParse.success) return { error: emailParse.error.issues[0].message };

  const passwordParse = passwordSchema.safeParse(rawPassword);
  if (!passwordParse.success)
    return { error: passwordParse.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: rawEmail,
    password: rawPassword,
  });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { error: "Incorrect email or password. Please try again." };
    }
    return { error: "Unable to sign in. Please try again later." };
  }

  redirect("/search");
}

/* ─────────────────────────────────────────
   Sign-up
───────────────────────────────────────── */

export async function signUp(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;
  const rawConfirm = formData.get("confirm") as string;

  const emailParse = emailSchema.safeParse(rawEmail);
  if (!emailParse.success) return { error: emailParse.error.issues[0].message };

  const passwordParse = passwordSchema.safeParse(rawPassword);
  if (!passwordParse.success)
    return { error: passwordParse.error.issues[0].message };

  if (rawPassword !== rawConfirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: rawEmail,
    password: rawPassword,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return {
        error: "An account with this email already exists. Try signing in.",
      };
    }
    return { error: "Unable to create account. Please try again later." };
  }

  return {
    message:
      "Account created. Check your email for a confirmation link before signing in.",
  };
}

/* ─────────────────────────────────────────
   Forgot password
───────────────────────────────────────── */

export async function forgotPassword(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawEmail = formData.get("email") as string;

  const emailParse = emailSchema.safeParse(rawEmail);
  if (!emailParse.success) return { error: emailParse.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(rawEmail, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?type=recovery`,
  });

  if (error) {
    return { error: "Unable to send reset link. Please try again." };
  }

  return {
    message:
      "Reset link sent. Check your email - the link is valid for one hour.",
  };
}

/* ─────────────────────────────────────────
   Update password (after recovery link)
───────────────────────────────────────── */

export async function updatePassword(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const rawPassword = formData.get("password") as string;
  const rawConfirm = formData.get("confirm") as string;

  const passwordParse = passwordSchema.safeParse(rawPassword);
  if (!passwordParse.success)
    return { error: passwordParse.error.issues[0].message };

  if (rawPassword !== rawConfirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: rawPassword });

  if (error) {
    return { error: "Could not update your password. Please try again." };
  }

  redirect("/search");
}

/* ─────────────────────────────────────────
   Sign-out
───────────────────────────────────────── */

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
