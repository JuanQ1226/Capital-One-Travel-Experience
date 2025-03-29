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
    const { destination, arrivalTime,startDate, endDate, budget, accomodationName, accomodationLocation } = req.body;
    
    // Here you would typically make a call to an LLM API like OpenAI
    // This is a mock response for demonstration purposes

    const Agent = new LLM();
    let parsedActivity;

    for (let i = 0; i < 10; i++) {
      const Active = await Agent.getActivities(destination, arrivalTime,startDate, endDate, budget, accomodationName, accomodationLocation);
      if (Active) {
        try {
          const jsonMatch = Active.match(/{[\s\S]*}/);
          if (jsonMatch){
            parsedActivity = JSON.parse(jsonMatch[0]);
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
    

    if (!parsedActivity) {
      return res.status(500).json({ error: 'Failed to generate itinerary' });
    }

    
    return res.status(200).json(parsedActivity);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}