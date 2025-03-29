import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Spinner, Progress } from '@heroui/react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

type DestinationData = {
  name: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  weather: string;
  currency: string;
  language: string;
  imageUrl: string;
  safetyInfo: string;
  visaRequirements: string;
};


interface TravelDestinationPageProps {
  destination: DestinationData | null;
  error?: string;
}


export const getServerSideProps: GetServerSideProps<TravelDestinationPageProps> = async (context) => {
  try {
    const { data } = context.query;

    console.log("Data from query params:", data);

    // If data exists in the query params, parse it
    if (data && typeof data === 'string') {
      const parsedData = JSON.parse(data);
      return {
        props: {
          destination: parsedData,
        },
      };
    }

    // If we don't have data in the URL and need to fetch it from an API
    // You could also redirect to the form page instead
    const response = await fetch("/api/generate-country", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch destination data');
    }

    const destinationData = await response.json();

    return {
      props: {
        destination: destinationData,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    // Return null data and potentially an error message
    return {
      props: {
        destination: null,
        error: 'Failed to load destination data',
      },
    };
  }
}



const GeneratedDestinationPage = ({destination, error} : TravelDestinationPageProps) => {


  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card radius="md" shadow="md" className="p-6 bg-white text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">{error || "We couldn't load your destination information. Please try again."}</p>
          <Button as={Link} href="/user-form" className="bg-red-500 hover:bg-red-800 text-white">
            Return to Form
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <Progress 
            className="w-full" 
            color="danger" 
            value={25} 
            label="Step 1 of 4: Destination Selection"
            showValueLabel={true}
          />
        </div>
        
        <Card radius="md" shadow="md" className="bg-white mb-6 overflow-hidden">
          {/* Destination image */}
          <div className="w-full h-64 relative">
            <img
              src={destination.imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
              <p className="text-lg">Your ideal destination awaits</p>
            </div>
          </div>
          
          {/* Destination details */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Destination Overview</h2>
            <p className="text-gray-700 mb-6">{destination.description}</p>
            
            <h3 className="text-xl font-semibold mb-3">Highlights</h3>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              {destination.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-700">{highlight}</li>
              ))}
            </ul>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Best Time to Visit</h3>
                <p className="text-gray-700">{destination.bestTimeToVisit}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Weather</h3>
                <p className="text-gray-700">{destination.weather}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Currency</h3>
                <p className="text-gray-700">{destination.currency}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Language</h3>
                <p className="text-gray-700">{destination.language}</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <h3 className="text-xl font-semibold mb-2">Travel Info</h3>
              <p className="font-medium">Safety: </p>
              <p className="text-gray-700 mb-2">{destination.safetyInfo}</p>
              <p className="font-medium">Visa Requirements: </p>
              <p className="text-gray-700">{destination.visaRequirements}</p>
            </div>
          </div>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button 
            as={Link} 
            href="/user-form" 
            variant="bordered"
            className="border-red-500 text-red-500"
          >
            Change Preferences
          </Button>
          <Button 
            as={Link} 
            href="/generate-travel-plans/activities" 
            className="bg-red-500 hover:bg-red-800 text-white"
          >
            Continue to Activities
          </Button>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>This destination was selected based on your preferences by Capital One Travel AI.</p>
          <p>Click continue to see the activities we've selected for your trip.</p>
        </div>
      </div>
    </div>
  );
};

export default GeneratedDestinationPage;
