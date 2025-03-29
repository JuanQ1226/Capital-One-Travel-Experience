import type { NextApiRequest, NextApiResponse } from 'next';
import {LLM} from '../../LLM_Utils/LLM'


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

    for (let i = 0; i < 3; i++) {
      const Country = await Agent.getCountry(budget, purpose, startDate, endDate);
      if (Country) {
        try {
          const jsonMatch = Country.match(/{[\s\S]*}/);
          if (jsonMatch){
            parsedCountry = JSON.parse(jsonMatch[0]);
            break
          }
          continue
        } 
        catch (error) {
          console.error('Error parsing JSON:', error);
          continue;
        }
      }
    }
    

    if (!parsedCountry) {
      return res.status(500).json({ error: 'Failed to generate itinerary' });
    }

    
    return res.status(200).json(parsedCountry);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}