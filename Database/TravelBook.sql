--DROP SCHEMA public CASCADE;

-- Create the database
CREATE DATABASE "CapitalOneTravel";
--\c CapitalOneTravel;

-- Create the schema
CREATE SCHEMA travel_schema;

-- Create Clients table
CREATE TABLE travel_schema."Clients" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "phone" VARCHAR(20),
  "capital_one_id" VARCHAR(50) UNIQUE NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Trips table
CREATE TABLE travel_schema."Trips" (
  "id" SERIAL PRIMARY KEY,
  "client_id" INT NOT NULL,
  "destination" VARCHAR(100) NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "total_cost" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  "status" VARCHAR(20) DEFAULT 'Planned' CHECK ("status" IN ('Planned', 'Booked', 'Completed', 'Cancelled')),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("client_id") REFERENCES travel_schema."Clients" ("id") ON DELETE CASCADE
);

-- Create Transactions table
CREATE TABLE travel_schema."Transactions" (
  "id" SERIAL PRIMARY KEY,
  "trip_id" INT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "transaction_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "merchant" VARCHAR(100),
  "category" VARCHAR(50),
  "status" VARCHAR(20) DEFAULT 'Pending' CHECK ("status" IN ('Pending', 'Confirmed', 'Cancelled')),
  FOREIGN KEY ("trip_id") REFERENCES travel_schema."Trips" ("id") ON DELETE CASCADE
);

-- Create Services table
CREATE TABLE travel_schema."Services" (
  "id" SERIAL PRIMARY KEY,
  "transaction_id" INT NOT NULL,
  "service_type" VARCHAR(50) NOT NULL CHECK ("service_type" IN ('Flight', 'Hotel', 'Rental Car', 'Activity')),
  "provider" VARCHAR(100) NOT NULL,
  "booking_date" DATE NOT NULL,
  "cost" DECIMAL(10,2) NOT NULL,
  FOREIGN KEY ("transaction_id") REFERENCES travel_schema."Transactions" ("id") ON DELETE CASCADE
);

-- Create Itineraries table
CREATE TABLE travel_schema."Itineraries" (
  "id" SERIAL PRIMARY KEY,
  "trip_id" INT NOT NULL,
  "day_number" INT NOT NULL CHECK ("day_number" > 0),
  "schedule" TEXT NOT NULL,
  FOREIGN KEY ("trip_id") REFERENCES travel_schema."Trips" ("id") ON DELETE CASCADE
);

-- Create Activities table
CREATE TABLE travel_schema."Activities" (
  "id" SERIAL PRIMARY KEY,
  "itinerary_id" INT NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "category" VARCHAR(50) CHECK ("category" IN ('Sightseeing', 'Adventure', 'Dining', 'Relaxation', 'Shopping', 'Travel', 'Beach' ,'History' )),
  "location" VARCHAR(100),
  "start_time" TIME NOT NULL,
  "end_time" TIME NOT NULL,
  "cost" DECIMAL(10,2) DEFAULT 0 NOT NULL,
  FOREIGN KEY ("itinerary_id") REFERENCES travel_schema."Itineraries" ("id") ON DELETE CASCADE
);

-- Create Reviews table
CREATE TABLE travel_schema."Reviews" (
  "id" SERIAL PRIMARY KEY,
  "trip_id" INT NOT NULL,
  "rating" INT NOT NULL CHECK ("rating" BETWEEN 1 AND 5),
  "comments" TEXT,
  "review_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("trip_id") REFERENCES travel_schema."Trips" ("id") ON DELETE CASCADE
);

-- Adding Comments
COMMENT ON COLUMN travel_schema."Clients"."capital_one_id" IS 'Client''s Capital One identifier';
COMMENT ON COLUMN travel_schema."Trips"."total_cost" IS 'May be 0 if no purchases yet';
COMMENT ON COLUMN travel_schema."Trips"."status" IS 'Planned, Booked, Completed, Cancelled';
COMMENT ON COLUMN travel_schema."Transactions"."category" IS 'e.g., Flight, Hotel, Food, Activity';
COMMENT ON COLUMN travel_schema."Transactions"."status" IS 'Pending, Confirmed, Cancelled';
COMMENT ON COLUMN travel_schema."Services"."service_type" IS 'e.g., Flight, Hotel, Rental Car';
COMMENT ON COLUMN travel_schema."Itineraries"."day_number" IS 'Day number within the trip';
COMMENT ON COLUMN travel_schema."Itineraries"."schedule" IS 'Detailed schedule for the day';
COMMENT ON COLUMN travel_schema."Activities"."category" IS 'e.g., Sightseeing, Adventure, Dining';
COMMENT ON COLUMN travel_schema."Reviews"."rating" IS '1-5 scale';



