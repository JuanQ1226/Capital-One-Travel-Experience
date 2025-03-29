import type { NextApiRequest, NextApiResponse } from 'next';
import {LLM} from '../../LLM_Utils/LLM'

type DestinationData = {
  name: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  weather: string;
  currency: string;
  language: string;
  imageUrl: string;
  safetyInfo: string;
  visaRequirements: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { startDate, endDate, budget, purpose } = req.body;
    
    // Here you would typically make a call to an LLM API like OpenAI
    // This is a mock response for demonstration purposes

    const Agent = new LLM();
    let parsedCountry;
    let hasNotFound = true;

    for (let i = 0; i < 3; i++) {
      const Country = await Agent.getCountry(budget, purpose, startDate, endDate);
      if (Country) {
        parsedCountry = JSON.parse(Country);
        hasNotFound = false;
        break;
      }
    }
    

    if (!parsedCountry || hasNotFound) {
      return res.status(500).json({ error: 'Failed to generate itinerary' });
    }

    
    return res.status(200).json(parsedCountry);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}