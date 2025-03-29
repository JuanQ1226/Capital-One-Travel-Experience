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
    const { startDate, endDate, budget, purpose, country} = req.body;
    
    
    const Agent = new LLM();
    let ParsedAcomodations;
    let hasNotFound = true;

    for (let i = 0; i < 3; i++) {
      const result = await Agent.getAccomodations(budget, purpose, startDate, endDate,country);
      if (result) {
        try {
          const jsonMatch = result.match(/{[\s\S]*}/);
          if (jsonMatch){
            ParsedAcomodations = JSON.parse(jsonMatch[0]);
            break
          }
          continue
    
        } 
        catch (error) {
          console.error('Error parsing JSON:', error);
          continue;
        }
        hasNotFound = false;
        break;
      }
    }

    if (!ParsedAcomodations || hasNotFound) {
      return res.status(500).json({ error: 'Failed to generate itinerary' });
    }
    
    return res.status(200).json(ParsedAcomodations);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}