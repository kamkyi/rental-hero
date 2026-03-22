export type CarType = "SUV" | "Sedan" | "Luxury" | "Electric" | "Van";
export type City = "Bangkok" | "Chiang Mai" | "Phuket" | "Pattaya";

export type Car = {
  id: string;
  name: string;
  type: CarType;
  location: City;
  pricePerDay: number;
  rating: number;
  seats: number;
  transmission: "Automatic" | "Manual";
  fuel: "Hybrid" | "Petrol" | "Electric" | "Diesel";
  image: string;
  description: string;
  features: string[];
};

export const locations: Array<"All" | City> = ["All", "Bangkok", "Chiang Mai", "Phuket", "Pattaya"];
export const carTypes: Array<"All" | CarType> = [
  "All",
  "SUV",
  "Sedan",
  "Luxury",
  "Electric",
  "Van",
];

export const cars: Car[] = [
  {
    id: "bmw-x5-bangkok",
    name: "BMW X5 xDrive",
    type: "Luxury",
    location: "Bangkok",
    pricePerDay: 4200,
    rating: 4.9,
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
    description:
      "A premium SUV built for airport pickups, business trips, and comfortable long drives across the city.",
    features: ["Airport delivery", "Leather interior", "Panoramic roof", "Free cancellation"],
  },
  {
    id: "toyota-yaris-chiang-mai",
    name: "Toyota Yaris Ativ",
    type: "Sedan",
    location: "Chiang Mai",
    pricePerDay: 1400,
    rating: 4.7,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    description:
      "An efficient city sedan that is easy to park, easy on fuel, and ideal for urban day trips.",
    features: ["Bluetooth audio", "Unlimited mileage", "Mobile key handoff", "Child seat optional"],
  },
  {
    id: "tesla-model-y-phuket",
    name: "Tesla Model Y",
    type: "Electric",
    location: "Phuket",
    pricePerDay: 3500,
    rating: 4.8,
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    description:
      "A clean, quiet electric drive with fast acceleration and a minimalist cabin for island travel.",
    features: ["Fast charging map", "Autopilot assist", "Glass roof", "Premium sound"],
  },
  {
    id: "fortuner-pattaya",
    name: "Toyota Fortuner",
    type: "SUV",
    location: "Pattaya",
    pricePerDay: 2600,
    rating: 4.6,
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    description:
      "A spacious SUV for family travel, beach routes, and weekend trips with extra luggage.",
    features: ["7 seats", "Rear AC vents", "Roadside support", "Pickup at hotel"],
  },
  {
    id: "honda-crv-bangkok",
    name: "Honda CR-V e:HEV",
    type: "SUV",
    location: "Bangkok",
    pricePerDay: 2300,
    rating: 4.8,
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    image:
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80",
    description:
      "A practical hybrid SUV with smooth ride quality and enough room for business or family travel.",
    features: ["Fuel efficient", "Apple CarPlay", "Fold-flat seats", "Express pickup"],
  },
  {
    id: "hyundai-staria-chiang-mai",
    name: "Hyundai Staria",
    type: "Van",
    location: "Chiang Mai",
    pricePerDay: 3200,
    rating: 4.9,
    seats: 9,
    transmission: "Automatic",
    fuel: "Diesel",
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
    description:
      "A high-capacity van for group transfers, wedding runs, or mountain trips with a driver add-on.",
    features: ["9 seats", "Large cargo area", "Driver add-on", "Flexible pickup time"],
  },
];

export const getCarById = (id: string) => cars.find((car) => car.id === id);
