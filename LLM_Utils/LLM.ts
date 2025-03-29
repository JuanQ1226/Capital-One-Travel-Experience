import OpenAI from "openai";
import dotenv from "dotenv";

// Helper function to find the most frequent item in an array
const transactions = [
  { country: "USA", category: "Food", merchant: "McDonald's" },
  { country: "France", category: "Tourism", merchant: "Eiffel Tower" },
  { country: "USA", category: "Transportation", merchant: "Uber" },
  { country: "Japan", category: "Food", merchant: "Sushi Bar" },
  { country: "Japan", category: "Food", merchant: "Ramen House" },
  { country: "USA", category: "Tourism", merchant: "Statue of Liberty" },
  { country: "France", category: "Food", merchant: "Le Gourmet" },
  { country: "France", category: "Transportation", merchant: "Taxi Paris" },
  { country: "Japan", category: "Transportation", merchant: "Shinkansen" },
  { country: "USA", category: "Food", merchant: "Starbucks" },
  { country: "France", category: "Tourism", merchant: "Louvre Museum" },
  { country: "France", category: "Food", merchant: "Boulangerie" },
  { country: "USA", category: "Food", merchant: "Chipotle" },
  { country: "USA", category: "Tourism", merchant: "Disneyland" },
  // USA - Food and Tourism
  { country: "USA", category: "Food", merchant: "McDonald's" },
  { country: "USA", category: "Food", merchant: "Starbucks" },
  { country: "USA", category: "Food", merchant: "Chipotle" },
  { country: "USA", category: "Transportation", merchant: "Uber" },
  { country: "USA", category: "Transportation", merchant: "Lyft" },
  { country: "USA", category: "Tourism", merchant: "Statue of Liberty" },
  { country: "USA", category: "Tourism", merchant: "Grand Canyon" },
  { country: "USA", category: "Nightlife", merchant: "Las Vegas Nightclub" },
  { country: "USA", category: "Nature", merchant: "Yosemite National Park" },

  // France - Food and Tourism
  { country: "France", category: "Food", merchant: "Le Gourmet" },
  { country: "France", category: "Food", merchant: "Boulangerie" },
  { country: "France", category: "Tourism", merchant: "Eiffel Tower" },
  { country: "France", category: "Tourism", merchant: "Louvre Museum" },
  { country: "France", category: "Nightlife", merchant: "Paris Jazz Club" },
  { country: "France", category: "Transportation", merchant: "Taxi Paris" },

  // Japan - Food, Tourism, and Transportation
  { country: "Japan", category: "Food", merchant: "Sushi Bar" },
  { country: "Japan", category: "Food", merchant: "Ramen House" },
  { country: "Japan", category: "Transportation", merchant: "Shinkansen" },
  { country: "Japan", category: "Tourism", merchant: "Mount Fuji Hiking Trail" },
  { country: "Japan", category: "Nature", merchant: "Arashiyama Bamboo Forest" },

  // Brazil - Tourism and Food
  { country: "Brazil", category: "Tourism", merchant: "Christ the Redeemer" },
  { country: "Brazil", category: "Tourism", merchant: "Copacabana Beach" },
  { country: "Brazil", category: "Nightlife", merchant: "Rio Samba Club" },
  { country: "Brazil", category: "Food", merchant: "Churrascaria Palace" },

  // Italy - Food and Tourism
  { country: "Italy", category: "Food", merchant: "Pizzeria Napoli" },
  { country: "Italy", category: "Food", merchant: "Gelato Roma" },
  { country: "Italy", category: "Tourism", merchant: "Colosseum" },
  { country: "Italy", category: "Tourism", merchant: "Leaning Tower of Pisa" },
  { country: "Italy", category: "Nightlife", merchant: "Rome Wine Bar" },

  // India - Food, Tourism, and Transportation
  { country: "India", category: "Food", merchant: "Curry House" },
  { country: "India", category: "Food", merchant: "Tandoori Grill" },
  { country: "India", category: "Tourism", merchant: "Taj Mahal" },
  { country: "India", category: "Nature", merchant: "Kerala Backwaters" },
  { country: "India", category: "Transportation", merchant: "Ola Cabs" },

  // Australia - Food and Tourism
  { country: "Australia", category: "Food", merchant: "Outback Steakhouse" },
  { country: "Australia", category: "Tourism", merchant: "Sydney Opera House" },
  { country: "Australia", category: "Nature", merchant: "Great Barrier Reef" },

  // UK - Food and Tourism
  { country: "UK", category: "Food", merchant: "Fish and Chips" },
  { country: "UK", category: "Nightlife", merchant: "London Pub" },
  { country: "UK", category: "Tourism", merchant: "Big Ben" },
  { country: "UK", category: "Tourism", merchant: "British Museum" },
  { country: "UK", category: "Transportation", merchant: "Black Cab" },

  // Canada - Food and Tourism
  { country: "Canada", category: "Food", merchant: "Tim Hortons" },
  { country: "Canada", category: "Tourism", merchant: "Niagara Falls" },
  { country: "Canada", category: "Nature", merchant: "Banff National Park" },
  { country: "Canada", category: "Transportation", merchant: "VIA Rail" },

  // Mexico - Food and Tourism
  { country: "Mexico", category: "Food", merchant: "Taco Stand" },
  { country: "Mexico", category: "Tourism", merchant: "Chichen Itza" },
  { country: "Mexico", category: "Nightlife", merchant: "Cancun Beach Club" },
];

