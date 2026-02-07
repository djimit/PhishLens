
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, SimulationConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SCAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isPhishing: { type: Type.BOOLEAN },
    probability: { type: Type.NUMBER },
    reasoning: { type: Type.STRING },
    heatmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          char: { type: Type.STRING },
          weight: { type: Type.NUMBER },
          label: { type: Type.STRING }
        },
        required: ["char", "weight"]
      }
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        criticalFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
        adversarialDetected: { type: Type.BOOLEAN }
      },
      required: ["criticalFindings", "adversarialDetected"]
    }
  },
  required: ["isPhishing", "probability", "reasoning", "heatmap", "summary"]
};

export const scanEmailContent = async (text: string, config: SimulationConfig): Promise<ScanResult> => {
  const prompt = `
    Act as a CharGRU (Character Gated Recurrent Unit) Phishing Detection model with Grad-CAM visualization capability.
    
    Email Content: 
    """
    ${text}
    """
    
    Adversarial Training Mode: ${config.adversarialEnabled ? "ACTIVE" : "INACTIVE"}
    
    Tasks:
    1. Perform character-level analysis. 
    2. Identify if this is a phishing email.
    3. If Adversarial Mode is ACTIVE, look specifically for lookalike characters (e.g., 'v1sa' instead of 'visa', 'pay-pa1' instead of 'paypal') and determine if they are malicious attempts to bypass filters.
    4. Generate a 'heatmap' which is a list of characters from the original text, each assigned a weight (0.0 to 1.0) based on how much it contributed to the "Phishing" classification.
    5. High weights should be given to:
       - Suspicious domain patterns
       - Urgency triggers
       - Misspellings or lookalike substitutions
       - Mismatched links
    6. Provide a short professional reasoning.
    
    Return the response strictly as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SCAN_SCHEMA,
        temperature: 0.1, // More deterministic for "model" behavior
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as ScanResult;
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    throw new Error("Failed to analyze content. Please ensure your API key is valid.");
  }
};
