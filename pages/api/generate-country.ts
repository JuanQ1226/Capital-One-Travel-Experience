import type { NextApiRequest, NextApiResponse } from "next";
import { LLM } from "../../LLM_Utils/LLM";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { startDate, endDate, budget, purpose } = req.body;

    // Here you would typically make a call to an LLM API like OpenAI
    // This is a mock response for demonstration purposes

    const Agent = new LLM();
    let parsedCountry;

    for (let i = 0; i < 5; i++) {
      const Country = await Agent.getCountry(
        budget,
        purpose,
        startDate,
        endDate
      );
      if (Country) {
        try {
          const jsonMatch = Country.match(/{[\s\S]*}/);
          if (jsonMatch) {
            parsedCountry = JSON.parse(jsonMatch[0]);
            break;
          }
          continue;
        } catch (error) {
          console.error("Error parsing JSON:", error);
          continue;
        }
      }
    }

    // Get the country name from the parsedCountry object
    const countryName = parsedCountry?.name;

    // Check if the country name is valid
    if (!countryName) {
      return res.status(400).json({ error: "Invalid country name" });
    }

    // Get the country details from google places API

    const countryDetails =
      await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${countryName}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    
    console.log(countryDetails);

    const countryDetailsData = await countryDetails.json();

    // Check if the API request was successful
    if (!countryDetails.ok) {
      return res.status(500).json({ error: "Failed to fetch country details" });
    }

    const countryDetailsResult = countryDetailsData.results[0];

    // Check if the country details were found
    if (!countryDetailsResult) {
      return res.status(404).json({ error: "Country not found" });
    }

    // Get photo reference
    const photoReference = countryDetailsResult.photos?.[0]?.photo_reference || "";


    // Check if the photo reference is valid
    if (!photoReference) {
      return res.status(400).json({ error: "Invalid photo reference" });
    }

    const countryPhoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;


    if (!parsedCountry) {
      return res.status(500).json({ error: "Failed to generate itinerary" });
    }

    return res.status(200).json({...parsedCountry, imageUrl: countryPhoto});
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return res.status(500).json({ error: "Failed to generate itinerary" });
  }
}
