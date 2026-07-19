import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Initialize OpenRouter with the key from environment using the official OpenAI provider for stable tool loops
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id || null;

    const body = await req.json();
    const rawMessages = body.messages;

    const incomingMessages = Array.isArray(rawMessages)
      ? rawMessages
      : Array.isArray(rawMessages?.messages)
        ? rawMessages.messages
        : [];

    if (incomingMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const latestMessage = incomingMessages[incomingMessages.length - 1];

    // Normalize content
    let queryText = "";
    if (typeof latestMessage.content === "string") {
      queryText = latestMessage.content;
    } else if (Array.isArray(latestMessage.content)) {
      queryText = latestMessage.content
        .map((part: { type: string; text?: string }) =>
          part.type === "text" ? part.text : "",
        )
        .join(" ");
    } else if (Array.isArray(latestMessage.parts)) {
      queryText = latestMessage.parts
        .map((part: { type: string; text?: string }) =>
          part.type === "text" ? part.text : "",
        )
        .join(" ");
    }

    const systemPrompt = `You are an expert Philippine Legal Assistant named OpenLaw.
You MUST strictly adhere to the following rules:
1. ONLY answer questions related to Philippine Law, legal processes, jurisprudence, Republic Acts, and Supreme Court Decisions.
2. If the user asks a question about ANY non-legal topic (e.g., programming, math, general trivia), you MUST politely refuse to answer and remind them that you are exclusively a Philippine Legal Assistant.
3. You have access to a tool called "search_philippine_law". You MUST use this tool to search the internet for official Philippine laws whenever a user asks a substantive legal question.
4. When you answer based on the search results, always cite the exact source URL so the user can verify it. 
5. If the user asks a casual greeting, respond conversationally without searching.
6. DO NOT use any emojis in your response. Keep a professional and formal legal tone.`;

    interface MessagePart {
      type: string;
      text?: string;
    }

    interface IncomingMessage {
      role: string;
      content?: string | MessagePart[];
      parts?: MessagePart[];
    }

    const modelMessages = incomingMessages
      .filter((m: IncomingMessage) => m.role !== "system")
      .map((m: IncomingMessage) => {
        let content = "";
        if (typeof m.content === "string") {
          content = m.content;
        } else if (Array.isArray(m.content)) {
          content = m.content
            .map((part) => (part.type === "text" ? (part.text ?? "") : ""))
            .join("");
        } else if (Array.isArray(m.parts)) {
          content = m.parts
            .map((part) => (part.type === "text" ? (part.text ?? "") : ""))
            .join("");
        }
        return {
          role: m.role,
          content: content,
        };
      });

    // Force chat completions endpoint (not responses API) via .chat() — openrouter/free compatible
    const result = await streamText({
      model: openrouter.chat("openrouter/free"),
      system: systemPrompt,
      messages: modelMessages,
      temperature: 0.1,
      stopWhen: stepCountIs(3),
      tools: {
        search_philippine_law: tool({
          description:
            "Search official Philippine legal sources on the web (e.g. lawphil.net, officialgazette.gov.ph).",
          parameters: z.object({
            query: z
              .string()
              .describe("The legal concept, law, or case to search for."),
          }),
          // @ts-expect-error - Typescript struggles with execute typings when returned from tool
          execute: async ({ query }) => {
            const apiKey = process.env.TAVILY_API_KEY;
            if (!apiKey) {
              throw new Error("TAVILY_API_KEY is not set in the environment.");
            }

            // We append site restrictions to focus on official/trusted Philippine sources
            const enforcedQuery = `${query} (site:lawphil.net OR site:officialgazette.gov.ph OR site:elibrary.judiciary.gov.ph OR site:chanrobles.com)`;

            const response = await fetch("https://api.tavily.com/search", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                api_key: apiKey,
                query: enforcedQuery,
                search_depth: "basic",
                include_answer: false,
                include_raw_content: false,
                max_results: 5,
              }),
            });

            if (!response.ok) {
              console.error("[Tavily] Search failed:", await response.text());
              throw new Error("Search failed.");
            }

            const data = await response.json();
            return {
              results: data.results.map((r: any) => ({
                title: r.title,
                url: r.url,
                content: r.content,
              })),
            };
          },
        }),
      },
      async onFinish({ text }) {
        try {
          const { data: session } = await supabaseAdmin
            .from("chat_sessions")
            .insert({
              title: queryText.slice(0, 100),
              user_id: userId,
            })
            .select("id")
            .single();

          if (session) {
            await supabaseAdmin.from("chat_messages").insert([
              {
                session_id: session.id,
                role: "user",
                content: queryText,
                retrieved_chunk_ids: null, // No longer applicable
              },
              {
                session_id: session.id,
                role: "assistant",
                content: text,
                retrieved_chunk_ids: null,
              },
            ]);
            console.log(`[chat] Saved session ${session.id}`);
          }
        } catch (saveErr) {
          console.error("[chat] Failed to save history:", saveErr);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("RAG Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
