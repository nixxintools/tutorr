import { redirect } from 'next/navigation'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { createClient } from '@/lib/supabase/server'
import type { Subject } from '@/lib/supabase/types'

export default async function SubjectChatPage({
  params,
}: {
  params: { subject: string }
}) {
  const subject = params.subject

  if (subject !== 'math' && subject !== 'reading' && subject !== 'science' && subject !== 'writing') {
    redirect('/dashboard')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let resolvedConversationId = crypto.randomUUID()
  const { data: conversation } = await supabase
    .from('conversations')
    .insert({
      user_id: user.id,
      subject,
      title: `${subject} Session`,
      mode: subject === 'writing' ? 'writing_coach' : 'tutor',
    })
    .select('id')
    .single()

  if (conversation?.id) resolvedConversationId = conversation.id

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <ChatWindow subject={subject as Subject} conversationId={resolvedConversationId} userId={user.id} />
    </div>
  )
}
