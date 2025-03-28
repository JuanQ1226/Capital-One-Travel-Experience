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

    for (let i = 0; i < 5; i++) {
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

      }
    }

    // Search and add photo for each accomodation
    await Promise.all(ParsedAcomodations.options.map(async (option: any) => {
      const query = `${option.name} ${country}`;
      const accomodationSearch = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?input=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
      const accomodationSearchData = await accomodationSearch.json();
      const accomodationDetails = accomodationSearchData.results[0];
      const photoReference = accomodationDetails?.photos?.[0]?.photo_reference;

      if (photoReference) {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        option.imageUrl = url;
      }
      return option;
    }));

   
    if (!ParsedAcomodations) {
      return res.status(500).json({ error: 'Failed to generate itinerary' });
    }
    
    return res.status(200).json(ParsedAcomodations);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}