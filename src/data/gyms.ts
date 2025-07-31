import { Gym } from '../types';

export const gyms: Gym[] = [
  {
    id: '1',
    name: 'FitZone Premium',
    location: 'Downtown District',
    city: 'New York',
    rating: 4.8,
    reviewCount: 324,
    priceRange: '$$$',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Premium',
    services: ['Personal Training', 'Group Classes', 'Spa', 'Nutrition Counseling'],
    trainers: [
      {
        id: 't1',
        name: 'Sarah Johnson',
        specialty: 'Strength Training',
        experience: '8 years',
        image: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=200'
      },
      {
        id: 't2',
        name: 'Mike Chen',
        specialty: 'CrossFit',
        experience: '6 years',
        image: 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=200'
      }
    ],
    classSchedule: [
      {
        id: 'c1',
        name: 'Morning Yoga',
        time: '7:00 AM',
        duration: '60 min',
        trainer: 'Sarah Johnson',
        day: 'Monday'
      },
      {
        id: 'c2',
        name: 'HIIT Training',
        time: '6:00 PM',
        duration: '45 min',
        trainer: 'Mike Chen',
        day: 'Monday'
      }
    ],
    description: 'Premium fitness facility with state-of-the-art equipment and expert trainers.',
    amenities: ['Pool', 'Sauna', 'Parking', 'Locker Rooms', 'Cafe'],
    workingHours: '5:00 AM - 11:00 PM',
    phone: '+1 (555) 123-4567',
    email: 'info@fitzone.com'
  },
  {
    id: '2',
    name: 'PowerHouse Gym',
    location: 'Midtown',
    city: 'New York',
    rating: 4.6,
    reviewCount: 198,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Strength',
    services: ['Weight Training', 'Personal Training', 'Cardio'],
    trainers: [
      {
        id: 't3',
        name: 'David Rodriguez',
        specialty: 'Powerlifting',
        experience: '10 years',
        image: 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=200'
      }
    ],
    classSchedule: [
      {
        id: 'c3',
        name: 'Powerlifting',
        time: '8:00 AM',
        duration: '90 min',
        trainer: 'David Rodriguez',
        day: 'Tuesday'
      }
    ],
    description: 'Serious gym for serious lifters. Heavy weights and hardcore training.',
    amenities: ['Free Weights', 'Parking', 'Locker Rooms'],
    workingHours: '6:00 AM - 10:00 PM',
    phone: '+1 (555) 234-5678',
    email: 'info@powerhouse.com'
  },
  {
    id: '3',
    name: 'Zen Fitness Studio',
    location: 'Brooklyn Heights',
    city: 'New York',
    rating: 4.9,
    reviewCount: 156,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Wellness',
    services: ['Yoga', 'Pilates', 'Meditation', 'Massage'],
    trainers: [
      {
        id: 't4',
        name: 'Emma Wilson',
        specialty: 'Yoga & Mindfulness',
        experience: '7 years',
        image: 'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=200'
      }
    ],
    classSchedule: [
      {
        id: 'c4',
        name: 'Vinyasa Flow',
        time: '9:00 AM',
        duration: '75 min',
        trainer: 'Emma Wilson',
        day: 'Wednesday'
      }
    ],
    description: 'Peaceful studio focused on mind-body wellness and holistic fitness.',
    amenities: ['Meditation Room', 'Organic Cafe', 'Parking', 'Showers'],
    workingHours: '6:00 AM - 9:00 PM',
    phone: '+1 (555) 345-6789',
    email: 'hello@zenfitness.com'
  }
];

export const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
export const categories = ['All', 'Premium', 'Strength', 'Wellness', 'CrossFit', 'Boxing'];