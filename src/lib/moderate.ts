import OpenAI from "openai";

export async function moderateContent(text: string): Promise<boolean> {
  try {
    const blockedPatterns = [
      /\b(kill|hurt|harm|suicide|violence)\b/i,
      /\b(address|phone number|personal info)\b/i,
    ];

    if (blockedPatterns.some((pattern) => pattern.test(text))) {
      return true;
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.moderations.create({ input: text });

    return result.results[0].flagged;
  } catch {
    return false;
  }
}
