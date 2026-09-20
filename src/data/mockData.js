export const categories = [
  { id: '1', name: 'Electrician', icon: 'Zap', description: 'Electrical repairs & installations' },
  { id: '2', name: 'Plumber', icon: 'Droplets', description: 'Pipe fitting & plumbing fixes' },
  { id: '3', name: 'AC Technician', icon: 'Snowflake', description: 'AC servicing & repair' },
  { id: '4', name: 'Mechanic', icon: 'Wrench', description: 'Auto repair & maintenance' },
  { id: '5', name: 'Carpenter', icon: 'Hammer', description: 'Woodwork & furniture repair' },
  { id: '6', name: 'Painter', icon: 'Paintbrush', description: 'House & wall painting' },
  { id: '7', name: 'Cleaner', icon: 'Sparkles', description: 'Deep cleaning & daily chores' },
  { id: '8', name: 'Appliance Repair', icon: 'Microwave', description: 'Home appliances fix' },
];

export const professionals = [
  {
    id: 'p1',
    name: 'Rajesh Kumar',
    category: 'Electrician',
    rating: 4.8,
    reviews: 124,
    hourlyRate: 350,
    verified: true,
    location: 'Sector 14, Downtown',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
    about: 'Experienced electrician with 10+ years fixing residential and commercial wiring.',
    skills: ['Wiring', 'Switchboards', 'Inverters', 'Fault Finding'],
    yearsOfExperience: 12,
    jobsCompleted: 342,
    availability: 'Mon - Sat, 9 AM - 6 PM',
    serviceArea: 'Within 15km of Downtown',
    recentReviews: [
      { id: 'r1', user: 'Anjali M.', rating: 5, text: 'Rajesh was very professional and fixed our inverter issue in 30 minutes!', date: '2 days ago' },
      { id: 'r2', user: 'Sanjay P.', rating: 4, text: 'Good work, but arrived a bit late due to traffic.', date: '1 week ago' }
    ]
  },
  {
    id: 'p2',
    name: 'Amit Sharma',
    category: 'Plumber',
    rating: 4.6,
    reviews: 89,
    hourlyRate: 300,
    verified: true,
    location: 'Green Park',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
    about: 'Expert in fixing leaks, pipe installations, and bathroom fittings.',
    skills: ['Pipe Fitting', 'Leak Repair', 'Water Heaters'],
    yearsOfExperience: 8,
    jobsCompleted: 215,
    availability: 'Everyday, 8 AM - 8 PM',
    serviceArea: 'Green Park & Surrounding',
    recentReviews: [
      { id: 'r3', user: 'Vikram S.', rating: 5, text: 'Amit installed our new water heater perfectly.', date: '3 days ago' }
    ]
  },
  {
    id: 'p3',
    name: 'Sunita Devi',
    category: 'Cleaner',
    rating: 4.9,
    reviews: 210,
    hourlyRate: 200,
    verified: true,
    location: 'Civil Lines',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
    about: 'Professional deep cleaning services for homes and offices.',
    skills: ['Deep Cleaning', 'Sanitization', 'Organizing'],
    yearsOfExperience: 5,
    jobsCompleted: 560,
    availability: 'Mon - Fri, 9 AM - 5 PM',
    serviceArea: 'All City limits',
    recentReviews: [
      { id: 'r4', user: 'Neha R.', rating: 5, text: 'Absolutely spotless cleaning! Highly recommended.', date: 'Yesterday' }
    ]
  },
  {
    id: 'p4',
    name: 'Mohammed Ali',
    category: 'AC Technician',
    rating: 4.7,
    reviews: 156,
    hourlyRate: 400,
    verified: false,
    location: 'MG Road',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=256&h=256',
    about: 'Specialist in all brands of Split and Window ACs. Gas refilling, servicing, and installation.',
    skills: ['AC Servicing', 'Gas Refill', 'Installation'],
    yearsOfExperience: 6,
    jobsCompleted: 180,
    availability: 'Everyday, 10 AM - 7 PM',
    serviceArea: 'Central & South side',
    recentReviews: []
  }
];

export const marketplaceItems = [
  {
    id: 'm1',
    title: 'Almost New Office Chair',
    price: 1200,
    category: 'Furniture',
    condition: 'Like New',
    seller: 'Vikram S.',
    sellerId: 'user1',
    location: 'Sector 21',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
    postedAt: '2 hours ago',
  },
  {
    id: 'm2',
    title: 'Washing Machine 7kg',
    price: 8500,
    category: 'Appliances',
    condition: 'Good',
    seller: 'Priya M.',
    sellerId: 'user2',
    location: 'Lake View Apartments',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800',
    postedAt: '1 day ago',
  },
];

export const dashboardJobs = [
  { id: 'j1', client: 'Rohit K.', service: 'AC Gas Refill', date: 'Oct 24, 2026', time: '10:00 AM', status: 'pending', amount: 800 },
  { id: 'j2', client: 'Pooja S.', service: 'Split AC Installation', date: 'Oct 25, 2026', time: '02:00 PM', status: 'active', amount: 1500 },
  { id: 'j3', client: 'Manish T.', service: 'AC Servicing', date: 'Oct 20, 2026', time: '11:00 AM', status: 'completed', amount: 500 },
];

export const mockConversations = [
  {
    id: 'c1',
    contactName: 'Vikram S.',
    contactAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=256&h=256',
    lastMessage: 'Is the office chair still available?',
    time: '2m ago',
    unread: true,
    messages: [
      { id: 'm1', sender: 'me', text: 'Hi Vikram, is the office chair still available?', time: '2 mins ago' }
    ]
  },
  {
    id: 'c2',
    contactName: 'Sunita Devi',
    contactAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
    lastMessage: 'I will reach your place by 10 AM tomorrow.',
    time: '1d ago',
    unread: false,
    messages: [
      { id: 'm1', sender: 'me', text: 'Hi Sunita, can you come for a deep clean tomorrow?', time: '1 day ago' },
      { id: 'm2', sender: 'them', text: 'Yes, sure. I will reach your place by 10 AM tomorrow.', time: '1 day ago' }
    ]
  }
];
