import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export class LLM {
  private client: OpenAI;

  constructor() {
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
        input: `Based on the following information give me a country you would travel to: Budget:${budget} Purpose:${purpose} startDate:${startDate} endDate:${endDate} , Return one anwser, jsonify the answer, make sure it follows this format: {"name": "Country Name", "description": "Description of the country", "highlights": ["Highlight 1", "Highlight 2"], "bestTimeToVisit": "Best time to visit", "weather": "Weather information", "currency": "Currency used", "language": "Language spoken", "imageUrl": "URL of an Image of the country in the web", "safetyInfo": "Safety information", "visaRequirements": "Visa requirements"}, Return just JSON without any additional text or explanation. Make sure the JSON is valid and properly formatted without any json tags or tildes used for formatting. The country should be a real country that exists in the world, and the information should be accurate and up-to-date.`,
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
      "imageUrl": "https://images.unsplash.com/photo-example",
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
      "imageUrl": "https://images.unsplash.com/photo-example",
      "provider": "Airline or Company Name",
      "amenities": ["In-flight meals", "Wi-Fi", "Entertainment"],
      "promoAvailable": true,
      "savings": 150,
      "highlights": ["Direct flight", "Quality service", "On-time performance"],
      "transfers": 0,
      "transferDetails": []
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
11. For imageUrls, use ONLY these verified Unsplash URLs:
    - https://images.unsplash.com/photo-1569154941061-e231b4725ef1
    - https://images.unsplash.com/photo-1436491865332-7a61a109cc05
    - https://images.unsplash.com/photo-1552917084-03e840186a77
    - https://images.unsplash.com/photo-1606768666853-403c90a981ad
    - https://images.unsplash.com/photo-1544620347-c4fd4a3d5957

Return only valid JSON with no additional text, markdown formatting, or explanations. Ensure all values match the types specified in the schema.`,
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }

  async getItenary(destination: any, arrivaltime: any, startDate: any, endDate: any, budget: any, accomodationName: any, accomodationLocation: any
  ): Promise<string | null> {
    try {
      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview_2025_03_11" }],
        tool_choice: "required",
        input: ``,
      });
      return response.output_text;
    } catch (error) {
      console.error("Error fetching positive news:", error);
      return null;
    }
  }
}
