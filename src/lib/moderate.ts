const BLOCKED_PATTERNS = [
  /\b(kill|hurt|harm|suicide|violence)\b/i,
  /\b(address|phone number|personal info)\b/i,
]

export async function moderateContent(text: string): Promise<boolean> {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text))
}
