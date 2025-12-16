import { GoogleGenAI } from "@google/genai";
import { ProductType } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const getGeminiStyleAdvice = async (
  username: string,
  product: ProductType
): Promise<string> => {
  try {
    const prompt = `
      You are a friendly, pastel-loving fashion stylist for a brand called ADOREMY. 
      The user, ${username}, is designing a custom ${product}.
      Give a very short, creative, and cute suggestion for a color combination or a slogan they could put on it.
      Keep it under 30 words. Tone: Cheerful, Gen Z, Aesthetic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Try combining Mint and Pink for a fresh look!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops, our stylist is on a break. Try Cream and Peach!";
  }
};
