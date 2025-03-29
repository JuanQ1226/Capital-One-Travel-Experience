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
    const { startDate, endDate, budget, purpose, destination, hotelName} = req.body;
    
    // Here you would typically make a call to an LLM API like OpenAI
    // This is a mock response for demonstration purposes

    const Agent = new LLM();
    let parsedTrans;

    for (let i = 0; i < 3; i++) {
      const Transportation = await Agent.getTransportation(budget, purpose, startDate, endDate, destination, hotelName);
      if (Transportation) {
        try {
          const jsonMatch = Transportation.match(/{[\s\S]*}/);
          if (jsonMatch){
            parsedTrans = JSON.parse(jsonMatch[0]);
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
    

    if (!parsedTrans) {
      return res.status(500).json({ error: 'Failed to generate itinerary' });
    }

    
    return res.status(200).json(parsedTrans);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}