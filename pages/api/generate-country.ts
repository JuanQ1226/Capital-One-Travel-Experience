import type { NextApiRequest, NextApiResponse } from 'next';
import {LLM} from '../../LLM_Utils/LLM'

type ItineraryData = {
  destination: string;
  activities: string[];
  accommodations: string[];
  transportation: string[];
  totalCost: number;
  recommendations: string[];
}

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

    const Country = await Agent.getCountry(budget);

    
    return res.status(200).json(Country);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}