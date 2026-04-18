// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function awardXP(
  supabase: any,
  userId: string,
  eventType: string,
  xp: number,
  description?: string
) {
  await supabase.rpc('award_xp', {
    p_user_id: userId,
    p_event_type: eventType,
    p_xp: xp,
    p_desc: description,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkAndAwardAchievements(supabase: any, userId: string) {
  const { count: sessions } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (sessions === 1) await grantAchievement(supabase, userId, 'first_session')

  const { data: ownedConversations } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', userId)

  const conversationIds = (ownedConversations ?? []).map((item: { id: string }) => item.id)
  if (conversationIds.length > 0) {
    const { count: msgs } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .in('conversation_id', conversationIds)

    if ((msgs ?? 0) >= 50) await grantAchievement(supabase, userId, 'messages_50')
    if ((msgs ?? 0) >= 200) await grantAchievement(supabase, userId, 'messages_200')
  }

  const { data: xpData } = await supabase
    .from('student_xp')
    .select('current_streak')
    .eq('user_id', userId)
    .single()

  if ((xpData?.current_streak ?? 0) >= 3) await grantAchievement(supabase, userId, 'streak_3')
  if ((xpData?.current_streak ?? 0) >= 7) await grantAchievement(supabase, userId, 'streak_7')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function grantAchievement(supabase: any, userId: string, code: string) {
  const { error } = await supabase.from('student_achievements').insert({ user_id: userId, achievement_code: code })
  if (!error) {
    const { data: ach } = await supabase.from('achievements').select('xp_reward').eq('code', code).single()
    if (ach?.xp_reward) await awardXP(supabase, userId, 'achievement', ach.xp_reward, code)
  }
}