// Sample user credit card transaction history


dotenv.config();
export class LLM {
  private client: OpenAI;

  
  constructor()
  {
    const apiKeyText = process.env.OPENAI_API_KEY;
    if (!apiKeyText) {
      throw new Error(
        "OPENAI_API_KEY is not set in the environment variables."
      );
    }
    this.client = new OpenAI({ apiKey: apiKeyText });
  }
  
  
   getMostFrequent<T extends string>(arr: T[]): string | null {
    const freqMap: Record<string, number> = {};
  
    for (const item of arr) {
        freqMap[item] = (freqMap[item] || 0) + 1;
    }
    return Object.keys(freqMap).reduce((a, b) => (freqMap[a] > freqMap[b] ? a : b), "") || null;
  }
  
  
  
  // Get the most visited country based on transactions
  getMostVisitedCountry(): string {
    const countries = transactions.map((t) => t.country);
    return this.
    getMostFrequent(countries) || "No data available";
  }
  
  // Get places where the user spent on tourism
  getTourismTransactionsPlaces(): string[] {
    const tourismKeywords = ["beach", "museum", "hiking", "nature", "nightlife"];
  
    return transactions 
        .filter((t) =>
            tourismKeywords.some((keyword) =>
                t.merchant.toLowerCase().includes(keyword)
            )
        )
        .map((t) => t.merchant);
  }
  
  // Get the most used mode of transportation
  getMostUsedModeOfTransportation(): string {
    const transportPlaces = transactions
        .filter((t) => t.category === "Transportation")
        .map((t) => t.merchant);
  
    return this.getMostFrequent(transportPlaces) || "No data available";
  }
  
  // Get the most frequent type of food transaction
  getMostTypeOfFoodTransactions(): string {
    const foodPlaces = transactions
        .filter((t) => t.category === "Food")
        .map((t) => t.merchant);
  
    return this.getMostFrequent(foodPlaces) || "No data available";
  }



    
  

  async getCountry(
    budget: any,
    purpose: any,
    startDate: any,
    endDate: any,
    previousTrips?: any[]
  ): Promise<string | null> {
    try {
      let MostVisited : string = this.getMostVisitedCountry();
      let trips = previousTrips ? previousTrips : "IGNORE THERE ARE NO TRIPS";

      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview_2025_03_11" }],
        tool_choice: "required",
        input: `Based on the following information give me a country you would travel to: Budget:${budget} Purpose:${purpose} startDate:${startDate} endDate:${endDate}, Previous Most Visited Country: ${MostVisited},Return one anwser, jsonify the answer, make sure it follows this format: {"name": "Country Name", "description": "Description of the country", "highlights": ["Highlight 1", "Highlight 2"], "bestTimeToVisit": "Best time to visit", "weather": "Weather information", "currency": "Currency used", "language": "Language spoken", "safetyInfo": "Safety information", "visaRequirements": "Visa requirements"}, Return just JSON without any additional text or explanation. Make sure the JSON is valid and properly formatted without any json tags or tildes used for formatting. The country should be a real country that exists in the world, and the information should be accurate and up-to-date. Also adjust the country based on the following past trips to avoid repetition: ${previousTrips}`,
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

      let MostFrecuentTransport = this.getMostUsedModeOfTransportation();


      const response = await this.client.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: `You are a travel API that exclusively returns structured JSON data. Generate transportation options for travelers going to ${contry} based on their specific trip details. This user likes to use this type of Transportation (${MostFrecuentTransport}) 

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

      let Torism = this.getTourismTransactionsPlaces();
      let Food = this.getMostTypeOfFoodTransactions();

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

User Facts:
- Likes to do stuff realated to ${Torism}
- Likes to eat this food : ${Food}

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
