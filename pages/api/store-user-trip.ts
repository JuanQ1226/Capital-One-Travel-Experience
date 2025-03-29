import { MongoClient, ServerApiVersion } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import {v4 as uuidv4} from 'uuid';
import {parse} from "cookie";
export default async function handler(req: NextApiRequest, res:NextApiResponse) {
  const cookie = parse(req.headers.cookie || "");
  if (!cookie) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = cookie.authToken;
  const user = JSON.parse(token || "{}");
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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
    const db = client.db("travel");
    const collection = db.collection("user_trip");
    const { tripData } = req.body;
    console.log("Received data:", { tripData });
    const result = await collection.insertOne({ userId:user.id, tripId: uuidv4(), tripData });
    console.log("Inserted document:", result);
    res.status(200).json({ message: "Trip stored successfully", result });
  } catch (error) {
    console.error("Error storing trip:", error);
    res.status(500).json({ message: "Error storing trip", error });
  }
  finally {
    await client.close();
  }

  res.status(200).json({ message: "Trip stored successfully" });


}