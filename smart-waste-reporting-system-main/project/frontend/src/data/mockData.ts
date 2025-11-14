import { WasteReport, Worker, Analytics } from '../types';

export const mockReports: WasteReport[] = [
  {
    id: '1',
    citizenName: 'Rahul Sharma',
    citizenPhone: '+91-9876543210',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, New Delhi'
    },
    imageUrl: 'https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Large pile of plastic waste near the bus stop',
    wasteType: 'Plastic',
    severity: 8.5,
    confidence: 0.94,
    status: 'Pending',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    citizenName: 'Priya Singh',
    citizenPhone: '+91-8765432109',
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 18, Noida'
    },
    imageUrl: 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Food waste accumulation near residential area',
    wasteType: 'Organic',
    severity: 6.2,
    confidence: 0.87,
    status: 'Assigned',
    assignedWorker: 'Amit Kumar',
    createdAt: new Date('2024-01-14T14:20:00Z'),
    updatedAt: new Date('2024-01-15T09:15:00Z')
  },
  {
    id: '3',
    citizenName: 'Arjun Patel',
    citizenPhone: '+91-7654321098',
    location: {
      lat: 28.7041,
      lng: 77.1025,
      address: 'Model Town, Delhi'
    },
    imageUrl: 'https://images.pexels.com/photos/1682699/pexels-photo-1682699.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Electronic waste dumped illegally',
    wasteType: 'E-Waste',
    severity: 9.1,
    confidence: 0.92,
    status: 'In Progress',
    assignedWorker: 'Suresh Yadav',
    createdAt: new Date('2024-01-13T16:45:00Z'),
    updatedAt: new Date('2024-01-14T11:30:00Z')
  },
  {
    id: '4',
    citizenName: 'Anita Verma',
    citizenPhone: '+91-6543210987',
    location: {
      lat: 28.6692,
      lng: 77.4538,
      address: 'Lajpat Nagar, New Delhi'
    },
    imageUrl: 'https://images.pexels.com/photos/3419394/pexels-photo-3419394.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Medical waste found near hospital',
    wasteType: 'Medical',
    severity: 9.8,
    confidence: 0.96,
    status: 'Resolved',
    assignedWorker: 'Ravi Gupta',
    createdAt: new Date('2024-01-12T09:15:00Z'),
    updatedAt: new Date('2024-01-13T15:20:00Z')
  }
];

export const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Amit Kumar',
    phone: '+91-9876543210',
    email: 'amit.kumar@wastemanagement.com',
    zone: 'Central Delhi',
    activeJobs: 3
  },
  {
    id: '2',
    name: 'Suresh Yadav',
    phone: '+91-8765432109',
    email: 'suresh.yadav@wastemanagement.com',
    zone: 'North Delhi',
    activeJobs: 2
  },
  {
    id: '3',
    name: 'Ravi Gupta',
    phone: '+91-7654321098',
    email: 'ravi.gupta@wastemanagement.com',
    zone: 'South Delhi',
    activeJobs: 1
  }
];

export const mockAnalytics: Analytics = {
  totalReports: 156,
  resolvedReports: 132,
  pendingReports: 24,
  averageResolutionTime: 2.3,
  reportsByType: {
    'Plastic': 45,
    'Organic': 38,
    'E-Waste': 23,
    'Medical': 19,
    'Glass': 16,
    'Metal': 10,
    'Mixed': 5
  },
  reportsByZone: {
    'Central Delhi': 52,
    'North Delhi': 41,
    'South Delhi': 38,
    'East Delhi': 25
  },
  monthlyTrends: [
    { month: 'Aug', reports: 45, resolved: 42 },
    { month: 'Sep', reports: 52, resolved: 48 },
    { month: 'Oct', reports: 48, resolved: 45 },
    { month: 'Nov', reports: 38, resolved: 35 },
    { month: 'Dec', reports: 41, resolved: 38 },
    { month: 'Jan', reports: 32, resolved: 24 }
  ]
};