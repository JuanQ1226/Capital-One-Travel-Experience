import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ServerApiVersion } from "mongodb";
import { parse } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  console.log("User ID from request body:", req.body);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  
  const client = new MongoClient(process.env.MONGO_URI || "no-found", {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const db = client.db("travel");
    const collection = db.collection("user_trip");
    
    // Fetch trips for the authenticated user
    const trips = await collection.find({ userId: userId}).toArray();
    
    console.log("Fetched trips:", trips);


    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Error fetching trips", error });
  } finally {
    await client.close();
  }
}