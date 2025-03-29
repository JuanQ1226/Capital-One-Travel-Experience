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
    const { destination, arrivaltime,startDate, endDate, budget, accomodationName, accomodationLocation } = req.body;
    
    // Here you would typically make a call to an LLM API like OpenAI
    // This is a mock response for demonstration purposes

    const Agent = new LLM();
    let parsedItenary;

    for (let i = 0; i < 5; i++) {
      const Ite = await Agent.getItenary(destination, arrivaltime,startDate, endDate, budget, accomodationName, accomodationLocation);
      if (Ite) {
        try {
          const jsonMatch = Ite.match(/{[\s\S]*}/);
          if (jsonMatch){
            parsedItenary = JSON.parse(jsonMatch[0]);
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
    

    if (!parsedItenary) {
      return res.status(500).json({ error: 'Failed to generate itinerary' });
    }

    
    return res.status(200).json(parsedItenary);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}