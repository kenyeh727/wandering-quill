import { GoogleGenAI, Type } from "@google/genai";
import { CoverLetterData, GenerationResult, Source, AnalysisResult } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. Gemini features will fail.");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
};

const modelId = "gemini-2.0-flash-exp";

// Helper to clean JSON string if model wraps it in markdown
const cleanJson = (text: string): string => {
  if (!text) return "{}";
  let clean = text.trim();
  // Remove markdown code blocks (```json ... ```)
  clean = clean.replace(/```json/g, '').replace(/```/g, '');
  return clean.trim();
};

export const extractJobDescriptionFromUrl = async (url: string): Promise<{ companyName: string, jobDescription: string }> => {
  const prompt = `
    Role: Web Reader.
    Task: Read the content from the following URL: ${url}
    
    Goal: Extract the Company Name and the Job Description text.
    
    Instructions:
    1. Use the search tool to find the page content for this specific URL.
    2. Extract the Company Name.
    3. Extract the full job description (About the role, Requirements, Responsibilities).
    4. Return valid JSON.
    5. If you cannot access the content or if it requires a login that prevents reading the description, return "ACCESS_DENIED" in the jobDescription field.
  `;

  try {
    const response = await getAI().models.generateContent({
      model: modelId,
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            jobDescription: { type: Type.STRING },
          }
        }
      }
    });

    const jsonText = cleanJson(response.text || "{}");
    const parsed = JSON.parse(jsonText);

    const text = parsed.jobDescription?.trim();
    if (!text || text.includes("ACCESS_DENIED") || text.length < 20) {
      throw new Error("Cannot access URL");
    }
    return {
      companyName: parsed.companyName?.trim() || "",
      jobDescription: text
    };
  } catch (error) {
    console.error("URL Extraction Error:", error);
    throw error;
  }
};

