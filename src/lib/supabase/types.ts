export type Subject = "math" | "reading" | "science" | "writing";

export type Profile = {
  id: string;
  role: "student" | "teacher" | "parent";
  full_name: string;
  grade_level: string;
  subscription_tier: "free" | "pro";
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  subject: Subject;
  title: string;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  is_flagged: boolean;
  created_at: string;
};

export type Progress = {
  id: string;
  user_id: string;
  subject: Subject;
  session_count: number;
  messages_count: number;
  last_active: string;
  updated_at: string;
};
