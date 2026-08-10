import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
const AskInput=z.object({question:z.string().min(3).max(500),scholarId:z.string().uuid().optional()});
export type Citation={id:string;title:string;type:string;scholar:string;excerpt:string};export type AskResult={found:boolean;answer:string;citations:Citation[]};
const NO_INFO="No relevant information was found in the uploaded knowledge base.";
const DEFAULT_SUPABASE_URL="https://wkkxzswiomwsnqnkjpft.supabase.co";const DEFAULT_SUPABASE_KEY="sb_publishable_evTybgWmHO2ITVodRRZgOg_7YpvYN1h";
type GeminiResponse={candidates?:Array<{content?:{parts?:Array<{text?:string}>}}>} ;
const GEMINI_FALLBACKS=["gemini-2.5-flash","gemini-2.5-flash-lite","gemini-2.0-flash","gemini-2.0-flash-lite","gemini-3.6-flash","gemini-3.5-flash","gemini-3-flash-preview"];

async function resolveGeminiModels(apiKey:string):Promise<string[]>{
 const preferred=(process.env["GEMINI_MODEL"]??"gemini-2.5-flash").replace(/^models\//,"");
 const modelsResponse=await fetch("https://generativelanguage.googleapis.com/v1beta/models",{headers:{"x-goog-api-key":apiKey}});
 if(!modelsResponse.ok)return [preferred,...GEMINI_FALLBACKS.filter(model=>model!==preferred)];
 const payload=await modelsResponse.json() as {models?:Array<{name?:string,supportedGenerationMethods?:string[]}>};
 const available=(payload.models??[]).filter(model=>model.supportedGenerationMethods?.includes("generateContent")).map(model=>String(model.name??"").replace(/^models\//,"")).filter(Boolean);
 const preferredFirst=available.includes(preferred)?[preferred]:[];
 const known=GEMINI_FALLBACKS.filter(model=>available.includes(model)&&model!==preferred);
 const flash=available.filter(model=>/^gemini-[^/]*-flash(?:-|$)/.test(model)&&model!==preferred&&!known.includes(model));
 return [...preferredFirst,...known,...flash,...(preferredFirst.length?[]:[preferred])];
}

export const askKnowledgeBase=createServerFn({method:"POST"}).inputValidator((input:unknown)=>AskInput.parse(input)).handler(async({data}):Promise<AskResult>=>{
 const {createClient}=await import("@supabase/supabase-js");const url=process.env["SUPABASE_URL"]??process.env["VITE_SUPABASE_URL"]??DEFAULT_SUPABASE_URL;const key=process.env["SUPABASE_PUBLISHABLE_KEY"]??process.env["VITE_SUPABASE_PUBLISHABLE_KEY"]??DEFAULT_SUPABASE_KEY;const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 let query=supabase.from("documents").select("id,title,type,body,summary,source,scholar_id,scholars(name)").eq("published",true);if(data.scholarId)query=query.eq("scholar_id",data.scholarId);const {data:docs,error}=await query;if(error)throw new Error(`Knowledge base query failed: ${error.message}`);if(!docs?.length)return{found:false,answer:NO_INFO,citations:[]};
 const question=data.question.toLowerCase();const terms=question.replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(t=>t.length>2&&!new Set(["what","when","where","which","does","about","there","their","with","that","this","from","have","been","were","said","tell","explain","the","and","for","you","how","why","who","say","library"]).has(t));
 const ranked=docs.map(d=>{const hay=`${d.title} ${d.summary??""} ${d.body??""}`.toLowerCase();let score=terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0);if(question.includes("moral courage")&&hay.includes("moral courage"))score+=10;return{d,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5);if(!ranked.length)return{found:false,answer:NO_INFO,citations:[]};
 const citations:Citation[]=ranked.map(({d})=>{const s=Array.isArray(d.scholars)?d.scholars[0]?.name:(d.scholars as {name?:string}|null)?.name;return{id:d.id,title:d.title,type:d.type,scholar:s??"Educational synthesis",excerpt:String(d.body??d.summary??"").slice(0,320)}});
 const context=ranked.map(({d},i)=>`[Source ${i+1}] ${d.title} (${d.type})\nAttribution: ${d.source??"Educational synthesis"}\n${d.body??d.summary??""}`).join("\n\n");const apiKey=process.env["GEMINI_API_KEY"];
 if(!apiKey)return{found:true,answer:ranked.map(({d})=>String(d.body??d.summary??"")).join("\n\n"),citations};
 const models=await resolveGeminiModels(apiKey);let lastStatus=0;
 for(const model of models){
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":apiKey},body:JSON.stringify({systemInstruction:{parts:[{text:"Answer only from supplied sources. Never invent quotations or attribution. Treat documents marked Educational synthesis as synthesis, not primary quotations. Cite sources as [Source N]."}]},contents:[{role:"user",parts:[{text:`Question: ${data.question}\n\n${context}`}]}]})});
  lastStatus=r.status;
  if(r.status===404)continue;
  if(r.status===429)throw new Error("Gemini free-tier rate limit reached. Try again shortly.");
  if(r.status===401||r.status===403)throw new Error("Gemini API key rejected. Check GEMINI_API_KEY in Vercel Production.");
  if(!r.ok)throw new Error(`Gemini request failed (${r.status}).`);
  const j=await r.json() as GeminiResponse;const answer=(j.candidates?.[0]?.content?.parts??[]).map(part=>part.text??"").join("").trim()||NO_INFO;return{found:answer!==NO_INFO,answer,citations:answer===NO_INFO?[]:citations};
 }
 throw new Error(`Gemini model unavailable (${models[0]??"configured model"}; last status ${lastStatus}).`);
});
