"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/components/ui/Toast";

type Role = "student" | "teacher" | "parent";

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
};

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser as AuthUser);
    };

    void loadUser();
  }, [router]);

  const firstName = useMemo(() => {
    const full = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "there";
    return full.split(" ")[0];
  }, [user]);

  const initials = useMemo(() => firstName.charAt(0).toUpperCase() || "U", [firstName]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError("Please select your role");
      return;
    }

    if (!user) {
      setError("Session expired. Please sign in again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: selectedRole })
      .eq("id", user.id);

    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4" style={{ background: "var(--bg-base)" }}>
      <div
        className="w-full max-w-lg rounded-3xl p-8 md:p-10"
        style={{
          background: "var(--bg-card)",
          border: "0.5px solid var(--border-md)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div className="mb-8 text-center">
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              width={56}
              height={56}
              className="mx-auto h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-violet-200" style={{ background: "rgba(124,58,237,0.15)" }}>
              {initials}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-bold" style={{ color: "#fff" }}>Welcome, {firstName}! 🎉</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>One quick step before you start.</p>
        </div>

        <p className="mb-3 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>I am a...</p>
        <RoleSelector selectedRole={selectedRole} onSelect={(role) => setSelectedRole(role)} />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedRole || submitting}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Get Started →"}
        </button>

        {error ? <p className="mt-3 text-sm" style={{ color: "rgba(252,165,165,1)" }}>{error}</p> : null}
      </div>

      <Toast open={Boolean(error)} message={error ?? ""} onClose={() => setError(null)} />
    </main>
  );
}