-- Inserting data into Clients table
INSERT INTO travel_schema."Clients" ("id", "name", "email", "phone", "capital_one_id", "created_at")
VALUES
(1, 'John Doe', 'johndoe@email.com', '123-456-7890', 'C1A23B4567', '2020-01-01'),
(2, 'Jane Smith', 'janesmith@email.com', '987-654-3210', 'C2A23B4567', '2021-02-15');

-- Inserting data into Trips table
INSERT INTO travel_schema."Trips" ("id", "client_id", "destination", "start_date", "end_date", "total_cost", "status", "created_at")
VALUES
(1, 1, 'Italy', '2020-06-01', '2020-06-10', 1500.00, 'Completed', '2020-01-15'),
(2, 2, 'Hawaii', '2021-07-01', '2021-07-10', 2000.00, 'Completed', '2021-02-20');

-- Inserting data into Transactions table (no itineraries, activities, or reviews)
INSERT INTO travel_schema."Transactions" ("id", "trip_id", "amount", "transaction_date", "merchant", "category", "status")
VALUES
(1, 1, 1000.00, '2020-05-15', 'Airline', 'Flight', 'Confirmed'),
(2, 2, 1200.00, '2021-06-15', 'Hotel', 'Hotel Booking', 'Confirmed');

-- Inserting data into Services table (basic services without detailed data)
INSERT INTO travel_schema."Services" ("id", "transaction_id", "service_type", "provider", "booking_date", "cost")
VALUES
(1, 1, 'Flight', 'Airline Co.', '2020-05-10', 800.00),
(2, 2, 'Hotel', 'Grand Hawaii Resort', '2021-06-10', 1000.00);



-- Inserting data into Clients table
INSERT INTO travel_schema."Clients" ("id", "name", "email", "phone", "capital_one_id", "created_at")
VALUES
(3, 'Emily White', 'emilywhite@email.com', '555-123-4567', 'C3A23B4567', '2022-03-10');

-- Inserting data into Trips table (full trip with itineraries and reviews)
INSERT INTO travel_schema."Trips" ("id", "client_id", "destination", "start_date", "end_date", "total_cost", "status", "created_at")
VALUES
(3, 3, 'Japan', '2022-05-01', '2022-05-10', 2500.00, 'Completed', '2022-03-15');

-- Inserting data into Transactions table
INSERT INTO travel_schema."Transactions" ("id", "trip_id", "amount", "transaction_date", "merchant", "category", "status")
VALUES
(3, 3, 1500.00, '2022-04-10', 'Japan Airlines', 'Flight', 'Confirmed'),
(4, 3, 600.00, '2022-04-15', 'Hotel Tokyo', 'Hotel Booking', 'Confirmed'),
(5, 3, 400.00, '2022-04-18', 'Activity Booking', 'Sightseeing Tour', 'Confirmed');

-- Inserting data into Services table (services for each transaction)
INSERT INTO travel_schema."Services" ("id", "transaction_id", "service_type", "provider", "booking_date", "cost")
VALUES
(3, 3, 'Flight', 'Japan Airlines', '2022-04-05', 1500.00),
(4, 4, 'Hotel', 'Hotel Tokyo', '2022-04-10', 600.00),
(5, 5, 'Activity', 'Tokyo Sightseeing Co.', '2022-04-12', 400.00);

-- Inserting data into Itineraries table (for the trip with a full itinerary)
INSERT INTO travel_schema."Itineraries" ("id", "trip_id", "day_number", "schedule")
VALUES
(1, 3, 1, 'Arrival in Tokyo, check into hotel, dinner at local restaurant'),
(2, 3, 2, 'Morning sightseeing tour, visit Tokyo Tower, lunch at Ramen restaurant'),
(3, 3, 3, 'Visit Senso-ji Temple, dinner at Sushi restaurant');

