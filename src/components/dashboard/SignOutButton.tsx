"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/components/ui/Toast";

export function SignOutButton() {
  const router = useRouter();
  const [toastOpen, setToastOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setToastOpen(true);
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 450);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-xs transition-colors"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        Sign out
      </button>
      <Toast open={toastOpen} message="Signed out successfully." onClose={() => setToastOpen(false)} />
    </>
  );
}
