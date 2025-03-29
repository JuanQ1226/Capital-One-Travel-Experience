import { Image } from "@heroui/react";
import mainBg from "@/public/main_bg.jpg";
import { Button } from "@heroui/button";
import { Roboto } from "next/font/google";
import Link from "next/link";

// Importing the Roboto font\
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export default function IndexPage() {
  return (
    <div className={`relative z-0 flex flex-col items-center justify-center min-h-screen bg-gray-100 ${roboto.className}`}>
      <div className="absolute inset-0 bg-gray-900 opacity-50 w-full h-full -z-9"></div>
      <img
        className="absolute inset-0 object-cover w-full h-full -z-10" 
        src="/main_bg.jpg" 
        alt="Background image"
      />
      
      {/* Content container with text and button */}
      <div className="z-10 max-w-3xl mx-auto text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Capital One Travel Experience
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8">
          Let our AI create a personalized travel itinerary based on your preferences and past experiences.
        </p>
        <div className="mb-6 text-white text-lg">
          Using your travel history and preferences to craft the perfect journey for you.
        </div>
        <Button
          as={Link}
          href="/user-form"
          className="bg-red-500 hover:bg-red-800 text-white font-semibold py-3 px-8 text-lg rounded-lg shadow-lg transition-all"
        >
          Create My Custom Itinerary
        </Button>
      </div>
    </div>
  );
}
