import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, Spinner, Progress, Badge, Chip } from "@heroui/react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faPlane, 
  faTrain, 
  faBus, 
  faCar, 
  faShuttleVan, 
  faWalking,
  faMoneyBillWave,
  faClock,
  faTicketAlt,
  faUtensils,
  faWifi,
  faLuggageCart,
  faTv,
  faChargingStation
} from "@fortawesome/free-solid-svg-icons";

type TransportationData = {
  destination: string;
  options: TransportationOption[];
  recommendedOption: number;
  arrivalDate: string;
  departureDate: string;
};

type TransportationOption = {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  imageUrl: string; // We'll keep this in the type but won't use it
  provider: string;
  amenities: string[];
  promoAvailable?: boolean;
  savings?: number;
  highlights?: string[];
  transfers: number;
  transferDetails?: string[];
};

interface TransportationPageProps {
  transportationData: TransportationData | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<TransportationPageProps> = async (context) => {
  try {
    const { data } = context.query;
    console.log("Data from query params:", data);
    // If data exists in the query params, parse it
    if (data && typeof data === "string") {
      const parsedData = JSON.parse(data);
      return {
        props: {
          transportationData: parsedData,
        },
      };
    }

    // Mock data if nothing is passed via query
    const mockData: TransportationData = {
      destination: "Tokyo, Japan",
      arrivalDate: "2025-05-10",
      departureDate: "2025-05-15",
      recommendedOption: 1,
      options: [
        {
          id: 1,
          type: "flight",
          name: "Direct Flight",
          description: "Non-stop flight from your location to Tokyo Haneda Airport with Japan Airlines.",
          price: 1200,
          duration: "14h 30m",
          departureTime: "10:30 AM",
          arrivalTime: "2:00 PM (+1)",
          imageUrl: "", // Not used
          provider: "Japan Airlines",
          amenities: ["In-flight meals", "Wi-Fi", "Entertainment", "USB charging", "Extra legroom"],
          promoAvailable: true,
          savings: 150,
          highlights: ["Direct flight", "Quality service", "On-time performance"],
          transfers: 0
        },
        {
          id: 2,
          type: "flight",
          name: "Connecting Flight",
          description: "One-stop flight from your location to Tokyo Narita Airport with layover in Seoul.",
          price: 850,
          duration: "17h 45m",
          departureTime: "9:15 PM",
          arrivalTime: "8:00 PM (+1)",
          imageUrl: "", // Not used
          provider: "Korean Air",
          amenities: ["In-flight meals", "Entertainment", "USB charging"],
          transfers: 1,
          transferDetails: ["2h 30m layover in Seoul (ICN)"]
        },
        {
          id: 3,
          type: "combination",
          name: "Flight + Bullet Train",
          description: "Flight to Osaka followed by scenic bullet train journey to Tokyo.",
          price: 980,
          duration: "18h total",
          departureTime: "1:20 PM",
          arrivalTime: "10:30 AM (+1)",
          imageUrl: "", // Not used
          provider: "ANA + Japan Railways",
          amenities: ["In-flight meals", "Spacious train seating", "Scenic views", "Luggage transfer service"],
          promoAvailable: true,
          savings: 100,
          highlights: ["Experience bullet train", "Scenic route", "More flexible schedule"],
          transfers: 1,
          transferDetails: ["Flight to Osaka (8h), Train to Tokyo (2h 30m)"]
        }
      ]
    };

    return {
      props: {
        transportationData: mockData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    
    // Return null data and potentially an error message
    return {
      props: {
        transportationData: null,
        error: "Failed to load transportation data",
      },
    };
  }
};

const TransportationPage = ({ transportationData, error }: TransportationPageProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    transportationData?.recommendedOption || null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle back to accommodations page
  const handleBack = () => {
    router.back();
  };

  // Handle continue to the next page (activities)
  const handleContinue = async () => {
    if (!selectedOption) return;
    
    setLoading(true);
    try {
      // Find the selected transportation
      const selectedTransport = transportationData?.options.find(opt => opt.id === selectedOption);
      
      // Store selected transportation in local storage
      localStorage.setItem("selectedTransportation", JSON.stringify(selectedTransport));
      
      // Retrieve accommodation data from local storage
      const accommodationData = localStorage.getItem("selectedAccommodation");
      const accomodationName = accommodationData ? JSON.parse(accommodationData).name : "";
      const accomodationLocation = accommodationData ? JSON.parse(accommodationData).location : "";

      // Make API request to get activities data
      const activitiesResponse = await fetch("/api/generate-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          destination: transportationData?.destination,
          arrivalTime: selectedTransport?.arrivalTime,
          startDate: localStorage.getItem("startDate"),
          endDate: localStorage.getItem("endDate"),
          budget: localStorage.getItem("budget"),
          accomodationName,
          accomodationLocation,
        }),
      });
      
      if (!activitiesResponse.ok) {
        throw new Error("Failed to fetch activities data");
      }
      
      const activitiesData = await activitiesResponse.json();
      
      // Navigate to activities page
      router.push({
        pathname: "/generate-travel-plans/activities",
        query: { data: JSON.stringify(activitiesData) },
      });
    } catch (error) {
      console.error("Error moving to the next page:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "flight": return faPlane;
      case "train": return faTrain;
      case "bus": return faBus;
      case "car": return faCar;
      case "shuttle": return faShuttleVan;
      case "walking": return faWalking;
      case "combination": return faPlane; // Default for combination
      default: return faPlane;
    }
  };
  
  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes("meals")) return faUtensils;
    if (amenity.toLowerCase().includes("snacks")) return faUtensils;
    if (amenity.toLowerCase().includes("wifi")) return faWifi;
    if (amenity.toLowerCase().includes("internet")) return faWifi;
    if (amenity.toLowerCase().includes("dining")) return faUtensils;
    if (amenity.toLowerCase().includes("wi-fi")) return faWifi;
    if (amenity.toLowerCase().includes("entertainment")) return faTv;
    if (amenity.toLowerCase().includes("usb") || amenity.toLowerCase().includes("charging")) return faChargingStation;
    if (amenity.toLowerCase().includes("luggage")) return faLuggageCart;
    if (amenity.toLowerCase().includes("ticket") || amenity.toLowerCase().includes("extra")) return faTicketAlt;
    return faStar; // Default icon
  };

  if (error || !transportationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card radius="md" shadow="md" className="p-6 bg-white text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">
            {error || "We couldn't load your transportation options. Please try again."}
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
            value={75}
            label="Step 3 of 4: Transportation Selection"
            showValueLabel={true}
          />
        </div>

        <Card radius="md" shadow="md" className="bg-white mb-6 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">How You'll Travel to {transportationData.destination as string}</h1>
            <p className="text-gray-600">
              Arrival: {new Date(transportationData.arrivalDate).toLocaleDateString()} • Departure: {new Date(transportationData.departureDate).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-700">
              We've selected the best transportation options based on your preferences. Each option offers different benefits in terms of comfort, price, and convenience.
            </p>
          </div>

          {/* Transportation options */}
          <div className="space-y-8">
            {transportationData.options.map((option) => (
              <Card 
                key={option.id} 
                radius="md" 
                shadow="sm" 
                className={`overflow-hidden border-2 ${selectedOption === option.id ? 'border-red-500' : 'border-transparent'}`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Transport Icon Section */}
                  <div className="md:w-1/4 h-auto relative bg-gray-50 flex flex-col items-center justify-center p-8">
                    <FontAwesomeIcon 
                      icon={getTransportIcon(option.type)} 
                      className="text-6xl text-gray-700 mb-6" 
                    />
                    <div className="text-center mt-4">
                      <p className="font-medium text-lg">{option.provider}</p>
                      <div className="mt-2 bg-blue-50 px-3 py-1 rounded-full inline-block">
                        <span className="text-xs font-semibold text-blue-600 uppercase">{option.type}</span>
                      </div>
                    </div>
                    
                    {option.promoAvailable && (
                      <div className="absolute top-2 right-2 rounded-full bg-red-500 text-white p-2">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-lg" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 md:w-3/4 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold">{option.name}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-xl font-bold">${option.price}</p>
                        {option.promoAvailable && (
                          <p className="text-xs text-red-500">Save ${option.savings}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between mt-4 bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center mr-4">
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-500" />
                        <span className="text-sm font-medium">Duration: {option.duration}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Departure: {option.departureTime}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-sm font-medium">Arrival: {option.arrivalTime}</span>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-gray-700 text-sm">{option.description}</p>
                    
                    {option.transfers > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faTrain} className="text-yellow-600 mr-2" />
                          <p className="text-sm font-medium">
                            Transfers: {option.transfers}
                          </p>
                        </div>
                        {option.transferDetails && (
                          <ul className="text-xs text-gray-600 ml-7 mt-2 list-disc">
                            {option.transferDetails.map((detail, idx) => (
                              <li key={idx}>{detail}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
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
                    
                    <div className="mt-auto pt-4 flex justify-end">
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
              variant="bordered"
              className="border-red-500 text-red-500"
            >
              Back to Accommodations
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
                "Continue to Activities"
              )}
            </Button>
          </div>
        </Card>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>All prices include taxes and fees. Capital One Travel price match guarantee applies.</p>
          <p>Flight times are shown in local time. Transportation options are subject to availability.</p>
        </div>
      </div>
    </div>
  );
};

export default TransportationPage;