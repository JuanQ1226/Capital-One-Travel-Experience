import { Card, Divider } from "@heroui/react";
import mainBg from "@/public/main_bg.jpg";
import { Button } from "@heroui/button";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faMapMarkedAlt, faDollar, faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function IndexPage() {
  return (
    <div className="flex flex-col md:flex-row w-full overflow-hidden">
      {/* Left Section - Hero Image & CTA Card */}
      <div className="relative w-full md:w-1/2 lg:w-7/12 h-[40vh] md:h-screen min-h-screen flex items-center justify-center">
        <Card className="aspect-auto w-5/6 md:w-3/4 max-w-md absolute z-10 p-6 md:p-8 bg-white rounded-lg shadow-2xl text-center flex flex-col items-center justify-center gap-3 md:gap-4">
          <h1 className="font-semibold font-serif text-3xl md:text-4xl">
            Discover Your Next Adventure
          </h1>
          <p className="mt-1 md:mt-2 text-gray-600 text-base md:text-lg">
            Discover the world with our travel recommendations platform.
          </p>
          <Link href="/user-form">
            <Button size="lg" className="mt-4 md:mt-6 bg-red-600 text-white hover:bg-red-700 px-6 md:px-8 py-2 md:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </Card>
        <div className="w-full h-full relative">
          <Image
            src="/main_bg.jpg"
            alt="Travel Destination"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      {/* Right Section - Features */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center justify-start px-6 md:px-12 py-8 md:py-10 bg-white">
        <div className="text-center mb-6 md:mb-8">
          <p className="mt-2 md:mt-3 font-semibold text-xl md:text-3xl">
            Your gateway to unforgettable journeys.
          </p>
        </div>
        
        <Divider className="w-full md:w-3/4 my-4 md:my-6" />
        
        <div className="grid gap-6 md:gap-12 w-full max-w-xl">
          {/* Feature 1 */}
          <div className="p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 hover:bg-red-50/30">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-red-100 rounded-full">
                <FontAwesomeIcon
                  icon={faMapMarkedAlt}
                  className="text-2xl md:text-3xl text-red-600"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-serif">Smart Destinations</h2>
            </div>
            <p className="mt-3 md:mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
              Personalized recommendations tailored to your preferences, making travel planning a breeze.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 hover:bg-red-50/30">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-red-100 rounded-full">
                <FontAwesomeIcon
                  icon={faPlaneDeparture}
                  className="text-2xl md:text-3xl text-red-600"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-serif">Custom Itineraries</h2>
            </div>
            <p className="mt-3 md:mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
              AI-powered trip plans based on your preferences and spending habits, making planning effortless.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card p-4 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 hover:bg-red-50/30">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-red-100 rounded-full">
                <FontAwesomeIcon
                  icon={faDollar}
                  className="text-2xl md:text-3xl text-red-600"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-serif">Money-Saving Deals</h2>
            </div>
            <p className="mt-3 md:mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
              Smart budget optimization that finds the best discounts and cashback offers for cost-effective trips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
