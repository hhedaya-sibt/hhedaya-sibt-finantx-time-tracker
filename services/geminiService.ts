import { GoogleGenAI } from "@google/genai";
import { Employee, Supervisor } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEmailDraft = async (
  supervisor: Supervisor,
  weekStartDate: string,
  employees: Employee[],
  sheetData: any[] // The raw data rows
): Promise<{ subject: string; body: string }> => {
  const client = getClient();
  if (!client) {
    return { 
      subject: `Hours Submission - Week of ${weekStartDate}`, 
      body: "API Key missing. Please copy the data from the dashboard manually." 
    };
  }

  // Convert sheet data to a readable string for the prompt
  const dataString = JSON.stringify(sheetData, null, 2);

  const prompt = `
    You are an administrative assistant for Finantx, Inc.
    Create a professional email draft for submitting weekly contractor hours.
    
    Context:
    - Supervisor: ${supervisor.firstName} ${supervisor.lastName}
    - Week Starting: ${weekStartDate}
    - Recipient: Super Admin
    
    Data to summarize:
    ${dataString}

    Requirements:
    1. Subject Line: Professional, including "Week of [Date]" and Department names.
    2. Body: Polite, concise. Include a summary table in plain text format (using | for columns or careful spacing) showing Employee Name, Department, and Total Hours. 
    3. Mention that the full data has been recorded in the company records.
    4. Do not include placeholders like "[Your Name]". Use the supervisor's name provided.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Simple parsing - expecting the model to return subject and body or just the text. 
    // We'll wrap the whole response as body for safety and generate a standard subject.
    return {
      subject: `Weekly Hours Submission - ${weekStartDate} - ${supervisor.firstName} ${supervisor.lastName}`,
      body: response.text || "Could not generate email body."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      subject: `Weekly Hours Submission - ${weekStartDate}`,
      body: "Error generating AI summary. Please attach the hours report manually."
    };
  }
};
