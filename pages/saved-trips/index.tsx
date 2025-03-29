import React from 'react';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faHotel, faSuitcase, faPlane, faArrowRight, faArrowLeft, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { Card, Button, Divider, Badge, Chip } from "@heroui/react"; // Using HeroUI components

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  // get user data from cookie
  const cookie = context.req.headers.cookie;
  const token = parse(cookie || "");
  console.log("Token from cookie:", token);
  const user = JSON.parse(token.authToken || "{}");
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  console.log("User data from cookie:", user);
  const response = await fetch("http://localhost:3000/api/get-user-trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: user.id }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch trip data");
  }
  const tripData = await response.json();
  console.log("Trip data from server:", tripData);
  return {
    props: {
      trips: tripData,
      user: user
    },
  };
};

export const SavedListingsPage = ({ trips, user }: any) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button 
              variant="light"
              className="mb-4 px-4 py-2 text-red-600 hover:bg-red-50"
              startContent={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Back to Home
            </Button>
          </Link>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Your Saved Trips</h1>
            <Button 
              color="primary"
              className="bg-red-600 hover:bg-red-700"
              as={Link}
              href="/user-form"
            >
              Plan New Trip
            </Button>
          </div>
        </div>
        
        {trips && trips.length > 0 ? (
          <div className="space-y-6">
            {trips.map((trip: any, idx: number) => {
              // Parse the trip data
              const tripData = typeof trip.tripData === 'string' 
                ? JSON.parse(trip.tripData) 
                : trip.tripData;
              
              // Extract key information
              const countryInfo = tripData.country || {};
              const accommodationInfo = tripData.accommodation || {};
              const userInfo = tripData.userInfo || {};
              const transportationInfo = tripData.transportation || {};
              
              return (
                <Card key={idx} className="overflow-hidden shadow-md">
                  <div className="md:flex">
                    {/* Left side - Image */}
                    <div className="md:w-2/5 lg:w-1/3 relative h-64 md:h-auto overflow-hidden">
                      <div className="relative w-full h-full">
                      {countryInfo.imageUrl ? (
                        <img 
                        src={countryInfo.imageUrl}
                        alt={countryInfo.name || 'Destination'}
                        className="w-full h-full object-cover absolute inset-0"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faMapMarkedAlt} className="text-gray-400 text-4xl" />
                        </div>
                      )}
                      </div>
                    </div>
                    
                    {/* Right side - Trip details */}
                    <div className="p-5 md:p-6 md:w-3/5 lg:w-2/3">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            {countryInfo.name || 'Unknown Destination'}
                          </h2>
                          <p className="text-sm text-gray-500">
                            ID: {trip.tripId.substring(0, 8)}...
                          </p>
                        </div>
                        
                        <Chip color="warning" variant="flat" className="self-start">
                          {userInfo.purpose ? userInfo.purpose.toUpperCase() : 'TRAVEL'}
                        </Chip>
                      </div>
                      
                      <p className="mt-3 text-gray-600 line-clamp-2">
                        {countryInfo.description?.substring(0, 150)}
                        {countryInfo.description?.length > 150 ? '...' : ''}
                      </p>
                      
                      <Divider className="my-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Travel Dates */}
                        <div className="flex items-start gap-3">
                          <div className="bg-red-100 rounded-full p-2 mt-1">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">DATES</p>
                            <p>
                              {userInfo.startDate && userInfo.endDate ? (
                                <>
                                  {new Date(userInfo.startDate).toLocaleDateString()} - 
                                  {new Date(userInfo.endDate).toLocaleDateString()}
                                </>
                              ) : (
                                'Dates not specified'
                              )}
                            </p>
                          </div>
                        </div>
                        
                        {/* Accommodation */}
                        <div className="flex items-start gap-3">
                          <div className="bg-red-100 rounded-full p-2 mt-1">
                            <FontAwesomeIcon icon={faHotel} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">ACCOMMODATION</p>
                            <p className="line-clamp-1">
                              {accommodationInfo.name || 'Not specified'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Budget */}
                        <div className="flex items-start gap-3">
                          <div className="bg-red-100 rounded-full p-2 mt-1">
                            <FontAwesomeIcon icon={faSuitcase} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">BUDGET</p>
                            <p>
                              ${userInfo.budget ? Number(userInfo.budget).toLocaleString() : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trip Highlights */}
                      {countryInfo.highlights && countryInfo.highlights.length > 0 && (
                        <div className="mt-5">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Highlights:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                            {countryInfo.highlights.slice(0, 2).map((highlight: string, i: number) => (
                              <li key={i} className="line-clamp-1">{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Footer with action button */}
                      <div className="mt-5 flex justify-end">
                        <Button 
                          color="primary" 
                          variant="light"
                          as={Link}
                          href={`/saved-trips/${trip.tripId}`}
                          className="text-red-600 hover:text-red-700"
                          endContent={<FontAwesomeIcon icon={faArrowRight} />}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faSuitcase} className="text-3xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">No saved trips yet</h2>
            <p className="mt-2 text-gray-600 mb-6">Start planning your adventure now!</p>
            <Button 
              color="primary"
              className="bg-red-600 hover:bg-red-700 mx-auto"
              as={Link}
              href="/user-form"
            >
              Plan Your First Trip
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedListingsPage;