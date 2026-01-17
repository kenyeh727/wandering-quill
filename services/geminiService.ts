import { createClient } from "@google/genai";
import { CoverLetterData, Source, AnalysisResult } from "../types";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is missing!");
  }
  return createClient({
    apiKey: apiKey || 'dummy-key',
  });
};

const modelId = "gemini-1.5-flash";

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

    const prompt = `Read the following Job Vacancy (Markdown) and extract the Company Name and Full Job Description. Truncated Content: ${pageMarkdown.substring(0, 10000)}\n\nFormat: Return ONLY a valid JSON object: {"companyName": "...", "jobDescription": "..."}`;

    const client = getClient();
    const result = await client.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = result.value.text() || "{}";
    const parsed = JSON.parse(cleanJson(text));

    return {
      companyName: parsed.companyName || "",
      jobDescription: parsed.jobDescription || ""
    };
  } catch (error) {
    console.error("URL Extraction Error:", error);
    throw new Error("Unable to extract job details. Please paste manually.");
  }
};

export const analyzeJobFit = async (data: CoverLetterData): Promise<AnalysisResult> => {
  const prompt = `Analyze compatibility:
    Candidate: ${data.candidateName}
    Education: ${data.education}
    Resume: ${data.resumeText}
    Job: ${data.jobDescription}

    Return JSON: {"score": 0-100, "pros": ["...", "...", "..."], "cons": ["...", "..."], "verdict": "..."}`;

  try {
    const client = getClient();
    const result = await client.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const text = result.value.text() || "{}";
    const parsed = JSON.parse(cleanJson(text));

    return {
      score: parsed.score || 0,
      pros: parsed.pros || ["General fit."],
      cons: parsed.cons || ["Review details."],
      verdict: parsed.verdict || "Analysis completed."
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      score: 50,
      pros: ["Technical issue occurred."],
      cons: ["Check API configuration."],
      verdict: "The stars were cloudy."
    };
  }
};

export const tailorResume = async (data: CoverLetterData): Promise<string> => {
  const prompt = `Tailor CV for ${data.candidateName} at ${data.companyName}. JD: ${data.jobDescription}. Base: ${data.resumeText}. Language: ${data.language}.`;

  try {
    const client = getClient();
    const result = await client.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return result.value.text() || "Failed to tailor.";
  } catch (error) {
    console.error("Tailor Error:", error);
    return "Failed to tailor resume.";
  }
};

export const generateCoverLetter = async (data: CoverLetterData): Promise<{ content: string, sources: Source[] }> => {
  const prompt = `Write a cover letter for ${data.candidateName} to ${data.companyName}. Use ${data.tone} tone and ${data.language} language. JD: ${data.jobDescription}. Resume: ${data.resumeText}. ${data.revisionInstructions ? `Notes: ${data.revisionInstructions}` : ''}`;

  try {
    const client = getClient();
    const result = await client.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { tools: [{ googleSearch: {} }] }
    });

    const content = result.value.text() || "Failed to generate.";
    const sources: Source[] = [];

    // In @google/genai, grounding metadata is handled via dedicated properties if available
    // But result.value contains the full response
    const groundingMetadata = (result.value as any).candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({ title: chunk.web.title || "Reference", uri: chunk.web.uri });
        }
      });
    }

    return { content, sources };
  } catch (error) {
    console.error("Letter Error:", error);
    throw new Error("Failed to generate cover letter.");
  }
};