export const analyzeJobFit = async (data: CoverLetterData): Promise<AnalysisResult> => {
  const prompt = `
    Role: Career Consultant.
    Task: Analyze the compatibility between the candidate's background and the job description.
    
    Candidate Background:
    Name: ${data.candidateName}
    Education: ${data.education || "Not specified"}
    Research/Thesis: ${data.researchProjects || "Not specified"}
    
    Resume Content:
    ${data.resumeText}

    Job Description:
    ${data.jobDescription}

    Instructions:
    1. Analyze the match between the candidate and the job.
    2. **CRITICAL LOCATION/VISA RULE**: 
       - **OUTSIDE GERMANY**: 
         - If the role is located **outside of Germany** AND the Job Description **EXPLICITLY STATES** that the candidate must *already* possess a work permit/right to work or that visa sponsorship is **NOT** available, you **MUST** limit the 'score' to be **below 75**. Include "Strict Visa/Work Permit requirements (Outside Germany)" in 'cons'.
         - If the Job Description is **SILENT** regarding visas or work permits, **DO NOT** penalize the score based on location (assume sponsorship might be possible).
       - **INSIDE GERMANY**: If the role is located **in Germany**, asking for a valid work permit is **ACCEPTABLE** (Assume the candidate HAS a German work permit). Do NOT penalize for this.
    3. RETURN ONLY RAW JSON. No Markdown.
    4. 'score': 0-100 based on keyword matching and the Critical Rule above.
    5. 'pros': List exactly 3 specific strengths matching the JD.
    6. 'cons': List exactly 2 specific missing skills, potential risks, or areas for improvement.
    7. 'verdict': A 1-2 sentence summary of the fit.
  `;

  try {
    const response = await getAI().models.generateContent({
      model: modelId,
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = cleanJson(response.text || "{}");
    console.log("Analysis Raw Response:", jsonText);
    const parsed = JSON.parse(jsonText);

    return {
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      pros: Array.isArray(parsed.pros) && parsed.pros.length > 0 ? parsed.pros : ["General fit assessed.", "Check resume against requirements."],
      cons: Array.isArray(parsed.cons) && parsed.cons.length > 0 ? parsed.cons : ["No critical gaps found.", "Review specific tool requirements."],
      verdict: parsed.verdict || "Analysis completed."
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      score: 50,
      pros: ["Could not parse detailed analysis.", "Please review manually."],
      cons: ["Analysis unavailable due to technical hiccup."],
      verdict: "The stars were cloudy. Proceed with your own judgment."
    };
  }
};

export const tailorResume = async (data: CoverLetterData): Promise<string> => {
  // We now enable Search for the Resume as well, to nail the "Professional Summary"
  const promptText = `
    Role: Strategic Career Coach & Expert Human Storyteller.
    Task: Create a highly tailored, concise Resume/CV for the candidate targeting a specific job.

    INPUTS:
    Candidate Name: ${data.candidateName}
    Target Company: ${data.companyName}
    Target Job Description: ${data.jobDescription}
    
    CANDIDATE'S DATABASE (Source Material):
    [Education]
    ${data.education}
    
    [Research & Projects]
    ${data.researchProjects}
    
    [Professional History]
    ${data.resumeText}

    STEP 1: RESEARCH
    - Search for ${data.companyName}'s mission statement, core values, and recent major projects or news.
    - Identify key themes (e.g., sustainability, innovation, community, speed).

    STEP 2: WRITE THE RESUME
    
    1. **Professional Summary (The Hook)**:
       - Write a 3-4 line summary.
       - **CRITICAL**: Do NOT just summarize the past. Connect the candidate's background to the COMPANY'S MISSION found in your research. 
       - Example tone: "Combining [Candidate Skill] with a passion for [Company Value], aiming to accelerate [Company Name]'s growth in [Sector]."
    
    2. **Experience Selection (The Rule of 3)**: 
       - Select ONLY the **top 3** professional experiences that are most relevant to the Target Job. 
       - Omit older or irrelevant roles to reduce noise.

    3. **Rephrase & Humanize**:
       - Rewrite the bullet points to demonstrate how the candidate can help the company GROW.
       - **Tone Check**: Personal, authentic, professional. No robotic cliches.
       - Use bullet points (*).

    4. **Formatting (Markdown)**:
       - Start with ## Professional Summary.
       - Use ## headers for sections.
       - Use ### headers for Job Titles/Companies.
       - Keep it clean.
    
    5. **Language**: Use ${data.language}.
  `;

  try {
    const response = await getAI().models.generateContent({
      model: modelId,
      contents: { role: 'user', parts: [{ text: promptText }] },
      config: {
        temperature: 0.7,
        tools: [{ googleSearch: {} }] // Enable search for the resume too
      }
    });
    return response.text || "Could not generate tailored resume.";
  } catch (error) {
    console.error("Resume Tailoring Error:", error);
    return "Failed to tailor resume.";
  }
};

export const generateCoverLetter = async (data: CoverLetterData): Promise<{ content: string, sources: Source[] }> => {
  let promptText = `
    You are an expert career coach. Write a cover letter.

    INPUTS:
    Candidate: ${data.candidateName || "[Name]"}
    Company: ${data.companyName || "[Company]"}
    Language: ${data.language}
    Tone: ${data.tone}
    
    BACKGROUND:
    Education: ${data.education}
    Research: ${data.researchProjects}
    Resume: ${data.resumeText}
    Job Description: ${data.jobDescription}

    ${data.revisionInstructions ? `
    ********************************************************
    IMPORTANT REVISION INSTRUCTIONS FROM USER:
    The user wants you to rewrite the letter with these specific goals:
    "${data.revisionInstructions}"
    
    Please strictly adhere to these new instructions while maintaining the quality of the letter.
    ********************************************************
    ` : ''}

    PHASE 1: DEEP RESEARCH
    - Search for ${data.companyName} on the web.
    - Find their specific **Mission Statement**, **Recent News/Press Releases**, and **Company Culture**.
    - Find a specific problem or initiative they are currently facing.

    PHASE 2: DRAFTING
    - Write a cover letter that focuses on **"Growing Together"**.
    - **Introduction**: Don't just say "I am applying." Mention a specific recent achievement of the company or their mission that excites the candidate.
    - **Body**: Connect the candidate's *specific* past achievements (from the provided Resume/Research) to the company's *future* goals. "I can help you achieve X because I did Y."
    - **Research Integration**: Explicitly mention how the candidate's values align with the research findings (e.g., "I admire your commitment to [Value found in search]...").
    - **Conclusion**: Reiterate enthusiasm for contributing to their specific growth trajectory.

    FORMAT:
    - Standard Letter Formatting (Markdown).
    - Human, engaging, not robotic.
  `;

  if (data.writingSample) {
    promptText += `\nSTYLE MIMICRY: "${data.writingSample}"`;
  }

  try {
    const response = await getAI().models.generateContent({
      model: modelId,
      contents: { role: 'user', parts: [{ text: promptText }] },
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      }
    });

    const content = response.text || "Failed to generate content.";

    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    return { content, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate cover letter.");
  }
};