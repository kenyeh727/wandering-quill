import { GoogleGenerativeAI } from "@google/generative-ai";
import { CoverLetterData, Source, AnalysisResult } from "../types";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is missing! Check your environment variables.");
  }
  return new GoogleGenerativeAI(apiKey || 'dummy-key');
};

const modelId = "gemini-2.5-flash-lite";

const cleanJson = (text: string): string => {
  if (!text) return "{}";
  let clean = text.trim();
  if (clean.includes("```")) {
    clean = clean.replace(/```json/g, '').replace(/```/g, '');
  }
  return clean.trim();
};

export const extractJobDescriptionFromUrl = async (url: string): Promise<{ companyName: string, jobDescription: string }> => {
  try {
    const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`;
    const fetchResponse = await fetch(jinaUrl);
    if (!fetchResponse.ok) throw new Error("Failed to fetch scroll content.");
    const pageMarkdown = await fetchResponse.text();

    const prompt = `Extract company name and job description from this markdown. Return ONLY valid JSON: {"companyName": "...", "jobDescription": "..."}\n\nContent:\n${pageMarkdown.substring(0, 8000)}`;

    const model = getAI().getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(cleanJson(text));

    return {
      companyName: parsed.companyName || "",
      jobDescription: parsed.jobDescription || ""
    };
  } catch (error) {
    console.error("URL Extraction Error:", error);
    throw new Error("The magic faded. We couldn't read this scroll (URL). Please paste manually.");
  }
};

export const analyzeJobFit = async (data: CoverLetterData): Promise<AnalysisResult> => {
  const prompt = `Analyze fit between candidate and job. Return JSON: {"score": 0-100, "pros": ["...", "...", "..."], "cons": ["...", "..."], "verdict": "..."}\n\nCandidate: ${data.candidateName}\nResume: ${data.resumeText}\nJob: ${data.jobDescription}`;

  try {
    const model = getAI().getGenerativeModel({
      model: modelId,
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(cleanJson(text));

    return {
      score: parsed.score || 0,
      pros: parsed.pros || ["General fit."],
      cons: parsed.cons || ["Review details."],
      verdict: parsed.verdict || "Analysis completed."
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return { score: 50, pros: ["Technical error."], cons: ["Check settings."], verdict: "Retry please." };
  }
};

export const tailorResume = async (data: CoverLetterData): Promise<string> => {
  const prompt = `Tailor CV for ${data.candidateName} at ${data.companyName}. JD: ${data.jobDescription}. Base: ${data.resumeText}. Language: ${data.language}.`;

  try {
    const model = getAI().getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Tailor Error:", error);
    return "Failed to tailor.";
  }
};

export const generateCoverLetter = async (data: CoverLetterData): Promise<{ content: string, sources: Source[] }> => {
  const prompt = `Write a cover letter for ${data.candidateName} to ${data.companyName}. Tone: ${data.tone}. Language: ${data.language}. JD: ${data.jobDescription}. Resume: ${data.resumeText}.`;

  try {
    const model = getAI().getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    const sources: Source[] = [];

    return { content, sources };
  } catch (error) {
    console.error("Letter Error:", error);
    throw new Error("Failed to generate.");
  }
};