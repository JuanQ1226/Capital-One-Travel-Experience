import { Card, Divider } from "@heroui/react";
import mainBg from "@/public/main_bg.jpg";
import { Button } from "@heroui/button";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faMapMarkedAlt, faDollar, faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';


export default function IndexPage() {

// // Database API Call
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/api/db-handler');  // Call API route
//         const result = await response.json();
//         console.log('Data received:', result); // Log the data
//         setData(result);
        
//         const formattedData = result.reduce((acc: any, row: any) => {
//           // Check if the country already exists
//           if (!acc[row.country]) {
//             acc[row.country] = {
//               countries: new Set(),
//               activities: new Set()
//             };
//           }
        
//           // We need to ensure unique entries of countries and ratings before adding to the set
//           acc[row.country].countries.add(`${row.country} Rating ${row.rating}/5`);
        
//           // Same here but add activities and ratings
//           acc[row.country].activities.add(`${row.activity} Rating ${row.rating}/5`);
        
//           return acc;
//         }, {});
        
//         // Separate results
//         const countriesString = Object.entries(formattedData)
//           .map(([country, { countries }]: [string, { countries: Set<string> }]) => {
//             return `${[...countries].join(', ')}`;
//           })
//           .join('\n');
        
//         const activitiesString = Object.entries(formattedData)
//           .map(([country, { activities }]: [string, { activities: Set<string> }]) => {
//             return `${[...activities].join(', ')}`;
//           })
//           .join('\n');
        
//         // Debugging Log
//         //console.log('Countries and Ratings:');
//         console.log('Most enjoyed countries ' + countriesString);
//         //console.log('\nActivities and Ratings:');
//         console.log('Most enjoyed activities ' + activitiesString);

//         const sendToLLMResponse = await fetch('/api/db-handler', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ countries: countriesString, activities: activitiesString }),
//         });

//         const sendToLLMResult = await sendToLLMResponse.json();
//         console.log('Response from db-handler:', sendToLLMResult);

//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);
// Database API Call End

  return (
    <div className={"flex flex-row h-screen w-full"}>
      <div className="relative w-1/2 flex items-center justify-center">
        <Card className="aspect-square absolute z-10 p-4 bg-white rounded-lg shadow-lg text-center flex flex-col items-center justify-center gap-4">
            <h1 className="font-semibold font-serif text-4xl">
              Book your Next Trip
            </h1>
            <p className="mt-2 text-gray-600">
              Discover the world with our travel booking platform.
            </p>
          <Link href="/user-form">
            <Button size="lg" className="mt-4 bg-black text-white hover:bg-gray-800">
              Get Started
            </Button>
          </Link>
        </Card>
        <img
          src="/main_bg.jpg"
          alt="Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="w-1/2 flex flex-col items-center container mx-auto max-w-3xl bg-white gap-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className={`font-serif text-6xl text-black font-bold`}>
            Capital Travel
          </h1>
          <p className="mt-2 text-black text-2xl">
            Your gateway to unforgettable journeys.
          </p>
        </div>
        <Divider/>
        <div>
          <div>
            <FontAwesomeIcon
              icon={faMapMarkedAlt}
              className="text-4xl text-black mt-4"
            />
            <h2 className="text-4xl font-bold text-black mt-4 font-serif">Smart Destinations</h2>
          </div>
          <p className="mt-2 text-black text-lg">
            Personalized Recommendations - Our AI will suggest destinations
            based on your preferences, making travel planning a breeze.
          </p>
        <div>
          <div>
            <FontAwesomeIcon
              icon={faPlaneDeparture}
              className="text-4xl text-black mt-4"
            />
            <h2 className="text-4xl font-bold text-black mt-4 font-serif">Custom Itineraries</h2>
          </div>
          <p className="mt-2 text-black text-lg">
            AI-Powered Itineraries - We&apos;ll use AI to create personalized
            trip plans based on past travels and spending habits, making
            planning effortless.
          </p>
          </div>
          <div>
            <div className="">
              <FontAwesomeIcon
                icon={faDollar}
                className="text-4xl text-black mt-4"
              />
              <h2 className="text-4xl font-bold font-serif text-black mt-4">Money-Saving Deals</h2>
            </div>
            <p className="mt-2 text-black text-lg">
              Smart Budget & Deals - Our system will find the best discounts
              and cashback offers, ensuring every trip is cost-effective and
              rewarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
