"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const supabase = createClient();
  const [loadingProvider, setLoadingProvider] = useState<
    "github" | "google" | null
  >(null);

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/callback`
      : undefined;

  async function signInWithGithub() {
    setLoadingProvider("github");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });

    if (error) {
      console.error("Github login error:", error);
      setLoadingProvider(null);
    }
  }

  async function signInWithGoogle() {
    setLoadingProvider("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      console.error("Google login error:", error);
      setLoadingProvider(null);
    }
  }

  const isGithubLoading = loadingProvider === "github";
  const isGoogleLoading = loadingProvider === "google";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border px-8 py-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mb-8">로그인하고 여행을 만들어보아요!</p>

        {/* Github OAuth Button */}
        <Button
          onClick={signInWithGithub}
          disabled={isGithubLoading || isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-all disabled:opacity-60"
        >
          {isGithubLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>GitHub 계정으로 계속하기</>
          )}
        </Button>

        {/* Google OAuth Button */}
        <Button
          onClick={signInWithGoogle}
          disabled={isGithubLoading || isGoogleLoading}
          className="mt-3 w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg border hover:bg-gray-50 transition-all disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Google 계정으로 계속하기</>
          )}
        </Button>

        {/* Divider */}
        <div className="mt-10 flex items-center gap-2">
          <div className="grow h-px bg-gray-200" />
          <div className="grow h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="grow h-px bg-gray-200" />
          <div className="grow h-px bg-gray-200" />
        </div>

        {/* Email login (optional; 아직 기능 만들지 않음) */}
        <p className="mt-6 text-sm text-center text-gray-500">
          이메일 로그인은 곧 지원됩니다 😄
        </p>
      </div>
    </main>
  );
}