-- Inserting data into Activities table (activities for each day of the itinerary)
INSERT INTO travel_schema."Activities" ("id", "itinerary_id", "name", "category", "location", "start_time", "end_time", "cost")
VALUES
(1, 1, 'Flight to Tokyo', 'Travel', 'Tokyo Airport', '10:00', '12:00', 1500.00),
(2, 2, 'Sightseeing Tour', 'Sightseeing', 'Tokyo Tower', '09:00', '12:00', 200.00),
(3, 3, 'Visit Senso-ji Temple', 'Sightseeing', 'Asakusa', '10:00', '12:00', 100.00);

-- Inserting data into Reviews table (review for the trip)
INSERT INTO travel_schema."Reviews" ("id", "trip_id", "rating", "comments", "review_date")
VALUES
(1, 3, 5, 'Amazing trip, loved the sightseeing and food in Japan!', '2022-05-12');

-- Inserting data into Clients table
INSERT INTO travel_schema."Clients" ("id", "name", "email", "phone", "capital_one_id", "created_at")
VALUES
(4, 'Robert Green', 'robertgreen@email.com', '321-654-9870', 'C4A23B4567', '2021-05-01'),
(5, 'Alice Blue', 'aliceblue@email.com', '888-555-1234', 'C5A23B4567', '2022-07-20');

-- Inserting data into Trips table (one trip with no itineraries or activities, one with full details)
INSERT INTO travel_schema."Trips" ("id", "client_id", "destination", "start_date", "end_date", "total_cost", "status", "created_at")
VALUES
(4, 4, 'France', '2021-09-01', '2021-09-07', 1800.00, 'Completed', '2021-05-05'),
(5, 5, 'Canada', '2022-08-01', '2022-08-10', 2200.00, 'Completed', '2022-07-25');

-- Inserting data into Transactions table (France trip with basic transactions, Canada trip with full transactions)
INSERT INTO travel_schema."Transactions" ("id", "trip_id", "amount", "transaction_date", "merchant", "category", "status")
VALUES
(6, 4, 1200.00, '2021-08-15', 'Air France', 'Flight', 'Confirmed'),
(7, 4, 600.00, '2021-08-20', 'Hotel Paris', 'Hotel Booking', 'Confirmed'),
(8, 5, 1500.00, '2022-07-30', 'Air Canada', 'Flight', 'Confirmed'),
(9, 5, 700.00, '2022-08-05', 'Hotel Toronto', 'Hotel Booking', 'Confirmed'),
(10, 5, 500.00, '2022-08-08', 'Activity Booking', 'Niagara Falls Tour', 'Confirmed');

-- Inserting data into Services table (basic services without itineraries or activities)
INSERT INTO travel_schema."Services" ("id", "transaction_id", "service_type", "provider", "booking_date", "cost")
VALUES
(6, 6, 'Flight', 'Air France', '2021-08-10', 1200.00),
(7, 7, 'Hotel', 'Hotel Paris', '2021-08-15', 600.00),
(8, 8, 'Flight', 'Air Canada', '2022-07-25', 1500.00),
(9, 9, 'Hotel', 'Hotel Toronto', '2022-07-30', 700.00),
(10, 10, 'Activity', 'Niagara Falls Tours', '2022-08-03', 500.00);

-- Inserting data into Itineraries table (only for Canada trip with full details)
INSERT INTO travel_schema."Itineraries" ("id", "trip_id", "day_number", "schedule")
VALUES
(4, 5, 1, 'Arrival in Toronto, check into hotel, explore downtown'),
(5, 5, 2, 'Visit Niagara Falls, lunch at a local restaurant'),
(6, 5, 3, 'Day trip to Montreal, sightseeing and dinner at local bistro');

-- Inserting data into Activities table (activities for each day of the itinerary)
INSERT INTO travel_schema."Activities" ("id", "itinerary_id", "name", "category", "location", "start_time", "end_time", "cost")
VALUES
(4, 4, 'Flight to Toronto', 'Travel', 'Toronto Pearson Airport', '10:00', '12:00', 1500.00),
(5, 5, 'Niagara Falls Tour', 'Sightseeing', 'Niagara Falls', '09:00', '12:00', 300.00),
(6, 6, 'Sightseeing in Montreal', 'Sightseeing', 'Montreal', '10:00', '16:00', 200.00);

