import axios from "axios";

/** Chat backend; NEXT_PUBLIC_CHAT_URL overrides the deployed default. */
const CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_CHAT_URL ?? "https://portfolio-backend-omega-gray.vercel.app/api/v1/chat/";

const REQUEST_TIMEOUT_MS = 30_000;
const REPLY_KEYS = ["text", "reply", "message"] as const;

export const OFFLINE_REPLY = "Sorry, I couldn't reach the server. Please try again in a moment.";
const EMPTY_REPLY = "Sorry, I didn't get an answer for that. Could you rephrase it?";

/** Pulls the reply text out of whatever shape the backend returns. */
function extractReply(data: unknown): string {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const key = REPLY_KEYS.find((k) => typeof record[k] === "string" && (record[k] as string).trim());
    if (key) return record[key] as string;
  }
  return EMPTY_REPLY;
}

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const response = await axios.post(CHAT_ENDPOINT, { message }, { timeout: REQUEST_TIMEOUT_MS });
    return extractReply(response.data);
  } catch (err: unknown) {
    // Rate-limit (429) and validation (422) responses carry a message meant for the visitor.
    const data = axios.isAxiosError(err) ? err.response?.data : undefined;
    if (data && typeof data === "object" && typeof (data as { text?: unknown }).text === "string") {
      return (data as { text: string }).text;
    }
    throw err;
  }
}
