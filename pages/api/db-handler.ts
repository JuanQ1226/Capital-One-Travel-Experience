import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../database/db'; // Import the database client




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await client.query(`
  SELECT 
    t.destination AS country,
    r.comments,
    a.name AS activity,
    r.rating
  FROM 
    travel_schema."Trips" t
  JOIN 
    travel_schema."Reviews" r ON t.id = r.trip_id
  LEFT JOIN 
    travel_schema."Itineraries" i ON t.id = i.trip_id
  LEFT JOIN 
    travel_schema."Activities" a ON i.id = a.itinerary_id
  WHERE 
    t.client_id = 3  -- Replace with the Client ID you want to filter by
  ORDER BY 
    r.rating DESC  -- Ordering by review rating (top 5 highest ratings)
  LIMIT 5;
    `);

    if( req.method === 'POST'){
      const { countries, activities } = req.body;

      console.log('Received data from front-end:', { countries, activities });

    }
    res.status(200).json(result); // Send data from the query result to the frontend
  } catch (error) {
    console.error('Error fetching data:', error);  // Log the actual error for better debugging
    res.status(500).json({ message: 'Error fetching data', error });  // Send a 500 status and error message
  }
}



