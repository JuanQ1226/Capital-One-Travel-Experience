import React from 'react';
import { Card, Button } from '@heroui/react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';

type ItineraryData = {
  destination: string;
  activities: string[];
  accommodations: string[];
  transportation: string[];
  totalCost: number;
  recommendations: string[];
}

interface ItineraryResultsPageProps {
  itineraryData: ItineraryData | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<ItineraryResultsPageProps> = async (context) => {
  try {
    const { data } = context.query;
    
    // If data exists in the query params, parse it
    if (data && typeof data === 'string') {
      const parsedData = JSON.parse(data);
      return {
        props: {
          itineraryData: parsedData
        }
      };
    }

    // If we don't have data in the URL and need to fetch it from an API
    // You could also redirect to the form page instead
    const response = await fetch("/api/generate-itinerary", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch itinerary data');
    }

    const itineraryData = await response.json();
    
    return {
      props: {
        itineraryData
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    // Return null data and potentially an error message
    return {
      props: {
        itineraryData: null,
        error: 'Failed to load itinerary data'
      }
    };
  }
};

const ItineraryResultsPage = ({ itineraryData, error }: ItineraryResultsPageProps) => {

  // Handle error state
  if (error || !itineraryData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Card radius="md" shadow="md" className="p-6 bg-white text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">{error || "We couldn't load your itinerary. Please try again."}</p>
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
        <Card radius="md" shadow="md" className="p-8 bg-white mb-6">
          <h1 className="text-4xl font-bold text-center mb-2">Your Personalized Itinerary</h1>
          <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
            Destination: {itineraryData.destination}
          </h2>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Activities</h3>
            <ul className="list-disc pl-5 space-y-2">
              {itineraryData.activities.map((activity, index) => (
                <li key={index} className="text-gray-700">{activity}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Accommodations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {itineraryData.accommodations.map((accommodation, index) => (
                <li key={index} className="text-gray-700">{accommodation}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Transportation</h3>
            <ul className="list-disc pl-5 space-y-2">
              {itineraryData.transportation.map((transport, index) => (
                <li key={index} className="text-gray-700">{transport}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {itineraryData.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">{recommendation}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Estimated Cost</h3>
            <p className="text-2xl text-red-600 font-bold">${itineraryData.totalCost.toLocaleString()}</p>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Button className="bg-red-500 hover:bg-red-800 text-white">
              Book This Trip
            </Button>
            <Button variant="bordered" as={Link} href="/user-form">
              Modify Preferences
            </Button>
          </div>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          <p>This itinerary was generated by Capital One Travel AI based on your preferences.</p>
          <p>Prices and availability may vary. Please confirm before booking.</p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryResultsPage;