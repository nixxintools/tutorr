import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentShell } from "@/components/layout/StudentShell";
import { TeacherShell } from "@/components/layout/TeacherShell";
import { ParentShell } from "@/components/layout/ParentShell";
import { RoleWelcomeToast } from "@/components/ui/RoleWelcomeToast";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.role) {
    const meta = user.user_metadata;
    let role: "student" | "teacher" | "parent" = "student";
    if (meta?.role === "teacher") role = "teacher";
    else if (meta?.role === "parent") role = "parent";

    const { data: recovered } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: meta?.full_name ?? user.email?.split("@")[0] ?? "User",
          role,
          subscription_tier: "free",
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (recovered) profile = recovered;
  }

  const { count: unreviewedFlagsCount } = await supabase
    .from("safety_flags")
    .select("id", { count: "exact", head: true })
    .eq("reviewed", false);

  const fullName = profile?.full_name || user.email || "User";
  const firstName = fullName.split(" ")[0] || "User";
  const role = profile?.role || "student";
  const gradeLevel = profile?.grade_level?.replaceAll("_", " ") || "Middle School";
  const subscriptionTier = profile?.subscription_tier === "pro" ? "pro" : "free";

  if (role === "teacher") {
    return (
      <TeacherShell
        fullName={fullName}
        unreviewedFlagsCount={unreviewedFlagsCount ?? 0}
        role={role}
        profile={profile}
      >
        {children}
        <RoleWelcomeToast role={role} name={firstName} />
      </TeacherShell>
    );
  }

  if (role === "parent") {
    const { data: childProfiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "student")
      .limit(6);

    const childrenNav = (childProfiles ?? []).map((child) => ({
      id: child.id,
      fullName: child.full_name || "Child",
    }));

    return (
      <ParentShell
        fullName={fullName}
        subscriptionTier={subscriptionTier}
        childrenNav={childrenNav}
        role={role}
        profile={profile}
      >
        {children}
        <RoleWelcomeToast role={role} name={firstName} />
      </ParentShell>
    );
  }

  return (
    <StudentShell
      fullName={fullName}
      gradeLevel={gradeLevel}
      subscriptionTier={subscriptionTier}
      role={role}
      profile={profile}
    >
      {children}
      <RoleWelcomeToast role={role} name={firstName} />
    </StudentShell>
  );
}
