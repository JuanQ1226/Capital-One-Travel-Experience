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

  async getCountry(): Promise<string | null> {
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
