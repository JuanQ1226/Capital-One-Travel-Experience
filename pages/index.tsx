import { Card, Divider } from "@heroui/react";
import mainBg from "@/public/main_bg.jpg";
import { Button } from "@heroui/button";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faMapMarkedAlt, faDollar, faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";

export default function IndexPage() {
  return (
    <div className={"flex flex-row h-screen w-full"}>
      <div className="relative w-1/2 flex items-center justify-center">
        <Card className="aspect-square absolute z-10 p-4 bg-white rounded-lg shadow-lg text-center flex flex-col items-center justify-center gap-4">
            <h1 className="font-semibold font-serif text-4xl">
              Book your Next Trip
            </h1>
            <p className="mt-2 text-gray-600">
              Discover the world with our travel booking platform.
            </p>
          <Link href="/user-form">
            <Button size="lg" className="mt-4 bg-black text-white hover:bg-gray-800">
              Get Started
            </Button>
          </Link>
        </Card>
        <img
          src="/main_bg.jpg"
          alt="Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="w-1/2 flex flex-col items-center container mx-auto max-w-3xl bg-white gap-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className={`font-serif text-6xl text-black font-bold`}>
            Capital Travel
          </h1>
          <p className="mt-2 text-black text-2xl">
            Your gateway to unforgettable journeys.
          </p>
        </div>
        <Divider/>
        <div>
          <div>
            <FontAwesomeIcon
              icon={faMapMarkedAlt}
              className="text-4xl text-black mt-4"
            />
            <h2 className="text-4xl font-bold text-black mt-4 font-serif">Smart Destinations</h2>
          </div>
          <p className="mt-2 text-black text-lg">
            Personalized Recommendations - Our AI will suggest destinations
            based on your preferences, making travel planning a breeze.
          </p>
        <div>
          <div>
            <FontAwesomeIcon
              icon={faPlaneDeparture}
              className="text-4xl text-black mt-4"
            />
            <h2 className="text-4xl font-bold text-black mt-4 font-serif">Custom Itineraries</h2>
          </div>
          <p className="mt-2 text-black text-lg">
            AI-Powered Itineraries - We&apos;ll use AI to create personalized
            trip plans based on past travels and spending habits, making
            planning effortless.
          </p>
          </div>
          <div>
            <div className="">
              <FontAwesomeIcon
                icon={faDollar}
                className="text-4xl text-black mt-4"
              />
              <h2 className="text-4xl font-bold font-serif text-black mt-4">Money-Saving Deals</h2>
            </div>
            <p className="mt-2 text-black text-lg">
              Smart Budget & Deals - Our system will find the best discounts
              and cashback offers, ensuring every trip is cost-effective and
              rewarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
