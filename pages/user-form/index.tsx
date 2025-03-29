import { Calendar, Card, DatePicker, DateValue, Input, Select, SelectItem, Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faHeart, faHiking, faUmbrellaBeach, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

export const PurposeOptions = [
  {id:1, value: "business", label: "Business", icon: faBriefcase },
  {id:2, value: "leisure", label: "Leisure", icon: faUmbrellaBeach },
  {id:3, value: "family", label: "Family", icon: faUsers },
  {id:4, value: "adventure", label: "Adventure", icon: faHiking },
  {id:5, value: "romantic", label: "Romantic", icon: faHeart },
];

const UserFormPage = () => {
  const [startDate, setStartDate] = React.useState<CalendarDate | null>(null);
  const [endDate, setEndDate] = React.useState<CalendarDate | null>(null);
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const startDate = new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const endDate = new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate() + 7
    );
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Gather form data
      const formData = {
        startDate: startDate?.toString(),
        endDate: endDate?.toString(),
        budget: budget,
        purpose: purpose
      };
      
      // Make API request
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }
      
      const itineraryData = await response.json();
      
      // Navigate to results page with the data
      router.push({
        pathname: '/generate-travel-plans/destination',
        query: { data: JSON.stringify(itineraryData) }
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Handle error (show error message to user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Card radius="md" shadow="md" className="p-6 bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center bg-white gap-4"
        >
          <h1 className="text-4xl font-bold mb-4 text-black">
            Plan Your Journey
          </h1>
          <p className="text-tiny mb-4 text-gray-700">
            Let our AI create a personalized travel itinerary based on your
            preferences and past experiences.
          </p>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col justify-center items-center">
              <p className="text-tiny mb-2 text-gray-700">
                Select a Start Date
              </p>
              <DatePicker
                label="Select a Start Date"
                size="lg"
                title="Select a Start Date"
                value={startDate}
                onChange={setStartDate}
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-tiny mb-2 text-gray-700">Select an End Date</p>
              <DatePicker
                size="lg"
                label="Select an End Date"
                title="Select an End Date"
                value={endDate}
                onChange={setEndDate}
              />
            </div>
          </div>
          <Input 
            label="What is your Budget?" 
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            type="number"
            required
          />
          <Select 
            label="What is the purpose of your trip?" 
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          >
            {PurposeOptions.map((option) => (
              <SelectItem startContent={<FontAwesomeIcon icon={option.icon}/>} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          
          <Button 
            type="submit" 
            color="primary" 
            size="lg" 
            className="mt-4 bg-red-500 hover:bg-red-800 text-white"
            isLoading={loading}
            disabled={loading}
          >
            {loading ? "Generating Itinerary..." : "Create My Itinerary"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UserFormPage;
