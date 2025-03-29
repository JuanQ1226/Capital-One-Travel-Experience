import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const apiKeyText = process.env.OPENAI_API_KEY;


const client = new OpenAI({apiKey: apiKeyText});

const response = await client.responses.create({
    model: "gpt-4o",
    tools: [ { type: "web_search_preview" } ],
    input: "What was a positive news story from today?",
});

console.log(response.output_text);