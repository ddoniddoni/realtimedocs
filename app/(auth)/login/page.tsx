"use client";

import { useState } from "react";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function signInWithGithub() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border px-8 py-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mb-8">
          로그인하고 문서를 실시간으로 편집하세요.
        </p>

        {/* OAuth Buttons */}
        <button
          onClick={signInWithGithub}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-all disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>GitHub로 로그인</>
          )}
        </button>

        {/* Divider */}
        <div className="mt-10 flex items-center gap-2">
          <div className="grow h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
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
