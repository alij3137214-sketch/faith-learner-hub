import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AskInput = z.object({ question: z.string().min(3).max(500), scholarId: z.string().uuid().optional() });
export type Citation = { id: string; title: string; type: string; scholar: string; excerpt: string };
export type AskResult = { found: boolean; answer: string; citations: Citation[] };
const NO_INFO = "No relevant information was found in the uploaded knowledge base.";
const DEFAULT_SUPABASE_URL = "https://wkkxzswiomwsnqnkjpft.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_evTybgWmHO2ITVodRRZgOg_7YpvYN1h";

export const askKnowledgeBase = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }): Promise<AskResult> => {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"] ?? DEFAULT_SUPABASE_URL;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? DEFAULT_SUPABASE_KEY;
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

    let query = supabase.from("documents").select("id, title, type, body, summary, source, scholars(name)").eq("published", true);
    if (data.scholarId) query = query.eq("scholar_id", data.scholarId);
    const { data: docs, error } = await query;
    if (error || !docs?.length) return { found: false, answer: NO_INFO, citations: [] };

    const stop = new Set(["what","when","where","which","does","about","there","their","with","that","this","from","have","been","were","said","tell","explain","the","and","for","you","how","why","who"]);
    const terms = data.question.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 3 && !stop.has(t));
    if (!terms.length) return { found: false, answer: NO_INFO, citations: [] };

    type Chunk = { doc: (typeof docs)[number]; text: string; score: number };
    const chunks: Chunk[] = [];
    for (const doc of docs) {
      const paras = String(doc.body ?? "").split(/\n{2,}/).map((p) => p.trim()).filter((p) => p.length > 40);
      for (const text of [doc.summary ?? "", ...paras].filter(Boolean)) {
        const lower = text.toLowerCase(); let score = 0;
        for (const t of terms) { const hits = lower.split(t).length - 1; if (hits) score += 1 + Math.min(hits, 3) * 0.4; }
        if (String(doc.title).toLowerCase().includes(terms[0]!)) score += 1.2;
        if (score > 0) chunks.push({ doc, text, score });
      }
    }
    chunks.sort((a, b) => b.score - a.score);
    const top = chunks.slice(0, 5);
    if (!top.length || top[0]!.score < 1.2) return { found: false, answer: NO_INFO, citations: [] };

    const citations: Citation[] = [];
    for (const chunk of top) {
      if (citations.some((c) => c.id === chunk.doc.id)) continue;
      const scholar = Array.isArray(chunk.doc.scholars) ? chunk.doc.scholars[0]?.name : (chunk.doc.scholars as { name?: string } | null)?.name;
      citations.push({ id: chunk.doc.id, title: chunk.doc.title, type: chunk.doc.type, scholar: scholar ?? "Source library", excerpt: chunk.text.slice(0, 320) });
    }
    const context = top.map((c, i) => `[Source ${i + 1}] "${c.doc.title}" (${c.doc.type})\n${c.text}`).join("\n\n");
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { found: true, answer: "I found these relevant passages in the source library:\n\n" + top.map((c) => c.text).join("\n\n"), citations };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "google/gemini-3.6-flash", messages: [
        { role: "system", content: "You explain retrieved source passages for an Islamic knowledge library. Use ONLY the provided passages. Never invent quotations or outside facts. Reference sources as [Source N]. If the passages do not answer the question, reply exactly: " + NO_INFO + ". Write plainly in 2-4 short paragraphs." },
        { role: "user", content: `Question: ${data.question}\n\nSource passages:\n${context}` },
      ] }),
    });
    if (res.status === 429) throw new Error("The assistant is busy right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits have run out. Please add credits to continue.");
    if (!res.ok) return { found: true, answer: "I found these relevant passages:\n\n" + top.map((c) => c.text).join("\n\n"), citations };
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const answer = json.choices?.[0]?.message?.content?.trim() || NO_INFO;
    if (answer === NO_INFO) return { found: false, answer: NO_INFO, citations: [] };
    return { found: true, answer, citations };
  });