-- Inserting data into Reviews table (review for Canada trip)
INSERT INTO travel_schema."Reviews" ("id", "trip_id", "rating", "comments", "review_date")
VALUES
(2, 5, 5, 'Incredible trip, Niagara Falls was breathtaking, and Montreal was amazing!', '2022-08-12');






-- Inserting data into Trips table (Emily's trips with mixed reviews)
INSERT INTO travel_schema."Trips" ("id", "client_id", "destination", "start_date", "end_date", "total_cost", "status", "created_at")
VALUES
(6, 3, 'Australia', '2022-11-01', '2022-11-10', 2700.00, 'Completed', '2022-10-10'),
(7, 3, 'Spain', '2022-12-01', '2022-12-07', 2200.00, 'Completed', '2022-11-20'),
(8, 3, 'Germany', '2023-03-15', '2023-03-22', 2500.00, 'Completed', '2023-02-28'),
(9, 3, 'Brazil', '2023-06-01', '2023-06-10', 2000.00, 'Completed', '2023-05-15'),
(10, 3, 'South Africa', '2023-08-01', '2023-08-10', 1800.00, 'Completed', '2023-07-05');

-- Inserting data into Transactions table for Emily's new trips
INSERT INTO travel_schema."Transactions" ("id", "trip_id", "amount", "transaction_date", "merchant", "category", "status")
VALUES
(11, 6, 1600.00, '2022-10-15', 'Qantas Airways', 'Flight', 'Confirmed'),
(12, 6, 1100.00, '2022-10-20', 'Sydney Hotel', 'Hotel Booking', 'Confirmed'),
(13, 7, 1400.00, '2022-11-25', 'Iberia Airlines', 'Flight', 'Confirmed'),
(14, 7, 800.00, '2022-11-28', 'Barcelona Hostel', 'Hotel Booking', 'Confirmed'),
(15, 8, 1300.00, '2023-03-18', 'Lufthansa', 'Flight', 'Confirmed'),
(16, 8, 1200.00, '2023-03-20', 'Berlin Hotel', 'Hotel Booking', 'Confirmed'),
(17, 9, 1000.00, '2023-05-30', 'LATAM Airlines', 'Flight', 'Confirmed'),
(18, 9, 800.00, '2023-06-05', 'Rio Hostel', 'Hotel Booking', 'Confirmed'),
(19, 10, 1500.00, '2023-07-10', 'South African Airways', 'Flight', 'Confirmed'),
(20, 10, 1200.00, '2023-07-15', 'Cape Town Resort', 'Hotel Booking', 'Confirmed');

-- Inserting data into Services table for Emily's new trips
INSERT INTO travel_schema."Services" ("id", "transaction_id", "service_type", "provider", "booking_date", "cost")
VALUES
(11, 11, 'Flight', 'Qantas Airways', '2022-10-10', 1600.00),
(12, 12, 'Hotel', 'Sydney Hotel', '2022-10-18', 1100.00),
(13, 13, 'Flight', 'Iberia Airlines', '2022-11-22', 1400.00),
(14, 14, 'Hotel', 'Barcelona Hostel', '2022-11-25', 800.00),
(15, 15, 'Flight', 'Lufthansa', '2023-03-10', 1300.00),
(16, 16, 'Hotel', 'Berlin Hotel', '2023-03-15', 1200.00),
(17, 17, 'Flight', 'LATAM Airlines', '2023-05-25', 1000.00),
(18, 18, 'Hotel', 'Rio Hostel', '2023-05-30', 800.00),
(19, 19, 'Flight', 'South African Airways', '2023-07-05', 1500.00),
(20, 20, 'Hotel', 'Cape Town Resort', '2023-07-10', 1200.00);

-- Inserting data into Itineraries table (full itineraries for Emily's new trips)
INSERT INTO travel_schema."Itineraries" ("id", "trip_id", "day_number", "schedule")
VALUES
(7, 6, 1, 'Arrival in Sydney, check into hotel, city tour'),
(8, 6, 2, 'Visit Opera House, lunch at Bondi Beach'),
(9, 7, 1, 'Arrival in Barcelona, check into hostel, city exploration'),
(10, 7, 2, 'Visit Sagrada Familia, dinner at local tapas bar'),
(11, 8, 1, 'Arrival in Berlin, check into hotel, explore Brandenburg Gate'),
(12, 8, 2, 'Visit Berlin Wall, dinner at local restaurant'),
(13, 9, 1, 'Arrival in Rio de Janeiro, check into hostel, Copacabana Beach visit'),
(14, 9, 2, 'Visit Christ the Redeemer, evening at Lapa'),
(15, 10, 1, 'Arrival in Cape Town, check into resort, Table Mountain hike'),
(16, 10, 2, 'Visit Robben Island, sunset at Camps Bay');

-- Inserting data into Activities table (activities for each day of Emily's new itineraries)
INSERT INTO travel_schema."Activities" ("id", "itinerary_id", "name", "category", "location", "start_time", "end_time", "cost")
VALUES
(7, 7, 'City Tour', 'Sightseeing', 'Sydney', '09:00', '12:00', 300.00),
(8, 8, 'Opera House Tour', 'Sightseeing', 'Sydney Opera House', '10:00', '12:00', 200.00),
(9, 9, 'City Exploration', 'Sightseeing', 'Barcelona', '10:00', '13:00', 150.00),
(10, 10, 'Sagrada Familia Tour', 'Sightseeing', 'Sagrada Familia', '09:00', '11:00', 180.00),
(11, 11, 'Brandenburg Gate Visit', 'Sightseeing', 'Berlin', '10:00', '12:00', 100.00),
(12, 12, 'Berlin Wall Visit', 'Sightseeing', 'Berlin Wall', '09:00', '11:00', 120.00),
(13, 13, 'Copacabana Beach Visit', 'Beach', 'Rio de Janeiro', '08:00', '12:00', 0.00),
(14, 14, 'Christ the Redeemer Visit', 'Sightseeing', 'Rio de Janeiro', '09:00', '11:00', 150.00),
(15, 15, 'Table Mountain Hike', 'Adventure', 'Cape Town', '08:00', '12:00', 250.00),
(16, 16, 'Robben Island Tour', 'History', 'Cape Town', '09:00', '12:00', 200.00);

-- Inserting data into Reviews table (good and bad reviews for Emily's trips)
INSERT INTO travel_schema."Reviews" ("id", "trip_id", "rating", "comments", "review_date")
VALUES
(3, 6, 4, 'Amazing trip to Australia, Sydney was incredible!', '2022-11-12'),
(4, 7, 4, 'Great experience in Spain, though the hostel could have been better.', '2022-12-10'),
(5, 8, 3, 'Germany was nice, but the weather was not ideal for sightseeing.', '2023-03-25'),
(6, 9, 2, 'Brazil was underwhelming, and the hostel was not very comfortable.', '2023-06-12'),
(7, 10, 4, 'South Africa was absolutely amazing, the hikes and scenery were unforgettable!', '2023-08-15');









SELECT 
    t.destination AS country,
    r.comments,
    a.name AS activity,
    r.rating
FROM 
    "Trips" t
JOIN 
    "Reviews" r ON t.id = r.trip_id
LEFT JOIN 
    "Itineraries" i ON t.id = i.trip_id
LEFT JOIN 
    "Activities" a ON i.id = a.itinerary_id
WHERE 
    t.client_id = 3  -- Replace with the Client ID you want to filter by
ORDER BY 
    r.rating DESC  -- Ordering by review rating (top 5 highest ratings)
LIMIT 5;


SELECT 
    c.name AS client_name,
    t.destination AS country,
    r.comments AS review_comments,
    a.name AS activity
FROM 
    "Clients" c
JOIN 
    "Trips" t ON c.id = t.client_id
LEFT JOIN 
    "Reviews" r ON t.id = r.trip_id
LEFT JOIN 
    "Itineraries" i ON t.id = i.trip_id
LEFT JOIN 
    "Activities" a ON i.id = a.itinerary_id
ORDER BY 
    c.name, t.start_date;  -- Ordering by client name and trip start date




