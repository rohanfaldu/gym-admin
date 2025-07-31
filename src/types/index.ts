export interface Gym {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;  
  priceRange: string;
  image: string;
  category: string;
  services: string[];
  trainers: Trainer[];
  classSchedule: ClassSchedule[];
  description: string;
  amenities: string[];
  workingHours: string;
  phone: string;
  email: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
}

export interface ClassSchedule {
  id: string;
  name: string;
  time: string;
  duration: string;
  trainer: string;
  day: string;
}

export interface MemberSignup {
  name: string;
  mobile: string;
  otp: string;
  gymCode: string;
}