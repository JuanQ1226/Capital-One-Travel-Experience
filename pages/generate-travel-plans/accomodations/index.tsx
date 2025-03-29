import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, Spinner, Progress, Badge, Chip } from "@heroui/react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faWifi, faUtensils, faCar, faSwimmingPool, faDumbbell, faSpa } from "@fortawesome/free-solid-svg-icons";

type AccommodationData = {
  destination: string;
  options: AccommodationOption[];
  totalNights: number;
  checkIn: string;
  checkOut: string;
  recommendedOption: number;
};

type AccommodationOption = {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  totalPrice: number;
  rating: number;
  imageUrl: string;
  location: string;
  amenities: string[];
  roomType: string;
  cancellationPolicy: string;
  distance: string;
  promoAvailable?: boolean;
  savings?: number;
  highlights?: string[];
};

interface AccommodationsPageProps {
  accommodationData: AccommodationData | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<AccommodationsPageProps> = async (context) => {
  try {
    const { data } = context.query;
    
    // If data exists in the query params, parse it
    if (data && typeof data === "string") {
      const parsedData = JSON.parse(data);
      return {
        props: {
          accommodationData: parsedData,
        },
      };
    }

    // Mock data if nothing is passed via query
    const mockData: AccommodationData = {
      destination: "Tokyo, Japan",
      totalNights: 5,
      checkIn: "2025-05-10",
      checkOut: "2025-05-15",
      recommendedOption: 1,
      options: [
        {
          id: 1,
          name: "Park Hyatt Tokyo",
          description: "Luxury hotel located in Shinjuku offering breathtaking views of Tokyo and Mount Fuji. Featured in the movie 'Lost in Translation'.",
          pricePerNight: 450,
          totalPrice: 2250,
          rating: 4.8,
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
          location: "Shinjuku, Tokyo",
          amenities: ["Free WiFi", "Spa", "Pool", "Fitness Center", "Restaurant", "Room Service", "Airport Shuttle"],
          roomType: "Deluxe King Room",
          cancellationPolicy: "Free cancellation until 3 days before check-in",
          distance: "0.5 miles from Shinjuku Station",
          promoAvailable: true,
          savings: 450,
          highlights: ["Beautiful city views", "Excellent service", "Central location"]
        },
        {
          id: 2,
          name: "Millennium Mitsui Garden Hotel",
          description: "Modern hotel in the vibrant district of Ginza, perfect for shopping enthusiasts and those who want to explore Tokyo's upscale attractions.",
          pricePerNight: 280,
          totalPrice: 1400,
          rating: 4.5,
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
          location: "Ginza, Tokyo",
          amenities: ["Free WiFi", "Restaurant", "Laundry Service", "Concierge", "Dry Cleaning"],
          roomType: "Superior Double Room",
          cancellationPolicy: "Free cancellation until 7 days before check-in",
          distance: "2 minutes walk to Ginza Station",
        },
        {
          id: 3,
          name: "Hotel Ryumeikan Ochanomizu Honten",
          description: "Traditional Japanese hotel offering authentic ryokan experience with modern amenities, located near the Imperial Palace and Tokyo Dome.",
          pricePerNight: 320,
          totalPrice: 1600,
          rating: 4.7,
          imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3",
          location: "Ochanomizu, Tokyo",
          amenities: ["Free WiFi", "Traditional Japanese Breakfast", "Tea Ceremony", "Public Bath", "Kimono Rental"],
          roomType: "Japanese-style Room with Tatami",
          cancellationPolicy: "Free cancellation until 5 days before check-in",
          distance: "5 minutes walk to Ochanomizu Station",
          promoAvailable: true,
          savings: 200,
        }
      ]
    };

    return {
      props: {
        accommodationData: mockData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    
    // Return null data and potentially an error message
    return {
      props: {
        accommodationData: null,
        error: "Failed to load accommodation data",
      },
    };
  }
};

const AccommodationsPage = ({ accommodationData, error }: AccommodationsPageProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    accommodationData?.recommendedOption || null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle back to destination page
  const handleBack = () => {
    router.back();
  };


  // Handle continue to the next page (activities)
  const handleContinue = async () => {
    if (!selectedOption) return;
    
    setLoading(true);
    try {
      // Find the selected accommodation
      const selectedAccommodation = accommodationData?.options.find(opt => opt.id === selectedOption);
      
      // Make API request to fetch transportation options
      const transportationResponse = await fetch("/api/generate-transportation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          destination: accommodationData?.destination,
          accommodation: selectedAccommodation?.name,
          location: selectedAccommodation?.location
        }),
      });

      // Store selected accommodation in local storage
      localStorage.setItem("selectedAccommodation", JSON.stringify(selectedAccommodation));
      
      if (!transportationResponse.ok) {
        throw new Error("Failed to fetch transportation data");
      }
      
      const transportationData = await transportationResponse.json();
      
      // Navigate to activities page
      router.push({
        pathname: "/generate-travel-plans/transportation",
        query: { data: JSON.stringify(transportationData) },
      });
    } catch (error) {
      console.error("Error moving to the next page:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("WiFi")) return faWifi;
    if (amenity.includes("Restaurant") || amenity.includes("Breakfast")) return faUtensils;
    if (amenity.includes("Shuttle") || amenity.includes("Parking")) return faCar;
    if (amenity.includes("Pool")) return faSwimmingPool;
    if (amenity.includes("Fitness") || amenity.includes("Gym")) return faDumbbell;
    if (amenity.includes("Spa") || amenity.includes("Bath")) return faSpa;
    return faStar; // Default icon
  };

  if (error || !accommodationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card radius="md" shadow="md" className="p-6 bg-white text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">
            {error || "We couldn't load your accommodation options. Please try again."}
          </p>
          <Button
            as={Link}
            href="/user-form"
            className="bg-red-500 hover:bg-red-800 text-white"
          >
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
            value={50}
            label="Step 2 of 4: Accommodation Selection"
            showValueLabel={true}
          />
        </div>

        <Card radius="md" shadow="md" className="bg-white mb-6 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Where You'll Stay in {accommodationData.destination}</h1>
            <p className="text-gray-600">
              {accommodationData.totalNights} nights • {new Date(accommodationData.checkIn).toLocaleDateString()} to {new Date(accommodationData.checkOut).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-700">
              We've selected the best accommodations based on your preferences and budget. Each option offers unique amenities and experiences to enhance your stay.
            </p>
          </div>

          {/* Accommodation options */}
          <div className="space-y-8">
            {accommodationData.options.map((option) => (
              <Card 
                key={option.id} 
                radius="md" 
                shadow="sm" 
                className={`overflow-hidden border-2 ${selectedOption === option.id ? 'border-red-500' : 'border-transparent'}`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-2/5 h-48 md:h-auto relative">
                    <img
                      src={option.imageUrl}
                      alt={option.name}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    {option.promoAvailable && (
                      <Chip
                        color="danger"
                        className="absolute top-2 left-2 text-xs font-semibold bg-red-500 text-white z-10"
                      >
                        Capital One Offer Available
                      </Chip>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 md:w-3/5 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold">{option.name}</h2>
                        <p className="text-sm text-gray-600">{option.location}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FontAwesomeIcon 
                                key={i} 
                                icon={faStar} 
                                className={i < Math.floor(option.rating) ? "text-yellow-400" : "text-gray-300"} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm">{option.rating}/5</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">per night</p>
                        <p className="text-xl font-bold">${option.pricePerNight}</p>
                        <p className="text-sm font-medium">Total: ${option.totalPrice}</p>
                        {option.promoAvailable && (
                          <p className="text-xs text-red-500">Capital One Offer Available</p>
                        )}
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-700 text-sm line-clamp-2 md:line-clamp-3">{option.description}</p>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Room Type: {option.roomType}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {option.amenities.slice(0, 5).map((amenity, index) => (
                          <span key={index} className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                            <FontAwesomeIcon icon={getAmenityIcon(amenity)} className="mr-1 text-gray-600" />
                            {amenity}
                          </span>
                        ))}
                        {option.amenities.length > 5 && (
                          <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                            +{option.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {option.highlights && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Highlights:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {option.highlights.map((highlight, idx) => (
                            <span key={idx} className="text-xs text-gray-700">
                              {idx > 0 ? ' • ' : ''}{highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <p className="text-xs text-gray-500">{option.cancellationPolicy}</p>
                      <Button
                        color={selectedOption === option.id ? "danger" : "default"}
                        variant={selectedOption === option.id ? "solid" : "bordered"}
                        onPress={() => setSelectedOption(option.id)}
                        className={selectedOption === option.id ? "bg-red-500 text-white" : "border-gray-300"}
                      >
                        {selectedOption === option.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onPress={handleBack}
              href="/generate-travel-plans/destination"
              variant="bordered"
              className="border-red-500 text-red-500"
            >
              Back to Destination
            </Button>
            <Button
              onPress={handleContinue}
              disabled={!selectedOption || loading}
              className={`${!selectedOption || loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-800"} text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" color="white" className="mr-2" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Continue to Transportation"
              )}
            </Button>
          </div>
        </Card>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>All accommodations are carefully selected based on your preferences and budget.</p>
          <p>Prices include all taxes and fees. Capital One Travel price match guarantee applies.</p>
        </div>
      </div>
    </div>
  );
};

export default AccommodationsPage;