export async function checkUsageLimit(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date().toISOString().split("T")[0];

  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", today)
    .in(
      "conversation_id",
      supabase.from("conversations").select("id").eq("user_id", userId)
    );

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  if (profile?.subscription_tier === "pro") {
    return { allowed: true, remaining: 999 };
  }

  const FREE_LIMIT = 10;
  const messageCount = count ?? 0;

  return {
    allowed: messageCount < FREE_LIMIT,
    remaining: FREE_LIMIT - messageCount,
  };
}
