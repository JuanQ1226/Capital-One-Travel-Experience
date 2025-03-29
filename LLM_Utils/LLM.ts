import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

export class LLM {
  private client: OpenAI;

  constructor() {
    const apiKeyText = process.env.OPENAI_API_KEY;
    if (!apiKeyText) {
      throw new Error("OPENAI_API_KEY is not set in the environment variables.");
    }
    this.client = new OpenAI({ apiKey: apiKeyText });
  }

  async getCountry(budget: any,purpose: any, startDate: any, endDate: any): Promise<string | null> {
    try {
      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: `Based on the following information give me a country you would travel to: Budget:${budget} Purpose:${purpose} startDate:${startDate} endDate:${endDate} , Return one anwser, jsonify the answer, make sure it follows this format: {"name": "Country Name", "description": "Description of the country", "highlights": ["Highlight 1", "Highlight 2"], "bestTimeToVisit": "Best time to visit", "weather": "Weather information", "currency": "Currency used", "language": "Language spoken", "imageUrl": "URL of an Image of the country in the web", "safetyInfo": "Safety information", "visaRequirements": "Visa requirements"}, Return in plain text`,
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }

  async getAccomodations(): Promise<string | null> {
    try {
      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: "What was a positive news story from today?",
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }

  async getActivies(): Promise<string | null> {
    try {
      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: "What was a positive news story from today?",
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }


}
