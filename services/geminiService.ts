import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  try {
    // Prepare a summarized prompt to avoid token limits if many transactions
    const transactionSummary = JSON.stringify(transactions.slice(0, 50)); // Analyze last 50 for speed

    const prompt = `
      Act as a financial advisor. Here is a list of my recent transactions:
      ${transactionSummary}

      Please provide a brief, 3-bullet point summary of my financial health and one actionable tip to save money.
      Keep it encouraging and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to AI advisor. Please check your API key.";
  }
};