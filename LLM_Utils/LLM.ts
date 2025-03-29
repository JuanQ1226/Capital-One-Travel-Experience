import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
export class LLM {
  private client: OpenAI;

  constructor();
  constructor(Countries: string, Activities: string);
  constructor(Countries?: string, Activities?: string) 
  {
    const apiKeyText = process.env.OPENAI_API_KEY;
    if (!apiKeyText) {
      throw new Error(
        "OPENAI_API_KEY is not set in the environment variables."
      );
    }
    this.client = new OpenAI({ apiKey: apiKeyText });
  }



    
  

  async getCountry(
    budget: any,
    purpose: any,
    startDate: any,
    endDate: any
  ): Promise<string | null> {
    try {
      

      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview_2025_03_11" }],
        tool_choice: "required",
        input: `Based on the following information give me a country you would travel to: Budget:${budget} Purpose:${purpose} startDate:${startDate} endDate:${endDate} previous most visited country : ${MostVisited}, Return one anwser, jsonify the answer, make sure it follows this format: {"name": "Country Name", "description": "Description of the country", "highlights": ["Highlight 1", "Highlight 2"], "bestTimeToVisit": "Best time to visit", "weather": "Weather information", "currency": "Currency used", "language": "Language spoken", "safetyInfo": "Safety information", "visaRequirements": "Visa requirements"}, Return just JSON without any additional text or explanation. Make sure the JSON is valid and properly formatted without any json tags or tildes used for formatting. The country should be a real country that exists in the world, and the information should be accurate and up-to-date.`,
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }

  async getAccomodations(
    budget: any,
    purpose: any,
    startDate: any,
    endDate: any,
    destination: any
  ): Promise<string | null> {
    try {
      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview_2025_03_11" }],
        tool_choice: "required",
        input: `You are a travel API that exclusively returns structured JSON data without any json tags or tildes used for formatting, just the plain JSON structure. Generate accommodation options for travelers visiting ${destination} based on their specific trip details.

Trip Details:
- Destination: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate} 
- Total Budget: ${budget}
- Trip Purpose: ${purpose}

Create a detailed JSON response with the following structure:
{
  "destination": "${destination}",
  "totalNights": {totalNights},
  "checkIn": "${startDate}",
  "checkOut": "${endDate}",
  "recommendedOption": 1,
  "options": [
    {
      "id": 1,
      "name": "Hotel Name",
      "description": "Detailed description of the accommodation highlighting its unique features and appeal.",
      "pricePerNight": 200,
      "totalPrice": 1000,
      "rating": 4.7,
      "location": "Neighborhood, City",
      "amenities": ["Free WiFi", "Pool", "Breakfast included", "Fitness center"],
      "roomType": "Deluxe Room",
      "cancellationPolicy": "Free cancellation until 3 days before check-in",
      "distance": "1.5 miles from city center",
      "promoAvailable": true,
      "savings": 150,
      "highlights": ["Excellent location", "Great value", "Staff service"]
    }
  ]
}

Important requirements:
1. Include 3-4 accommodation options at different price points (ensure they fit within the total budget of ${budget})
2. Recommend accommodations that specifically match the trip purpose: ${purpose}
3. Ensure all options are real, well-known hotels or accommodations in ${destination}
4. Calculate totalPrice based on the actual number of nights between ${startDate} and ${endDate}
5. Provide actual neighborhood names for locations
6. At least one option should have a Capital One promotion with savings
7. For business trips: prioritize locations near business districts with work amenities
8. For family trips: prioritize family-friendly accommodations with appropriate amenities
9. For adventure/leisure trips: suggest accommodations near major attractions or with special experiences
10. For romantic trips: prioritize accommodations with special couples amenities or views
11. Use realistic URLs for images (use unsplash.com URLs)
12. Ensure all JSON is valid and properly formatted
13. Only return the JSON object with no additional text or explanation

Return accommodations that best represent the destination's culture, match the trip purpose of ${purpose}, and provide good value within the specified budget of ${budget}.`,
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }

  async getTransportation(
    budget: any,
    purpose: any,
    startDate: any,
    endDate: any,
    contry: any,
    hotelName: any
  ): Promise<string | null> {
    try {
      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: `You are a travel API that exclusively returns structured JSON data. Generate transportation options for travelers going to {destination} based on their specific trip details.

Trip Details:
- Destination: ${contry}
- Start Date: ${startDate}
- End Date: ${endDate}
- Total Budget: ${budget}
- Trip Purpose: ${purpose}
- Accommodation: ${hotelName}

Create a detailed JSON response with the following structure:
{
  "destination": "${contry}",
  "arrivalDate": "${startDate}",
  "departureDate": "${endDate}",
  "recommendedOption": 1,
  "options": [
    {
      "id": 1,
      "type": "flight",
      "name": "Direct Flight",
      "description": "Detailed description of the transportation option",
      "price": 1200,
      "duration": "14h 30m",
      "departureTime": "10:30 AM",
      "arrivalTime": "2:00 PM (+1)",
      "provider": "Airline or Company Name",
      "amenities": ["In-flight meals", "Wi-Fi", "Entertainment"],
      "promoAvailable": true,
      "savings": 150,
      "highlights": ["Direct flight", "Quality service", "On-time performance"],
      "transfers": 0,
      "transferDetails": ["Frankfurt Airport (FRA) - 2h layover"],
    }
  ]
}

Important requirements:
1. Include 3-4 transportation options with different trade-offs (direct vs. connecting flights, different carriers, combination options like train+flight)
2. Ensure at least one option includes a Capital One promotional discount (promoAvailable: true)
3. Make transportation options realistic for the destination (for example, bullet trains for Japan, ferries for Greek islands)
4. For price, consider the trip purpose and budget - business travelers might have higher budgets than leisure travelers
5. Include actual realistic providers (airlines, train companies, etc.) that serve the destination
6. Duration and transfer information should be realistic considering the destination
7. Only use image URLs from unsplash.com, ensuring they are real, working URLs
8. For each option, consider different departure/arrival times that serve different traveler preferences
9. Ensure the "recommendedOption" is set to the option ID that best balances price, convenience, and quality
10. Include at least one option with transfers > 0 and appropriate transferDetails

Return only valid JSON with no additional text, markdown formatting, or explanations. Ensure all values match the types specified in the schema.`,
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }

  async getActivities(destination: any, arrivalTime: any, startDate: any, endDate: any, budget: any, accomodationName: any, accomodationLocation: any
  ): Promise<string | null> {
    try {
      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview_2025_03_11" }],
        tool_choice: "required",
        max_output_tokens: 5000,
        input: `You are a travel API that exclusively returns structured JSON data without explanation text. Generate a detailed activities itinerary for a trip based on the following parameters:

TRIP DETAILS:
- Destination: ${destination}
- Accommodation: ${accomodationName} in ${accomodationLocation}
- Arrival Time: ${arrivalTime}
- Start Date: ${startDate}
- End Date: ${endDate}
- Budget: ${budget}

Create a detailed JSON response with the following structure:
{
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "totalActivities": number,
  "totalCost": number,
  "overview": "Personalized overview of the trip itinerary highlighting key experiences",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "dayNumber": 1,
      "activities": [
        {
          "id": 1,
          "name": "Activity Name",
          "type": "activity type (dining, sightseeing, cultural, travel, outdoor, etc.)",
          "description": "Detailed description of the activity",
          "location": "Specific location within the destination",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "cost": number,
          "currency": "USD",
          "bookingRequired": true/false,
          "bookingUrl": "booking URL if applicable",
          "highlights": ["highlight 1", "highlight 2", "highlight 3"],
          "promoAvailable": true/false,
          "savings": number
        }
      ]
    }
  ]
}

IMPORTANT REQUIREMENTS:

1. Create a logical daily sequence of 2-4 activities per day considering the arrival time on the first day and departure on the last day
2. Only include activities that match the destination's culture, attractions, and local experiences
3. Account for travel time between activities and realistic opening hours
4. Vary activity types across the itinerary (mix of dining, cultural, sightseeing, etc.)
5. Ensure first day's activities start after the arrival time: {arrivalTime}
6. Total cost of all activities should be appropriate for the budget: ${budget}
7. Include at least one free activity per day and balance paid activities
8. Create a mix of popular tourist destinations and off-the-beaten-path experiences
9. Include at least 2 activities that have Capital One promotions (promoAvailable: true)
10. Make sure booking URLs are not included unless bookingRequired is true
11. Each day's activities should flow logically based on geography to minimize unnecessary travel
12. For dining activities, include actual restaurant names and cuisine types specific to the destination
13. For cultural activities, include authentic local cultural experiences relevant to the destination
14. Activity descriptions should be detailed and informative (25-40 words each)
15. Activity types must be one of: "sightseeing", "cultural", "dining", "outdoor", "beach", "shopping", "entertainment", "music", "art", "nature", or "travel"
16. Calculate total activities count and total cost accurately based on the generated data
Return only valid JSON with no additional text, markdown formatting, or explanations. The response must be a single, well-formed JSON object matching the structure above.`,
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }

  



}
