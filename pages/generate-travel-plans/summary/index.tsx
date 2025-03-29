import React, { useState, useEffect } from "react";
import { Card, Button, Progress, Badge, Chip } from "@heroui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faDollarSign,
  faHotel,
  faPlane,
  faTicketAlt,
  faStar,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TripSummaryPage = () => {
  const router = useRouter();
  const [tripData, setTripData] = useState<{
    country: any;
    accommodation: any;
    transportation: any;
    activities: any;
    userInfo: {
      budget: string;
      purpose: string;
      startDate: string;
      endDate: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    // Retrieve all data from local storage
    try {
      const country = localStorage.getItem("countryData")
        ? JSON.parse(localStorage.getItem("countryData")!)
        : null;
      const accommodation = localStorage.getItem("selectedAccommodation")
        ? JSON.parse(localStorage.getItem("selectedAccommodation")!)
        : null;
      const transportation = localStorage.getItem("selectedTransportation")
        ? JSON.parse(localStorage.getItem("selectedTransportation")!)
        : null;
      const activities = localStorage.getItem("selectedActivities")
        ? JSON.parse(localStorage.getItem("selectedActivities")!)
        : null;

      // Get user input info
      const userInfo = {
        budget: localStorage.getItem("budget") || "",
        purpose: localStorage.getItem("purpose") || "",
        startDate: localStorage.getItem("startDate") || "",
        endDate: localStorage.getItem("endDate") || "",
      };

      console.log("Trip data loaded from localStorage:", {
        country,
        accommodation,
        transportation,
        activities,
        userInfo,
      });

      setTripData({
        country,
        accommodation,
        transportation,
        activities,
        userInfo,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading trip data from localStorage:", error);
      setLoading(false);
    }
  }, []);

  const handleSaveTrip = async () => {
    setSaveStatus("saving");
    try {
      const result = await fetch("/api/store-user-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripData,
        }),
      });
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving trip:", error);
      setSaveStatus("error");
    }
  };

  const handleStartOver = () => {
    localStorage.clear();
    router.push("/user-form");
  };

  // Calculate the total cost
  const calculateTotalCost = () => {
    let total = 0;
    if (tripData?.accommodation?.totalPrice) {
      total += tripData.accommodation.totalPrice;
    }
    if (tripData?.transportation?.price) {
      total += tripData.transportation.price;
    }
    if (tripData?.activities) {
      total += tripData.activities.reduce((acc: number, activity: any) => {
        return acc + (activity.cost || 0);
      }, 0);
    }
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card radius="md" shadow="md" className="p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Loading your trip summary...
          </h2>
          <Progress className="w-full" color="danger" value={100} />
        </Card>
      </div>
    );
  }

  if (
    !tripData ||
    !tripData.country ||
    !tripData.accommodation ||
    !tripData.transportation
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card
          radius="md"
          shadow="md"
          className="p-6 bg-white text-center max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4">
            Trip Information Not Found
          </h2>
          <p className="mb-6">
            We couldn't find your complete trip details. You may need to
            complete the planning process.
          </p>
          <Button
            as={Link}
            href="/user-form"
            className="bg-red-500 hover:bg-red-800 text-white"
          >
            Start Planning
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
            value={100}
            label="Step 4 of 4: Trip Summary"
            showValueLabel={true}
          />
        </div>

        <Card radius="md" shadow="md" className="bg-white mb-6 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Your Trip to {tripData.country.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-600">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <span>
                  {tripData.userInfo.startDate} to {tripData.userInfo.endDate}
                </span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                <span>Budget: {tripData.userInfo.budget}</span>
              </div>
            </div>
            <p className="text-gray-700">{tripData.country.description}</p>
          </div>

          {/* Accommodation */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faHotel} className="mr-3 text-red-500" />
              Accommodation
            </h2>
            <Card shadow="sm" radius="md" className="overflow-hidden mb-4">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48">
                  <img
                    src={tripData.accommodation.imageUrl}
                    alt={tripData.accommodation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:w-2/3">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-xl font-bold">
                      {tripData.accommodation.name}
                    </h3>
                    <span className="font-bold">
                      ${tripData.accommodation.totalPrice}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="mr-1 text-gray-500"
                    />
                    <span className="text-gray-700">
                      {tripData.accommodation.location}
                    </span>
                    <span className="mx-2">•</span>
                    <FontAwesomeIcon
                      icon={faStar}
                      className="mr-1 text-yellow-500"
                    />
                    <span>{tripData.accommodation.rating}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    {tripData.accommodation.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tripData.accommodation.amenities
                      .slice(0, 4)
                      .map((amenity: string, i: number) => (
                        <Badge
                          key={i}
                          variant="flat"
                          color="primary"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    {tripData.accommodation.amenities.length > 4 && (
                      <Badge variant="flat" color="primary" className="text-xs">
                        +{tripData.accommodation.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Transportation */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faPlane} className="mr-3 text-red-500" />
              Transportation
            </h2>
            <Card shadow="sm" radius="md" className="p-4 mb-4">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-bold">
                  {tripData.transportation.name}
                </h3>
                <span className="font-bold">
                  ${tripData.transportation.price}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-gray-700">
                  {tripData.transportation.provider}
                </span>
                <span className="mx-2">•</span>
                <span>{tripData.transportation.duration}</span>
              </div>
              <p className="text-gray-700 text-sm mb-3">
                {tripData.transportation.description}
              </p>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md text-sm">
                <div>
                  <div className="font-semibold">Departure</div>
                  <div>{tripData.transportation.departureTime}</div>
                </div>
                <div className="border-t-2 border-gray-400 w-10 md:w-24"></div>
                <div>
                  <div className="font-semibold">Arrival</div>
                  <div>{tripData.transportation.arrivalTime}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Activities */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FontAwesomeIcon
                icon={faTicketAlt}
                className="mr-3 text-red-500"
              />
              Activities
            </h2>
            {tripData.activities && (
              <>
                <p className="mb-4 text-gray-700">
                  {tripData.activities.overview}
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between">
                    <span>
                      Total Activities: {tripData.activities.totalActivities}
                    </span>
                    <span>
                      Total Cost: $
                      {tripData.activities.reduce(
                        (acc: number, activity: any) => {
                          return acc + (activity.cost || 0);
                        },
                        0
                      )}
                    </span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {tripData.activities &&
                    tripData.activities.map((activity: any, idx: number) => (
                      <Card
                        key={activity.id || idx}
                        shadow="sm"
                        radius="md"
                        className="p-4 mb-4"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold">{activity.name}</span>
                          <Chip>{activity.type}</Chip>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {activity.startTime} - {activity.endTime} • $
                          {activity.cost}
                        </div>
                        {activity.description && (
                          <p className="text-sm text-gray-700 mb-2">
                            {activity.description}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-gray-500">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="mr-1"
                          />
                          <span>{activity.location}</span>
                          {activity.bookingRequired && (
                            <span className="ml-2 text-red-500">
                              Booking required
                            </span>
                          )}
                        </div>
                        {activity.highlights &&
                          activity.highlights.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {activity.highlights
                                  .slice(0, 2)
                                  .map((highlight: string, i: number) => (
                                    <Badge
                                      key={i}
                                      variant="flat"
                                      color="warning"
                                      className="text-xs"
                                    >
                                      {highlight}
                                    </Badge>
                                  ))}
                                {activity.highlights.length > 2 && (
                                  <Badge
                                    variant="flat"
                                    color="warning"
                                    className="text-xs"
                                  >
                                    +{activity.highlights.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                      </Card>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* Trip Cost Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-2">Trip Cost Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Accommodation:</span>
              <span>${tripData.accommodation.totalPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Transportation:</span>
              <span>${tripData.transportation.price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Activities:</span>
              <span>
                $
                {tripData.activities
                  ? tripData.activities.reduce(
                      (acc: number, curr: any) => (acc + curr.cost) as number,
                      0
                    )
                  : 0}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
              <span>Total Cost:</span>
              <span>${calculateTotalCost()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <Button
              onPress={handleStartOver}
              variant="bordered"
              className="border-red-500 text-red-500"
            >
              Start Over
            </Button>
            <Button
              onPress={handleSaveTrip}
              disabled={saveStatus === "saving" || saveStatus === "saved"}
              className={`${
                saveStatus === "saved"
                  ? "bg-green-500"
                  : saveStatus === "saving"
                    ? "bg-gray-400"
                    : "bg-red-500 hover:bg-red-800"
              } text-white`}
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "Trip Saved!"
                  : "Save Trip"}
            </Button>
          </div>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          <p>
            This trip was generated based on your preferences by Capital One
            Travel AI.
          </p>
          <p>
            Prices and availability may vary. Please confirm before booking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripSummaryPage;
