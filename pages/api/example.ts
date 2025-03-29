// pages/api/positive-news.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

class NewsFetcher {
  private client: OpenAI;

  constructor() {
    const apiKeyText = process.env.OPENAI_API_KEY;
    if (!apiKeyText) {
      throw new Error("OPENAI_API_KEY is not set in the environment variables.");
    }
    this.client = new OpenAI({ apiKey: apiKeyText });
  }

  async getPositiveNews(): Promise<string | null> {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const newsFetcher = new NewsFetcher();
    const news = await newsFetcher.getPositiveNews();

    if (news) {
      res.status(200).json({ news });
    } else {
      res.status(500).json({ error: "Failed to retrieve positive news." });
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}