import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, Spinner, Progress, Chip } from "@heroui/react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faMapMarkerAlt, 
  faClock, 
  faTicketAlt, 
  faUtensils, 
  faLandmark, 
  faCamera, 
  faHiking, 
  faUmbrellaBeach, 
  faCalendarDay, 
  faMoneyBillWave,
  faShoppingBag,
  faGlassCheers,
  faMusic,
  faPalette,
  faTree
} from "@fortawesome/free-solid-svg-icons";

type ActivitiesData = {
  destination: string;
  startDate: string;
  endDate: string;
  days: ActivityDay[];
  totalActivities: number;
  totalCost: number;
  overview: string;
};

type ActivityDay = {
  date: string;
  dayNumber: number;
  activities: Activity[];
};

type Activity = {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  cost: number;
  currency: string;
  bookingRequired: boolean;
  bookingUrl?: string;
  highlights?: string[];
  promoAvailable?: boolean;
  savings?: number;
};

interface ActivitiesPageProps {
  activitiesData: ActivitiesData | null;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<ActivitiesPageProps> = async (context) => {
  try {
    const { data } = context.query;
    
    // If data exists in the query params, parse it
    if (data && typeof data === "string") {
      const parsedData = JSON.parse(data);
      return {
        props: {
          activitiesData: parsedData,
        },
      };
    }

    // Mock data if nothing is passed via query
    const mockData: ActivitiesData = {
      destination: "Tokyo, Japan",
      startDate: "2025-05-10",
      endDate: "2025-05-15",
      totalActivities: 12,
      totalCost: 850,
      overview: "Your custom Tokyo itinerary features a blend of iconic landmarks, cultural experiences, and local favorites. Each day is balanced with morning, afternoon, and evening activities while allowing free time to explore at your own pace.",
      days: [
        {
          date: "2025-05-10",
          dayNumber: 1,
          activities: [
            {
              id: 1,
              name: "Arrival and Check-in",
              type: "travel",
              description: "Arrive at your accommodation and get settled in. Take some time to rest after your journey.",
              location: "Hotel in Shinjuku",
              startTime: "14:00",
              endTime: "16:00",
              cost: 0,
              currency: "JPY",
              bookingRequired: false,
              highlights: ["Welcome amenities", "Orientation to neighborhood"]
            },
            {
              id: 2,
              name: "Evening Stroll in Shinjuku",
              type: "sightseeing",
              description: "Take an evening walk to see the neon lights and vibrant atmosphere of Shinjuku. Perfect introduction to Tokyo's energy.",
              location: "Shinjuku District",
              startTime: "18:00",
              endTime: "20:00",
              cost: 0,
              currency: "JPY",
              bookingRequired: false
            },
            {
              id: 3,
              name: "Dinner at Izakaya",
              type: "dining",
              description: "Enjoy your first dinner in Tokyo at a traditional izakaya (Japanese pub) with variety of small dishes to share.",
              location: "Omoide Yokocho",
              startTime: "20:30",
              endTime: "22:30",
              cost: 40,
              currency: "USD",
              bookingRequired: false,
              promoAvailable: true,
              savings: 15,
              highlights: ["Local specialties", "Authentic atmosphere"]
            }
          ]
        },
        {
          date: "2025-05-11",
          dayNumber: 2,
          activities: [
            {
              id: 4,
              name: "Tokyo National Museum",
              type: "cultural",
              description: "Explore Japan's largest art museum with artifacts dating back to 10,000 BC including samurai swords, kimonos, and ancient pottery.",
              location: "Ueno Park",
              startTime: "09:30",
              endTime: "12:30",
              cost: 25,
              currency: "USD",
              bookingRequired: true,
              bookingUrl: "https://www.tnm.jp/modules/r_free_page/index.php?id=113"
            },
            {
              id: 5,
              name: "Lunch at Sushi Restaurant",
              type: "dining",
              description: "Experience authentic sushi prepared by skilled chefs using the freshest ingredients.",
              location: "Tsukiji Outer Market",
              startTime: "13:00",
              endTime: "14:30",
              cost: 60,
              currency: "USD",
              bookingRequired: true,
              promoAvailable: true,
              savings: 20
            },
            {
              id: 6,
              name: "Shibuya Crossing & Shopping",
              type: "sightseeing",
              description: "Visit the famous Shibuya Crossing, one of the busiest intersections in the world, then explore the trendy shops around the area.",
              location: "Shibuya District",
              startTime: "15:30",
              endTime: "19:00",
              cost: 0,
              currency: "USD",
              bookingRequired: false,
              highlights: ["People watching", "Contemporary fashion", "Photo opportunities"]
            }
          ]
        },
        {
          date: "2025-05-12",
          dayNumber: 3,
          activities: [
            {
              id: 7,
              name: "Meiji Shrine",
              type: "cultural",
              description: "Visit Tokyo's most famous Shinto shrine dedicated to Emperor Meiji and Empress Shoken, set in a peaceful forest.",
              location: "Shibuya",
              startTime: "09:00",
              endTime: "11:00",
              cost: 0,
              currency: "USD",
              bookingRequired: false,
              highlights: ["Traditional ceremonies", "Peaceful gardens", "Spiritual atmosphere"]
            },
            {
              id: 8,
              name: "Harajuku Exploration",
              type: "sightseeing",
              description: "Discover Japan's youth culture and fashion scene along Takeshita Street with its colorful shops and crepe stands.",
              location: "Harajuku",
              startTime: "11:30",
              endTime: "14:30",
              cost: 30,
              currency: "USD",
              bookingRequired: false
            },
            {
              id: 9,
              name: "Tokyo Tower Sunset View",
              type: "sightseeing",
              description: "Take in panoramic views of Tokyo from the observation deck as the sun sets and the city lights come alive.",
              location: "Tokyo Tower",
              startTime: "17:00",
              endTime: "19:00",
              cost: 25,
              currency: "USD",
              bookingRequired: true,
              bookingUrl: "https://www.tokyotower.co.jp/en/",
              promoAvailable: true,
              savings: 8
            }
          ]
        }
      ]
    };

    return {
      props: {
        activitiesData: mockData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    
    // Return null data and potentially an error message
    return {
      props: {
        activitiesData: null,
        error: "Failed to load activities data",
      },
    };
  }
};

const ActivitiesPage = ({ activitiesData, error }: ActivitiesPageProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>(
    activitiesData?.days.map(day => day.dayNumber) || []
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle back to transportation page
  const handleBack = () => {
    router.back();
  };

  // Toggle selection of a day's activities
  const toggleDaySelection = (dayNumber: number) => {
    if (selectedDays.includes(dayNumber)) {
      setSelectedDays(selectedDays.filter(day => day !== dayNumber));
    } else {
      setSelectedDays([...selectedDays, dayNumber]);
    }
  };

  // Check if all activities in a day are selected
  const isDaySelected = (dayNumber: number) => {
    return selectedDays.includes(dayNumber);
  };

  // Handle continue to the final itinerary
  const handleContinue = async () => {
    if (selectedDays.length === 0) return;
    
    setLoading(true);
    try {
      // Filter selected activities based on selected days
      const selectedActivities = activitiesData?.days
        .filter(day => selectedDays.includes(day.dayNumber))
        .flatMap(day => day.activities);
      
      // Store selected activities in local storage
      localStorage.setItem("selectedActivities", JSON.stringify(selectedActivities));
      
      // Get other trip data from local storage
      router.push("/generate-travel-plans/summary");
    } catch (error) {
      console.error("Error generating itinerary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "sightseeing": return faCamera;
      case "cultural": return faLandmark;
      case "dining": return faUtensils;
      case "outdoor": return faHiking;
      case "beach": return faUmbrellaBeach;
      case "shopping": return faShoppingBag;
      case "entertainment": return faGlassCheers;
      case "music": return faMusic;
      case "art": return faPalette;
      case "nature": return faTree;
      case "travel": return faMapMarkerAlt;
      default: return faMapMarkerAlt;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error || !activitiesData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card radius="md" shadow="md" className="p-6 bg-white text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">
            {error || "We couldn't load your activities. Please try again."}
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
            value={90}
            label="Step 4 of 4: Activity Selection"
            showValueLabel={true}
          />
        </div>

        <Card radius="md" shadow="md" className="bg-white mb-6 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Your {activitiesData.destination} Experience</h1>
            <p className="text-gray-600">
              {new Date(activitiesData.startDate).toLocaleDateString()} - {new Date(activitiesData.endDate).toLocaleDateString()} 
              • {activitiesData.totalActivities} Activities
            </p>
            <p className="mt-4 text-gray-700">
              {activitiesData.overview}
            </p>
          </div>

          {/* Activity timeline */}
          <div className="mt-8">
            {activitiesData.days.map((day) => (
              <div key={day.dayNumber} className="mb-10">
                {/* Day header with toggle selection */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Day {day.dayNumber}</h2>
                    <p className="text-gray-600">{formatDate(day.date)}</p>
                  </div>
                  <Button
                    color={isDaySelected(day.dayNumber) ? "danger" : "default"}
                    variant={isDaySelected(day.dayNumber) ? "solid" : "bordered"}
                    onPress={() => toggleDaySelection(day.dayNumber)}
                    className={isDaySelected(day.dayNumber) ? "bg-red-500 text-white" : "border-red-500 text-red-500"}
                    size="sm"
                  >
                    {isDaySelected(day.dayNumber) ? "Selected" : "Select Day"}
                  </Button>
                </div>

                {/* Vertical timeline for the day's activities */}
                <div className="mt-4 relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 h-full border-l-2 border-gray-200"></div>
                  
                  {/* Activities */}
                  {day.activities.map((activity, index) => (
                    <div key={activity.id} className="mb-6 relative">
                      {/* Timeline dot */}
                      <div className="absolute left-5 -ml-2.5 mt-1.5 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center z-10">
                        <FontAwesomeIcon 
                          icon={getActivityIcon(activity.type)} 
                          className="text-white text-xs" 
                        />
                      </div>

                      {/* Activity card offset to the right of timeline */}
                      <div className="ml-12">
                        <Card radius="md" shadow="sm" className={`p-4 border-l-4 ${
                          activity.type === 'dining' ? 'border-orange-500' : 
                          activity.type === 'cultural' ? 'border-purple-500' : 
                          activity.type === 'sightseeing' ? 'border-blue-500' : 
                          activity.type === 'travel' ? 'border-gray-500' : 
                          'border-green-500'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">{activity.name}</h3>
                            <Chip className={`text-xs px-2 py-1 ${
                              activity.type === 'dining' ? 'bg-orange-100 text-orange-800' : 
                              activity.type === 'cultural' ? 'bg-purple-100 text-purple-800' : 
                              activity.type === 'sightseeing' ? 'bg-blue-100 text-blue-800' : 
                              activity.type === 'travel' ? 'bg-gray-100 text-gray-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {activity.type}
                            </Chip>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <FontAwesomeIcon icon={faClock} className="mr-1" /> 
                            {activity.startTime} - {activity.endTime}
                            <span className="mx-3">•</span>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" /> 
                            {activity.location}
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3">{activity.description}</p>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              {activity.cost > 0 ? (
                                <span className="inline-flex items-center text-sm">
                                  <span className="font-medium">${activity.cost}</span>
                                  {activity.promoAvailable && (
                                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center">
                                      <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                                      Save ${activity.savings}
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span className="text-sm text-green-600 font-medium">Free</span>
                              )}
                            </div>
                            
                            {activity.bookingRequired && (
                              <div>
                                <Chip color="warning" className="text-xs">
                                  Booking Required
                                </Chip>
                              </div>
                            )}
                          </div>
                          
                          {activity.highlights && activity.highlights.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs font-medium text-gray-700 mb-1">Highlights:</p>
                              <div className="flex flex-wrap gap-1">
                                {activity.highlights.map((highlight, idx) => (
                                  <span key={idx} className="text-xs text-gray-600">
                                    {idx > 0 ? ' • ' : ''}{highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-12">
            <Button
              onPress={handleBack}
              variant="bordered"
              className="border-red-500 text-red-500"
            >
              Back to Transportation
            </Button>
            <Button
              onPress={handleContinue}
              disabled={selectedDays.length === 0 || loading}
              className={`${selectedDays.length === 0 || loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-800"} text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" color="white" className="mr-2" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Create Final Itinerary"
              )}
            </Button>
          </div>
        </Card>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Activities are curated based on your preferences and travel style.</p>
          <p>All bookings can be managed through Capital One Travel after finalizing your itinerary.</p>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;