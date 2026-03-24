import Groq from "groq-sdk";
import { getEnv } from "../../config/env";

const groq = new Groq({
  apiKey: getEnv("GROQ_API_KEY"),
});

// Message type for history
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const generateGroqResponse = async (
  userMessage: string,
  products: { name: string; price: number; category?: string }[],
  history: ChatMessage[] = []
): Promise<string> => {
  const productList = products
    .map((p) => `- ${p.name}: ₹${p.price}${p.category ? ` (${p.category})` : ""}`)
    .join("\n");

  // Keep only last 10 messages to avoid token overflow
  const recentHistory = history.slice(-10);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 500,
    temperature: 0.7,       // balanced creativity
    top_p: 0.9,             // better response quality
    messages: [
      {
        role: "system",
        content: `You are a friendly and smart customer support assistant for a fashion ecommerce store.

Available products:
${productList}

Your capabilities:
- Recommend products based on user needs, budget, gender, or occasion
- Answer questions about sizing, returns, delivery, and payments
- Help users find products by category (Men, Women, Shoes, Kids, Accessories)
- Suggest alternatives if a product is out of budget

Rules:
- Always use ₹ for Indian prices
- Keep replies concise (2-4 lines max)
- Be warm, friendly, and helpful
- If someone asks something unrelated to shopping or support, politely redirect them
- Remember context from earlier in the conversation`,
      },

      // ✅ Inject full conversation history
      ...recentHistory,

      // ✅ Current user message
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  return (
    completion.choices[0]?.message?.content ??
    "Sorry, I could not help with that."
  );
};