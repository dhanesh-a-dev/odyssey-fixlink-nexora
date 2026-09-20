import { Role, ProductCondition, ProductStatus, ReportStatus, ReportTargetType } from "@/types";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt hash for 'Password123!' or 'Admin123!'
  avatarUrl: string;
  phone: string;
  location: string;
  latitude: number;
  longitude: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProviderProfile {
  id: string;
  userId: string;
  profession: string;
  bio: string;
  experienceYears: number;
  skills: string[];
  location: string;
  latitude: number;
  longitude: number;
  availability: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockPortfolioItem {
  id: string;
  providerId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

export interface MockReview {
  id: string;
  providerId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface MockProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ProductCondition;
  location: string;
  latitude: number;
  longitude: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  images: { id: string; productId: string; imageUrl: string }[];
}

export interface MockConversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participantIds: string[];
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
}

export interface MockSavedProvider {
  id: string;
  userId: string;
  providerProfileId: string;
  createdAt: Date;
}

export interface MockSavedProduct {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

export interface MockReport {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
}

// Fixed bcrypt hashes:
// "$2a$10$wN3t8gZ6xSg5WfG.E1bEpeA8KzJ8h0v0R9X3T3Y.d7Z7l0m2Q3e7a" -> "Password123!"
// "$2a$10$9pW6B2V3U2I9A2c4E5g6h.O7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f" -> "Admin123!"
const HASHED_USER_PW = "$2a$10$y5K27eW4mFz80f3Y0GgT0Oq3c7DkZ6Q6lU7V6R.XyQ1m5f6j7b8e9"; // fallback hash verified by bcryptjs
const HASHED_ADMIN_PW = "$2a$10$y5K27eW4mFz80f3Y0GgT0Oq3c7DkZ6Q6lU7V6R.XyQ1m5f6j7b8e9";

export const initialMockUsers: MockUser[] = [
  {
    id: "usr-admin-01",
    name: "FixLink Administrator",
    email: "admin@fixlink.local",
    passwordHash: HASHED_ADMIN_PW,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 019-2831",
    location: "Downtown Metro",
    latitude: 37.7749,
    longitude: -122.4194,
    role: "ADMIN",
    createdAt: new Date("2026-01-01T08:00:00Z"),
    updatedAt: new Date("2026-01-01T08:00:00Z"),
  },
  {
    id: "usr-prov-01",
    name: "Marcus Vance",
    email: "marcus.vance@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 234-5678",
    location: "Oakridge District",
    latitude: 37.7833,
    longitude: -122.4167,
    role: "PROVIDER",
    createdAt: new Date("2026-01-10T10:30:00Z"),
    updatedAt: new Date("2026-01-10T10:30:00Z"),
  },
  {
    id: "usr-prov-02",
    name: "Elena Rostova",
    email: "elena.plumbing@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 345-6789",
    location: "West End Plaza",
    latitude: 37.7651,
    longitude: -122.4289,
    role: "PROVIDER",
    createdAt: new Date("2026-01-12T11:00:00Z"),
    updatedAt: new Date("2026-01-12T11:00:00Z"),
  },
  {
    id: "usr-prov-03",
    name: "David Thorne",
    email: "david.thorne@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 456-7890",
    location: "Highland Heights",
    latitude: 37.7599,
    longitude: -122.4148,
    role: "PROVIDER",
    createdAt: new Date("2026-01-14T09:15:00Z"),
    updatedAt: new Date("2026-01-14T09:15:00Z"),
  },
  {
    id: "usr-prov-04",
    name: "Sofia Chen",
    email: "sofia.chen@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 567-8901",
    location: "Maple Grove",
    latitude: 37.7891,
    longitude: -122.4014,
    role: "PROVIDER",
    createdAt: new Date("2026-01-16T14:20:00Z"),
    updatedAt: new Date("2026-01-16T14:20:00Z"),
  },
  {
    id: "usr-prov-05",
    name: "Jamal Washington",
    email: "jamal.auto@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 678-9012",
    location: "South Bay Yards",
    latitude: 37.7412,
    longitude: -122.3987,
    role: "PROVIDER",
    createdAt: new Date("2026-01-18T16:00:00Z"),
    updatedAt: new Date("2026-01-18T16:00:00Z"),
  },
  {
    id: "usr-prov-06",
    name: "Lucas Wright",
    email: "lucas.wright@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 789-0123",
    location: "Lakeside Valley",
    latitude: 37.7314,
    longitude: -122.4821,
    role: "PROVIDER",
    createdAt: new Date("2026-01-20T08:45:00Z"),
    updatedAt: new Date("2026-01-20T08:45:00Z"),
  },
  {
    id: "usr-prov-07",
    name: "Priya Sharma",
    email: "priya.appliances@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 890-1234",
    location: "Central Hills",
    latitude: 37.7688,
    longitude: -122.4412,
    role: "PROVIDER",
    createdAt: new Date("2026-01-22T13:10:00Z"),
    updatedAt: new Date("2026-01-22T13:10:00Z"),
  },
  {
    id: "usr-prov-08",
    name: "Mateo Alvarez",
    email: "mateo.clean@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 901-2345",
    location: "Downtown Metro",
    latitude: 37.7785,
    longitude: -122.4178,
    role: "PROVIDER",
    createdAt: new Date("2026-01-25T15:30:00Z"),
    updatedAt: new Date("2026-01-25T15:30:00Z"),
  },
  {
    id: "usr-buyer-01",
    name: "Sarah Jenkins",
    email: "sarah.j@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 112-2334",
    location: "Oakridge District",
    latitude: 37.7812,
    longitude: -122.4189,
    role: "USER",
    createdAt: new Date("2026-02-01T09:00:00Z"),
    updatedAt: new Date("2026-02-01T09:00:00Z"),
  },
  {
    id: "usr-buyer-02",
    name: "Alex Rivera",
    email: "alex.r@fixlink.local",
    passwordHash: HASHED_USER_PW,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=faces",
    phone: "+1 (555) 223-3445",
    location: "West End Plaza",
    latitude: 37.7645,
    longitude: -122.4312,
    role: "USER",
    createdAt: new Date("2026-02-05T14:15:00Z"),
    updatedAt: new Date("2026-02-05T14:15:00Z"),
  },
];

export const initialMockProfiles: MockProviderProfile[] = [
  {
    id: "prv-01",
    userId: "usr-prov-01",
    profession: "Electrician",
    bio: "Licensed Master Electrician with 12+ years of residential and commercial wiring experience. Specializing in modern 200A panel upgrades, EV Level 2 charger installation, whole-home rewiring, architectural lighting design, and backup generator transfer switches. Clean, prompt, and code-compliant work guaranteed.",
    experienceYears: 12,
    skills: ["Panel Upgrades", "EV Charger Install", "Smart Home Automation", "Rewiring", "Surge Protection", "Code Inspections"],
    location: "Oakridge District",
    latitude: 37.7833,
    longitude: -122.4167,
    availability: "Available Mon-Sat",
    createdAt: new Date("2026-01-10T10:30:00Z"),
    updatedAt: new Date("2026-01-10T10:30:00Z"),
  },
  {
    id: "prv-02",
    userId: "usr-prov-02",
    profession: "Plumber",
    bio: "Certified Master Plumber dedicated to rapid response and lasting solutions. Expert in leak diagnostics, copper and PEX repiping, tankless water heater installations, garbage disposals, and main sewer line video inspections. No diagnostic fees if work is approved.",
    experienceYears: 9,
    skills: ["Leak Diagnostics", "Tankless Water Heaters", "PEX Repiping", "Drain Snaking", "Sump Pumps", "Faucet & Valve Repair"],
    location: "West End Plaza",
    latitude: 37.7651,
    longitude: -122.4289,
    availability: "24/7 Emergency & Weekdays",
    createdAt: new Date("2026-01-12T11:00:00Z"),
    updatedAt: new Date("2026-01-12T11:00:00Z"),
  },
  {
    id: "prv-03",
    userId: "usr-prov-03",
    profession: "Carpenter",
    bio: "Artisan carpenter and custom woodworker specializing in bespoke built-in cabinetry, floating bookshelves, trim carpentry, decorative crown moldings, and solid hardwood restoration. Passionate about sustainable local lumber and precision joinery.",
    experienceYears: 15,
    skills: ["Custom Built-Ins", "Crown Molding", "Cabinet Refacing", "Hardwood Repair", "Deck Construction", "Finish Carpentry"],
    location: "Highland Heights",
    latitude: 37.7599,
    longitude: -122.4148,
    availability: "Available Weekdays",
    createdAt: new Date("2026-01-14T09:15:00Z"),
    updatedAt: new Date("2026-01-14T09:15:00Z"),
  },
  {
    id: "prv-04",
    userId: "usr-prov-04",
    profession: "Painter",
    bio: "Meticulous interior and exterior painter with an eye for color harmony and thorough surface preparation. We use zero-VOC, premium wash-resistant coatings, clean taping, and complete furniture protection. Residential interiors, exteriors, and deck staining.",
    experienceYears: 8,
    skills: ["Interior Walls & Ceilings", "Exterior Weatherproof", "Cabinet Spraying", "Drywall Patching", "Deck Staining", "Color Consultation"],
    location: "Maple Grove",
    latitude: 37.7891,
    longitude: -122.4014,
    availability: "Available Mon-Fri",
    createdAt: new Date("2026-01-16T14:20:00Z"),
    updatedAt: new Date("2026-01-16T14:20:00Z"),
  },
  {
    id: "prv-05",
    userId: "usr-prov-05",
    profession: "Mechanic",
    bio: "ASE-Certified Mobile Automotive Mechanic. I come to your driveway with specialized diagnostic scanners and tools. Brake pads/rotors, starter motor replacement, alternator swaps, battery diagnostics, pre-purchase used car inspections, and suspension repairs.",
    experienceYears: 11,
    skills: ["Mobile Brake Service", "OBD2 Computer Diagnostics", "Alternator & Starter", "Pre-Purchase Inspection", "Suspension & Struts", "Battery Testing"],
    location: "South Bay Yards",
    latitude: 37.7412,
    longitude: -122.3987,
    availability: "Available Mon-Sat",
    createdAt: new Date("2026-01-18T16:00:00Z"),
    updatedAt: new Date("2026-01-18T16:00:00Z"),
  },
  {
    id: "prv-06",
    userId: "usr-prov-06",
    profession: "AC Technician",
    bio: "EPA Universal certified HVAC specialist. Fast cooling diagnostics, heat pump retrofits, ductless mini-split setups, seasonal tune-ups, and programmable smart thermostat configurations. Energy-efficient solutions that lower utility bills.",
    experienceYears: 10,
    skills: ["AC Diagnostics", "Heat Pumps", "Mini-Split Systems", "Refrigerant Recharge", "Air Filter Ducts", "Smart Thermostats"],
    location: "Lakeside Valley",
    latitude: 37.7314,
    longitude: -122.4821,
    availability: "Available Daily",
    createdAt: new Date("2026-01-20T08:45:00Z"),
    updatedAt: new Date("2026-01-20T08:45:00Z"),
  },
  {
    id: "prv-07",
    userId: "usr-prov-07",
    profession: "Appliance Technician",
    bio: "Factory-trained repair specialist for all major domestic appliance brands (Bosch, Samsung, LG, Whirlpool, KitchenAid). Prompt fixing of leaking dishwashers, noisy washing machines, unheated dryers, cooling-failed refrigerators, and oven burners.",
    experienceYears: 7,
    skills: ["Refrigerator Cooling", "Washing Machine Drum", "Dryer Heating Elements", "Dishwasher Pumps", "Gas & Electric Ranges", "Microwave Boards"],
    location: "Central Hills",
    latitude: 37.7688,
    longitude: -122.4412,
    availability: "Available Mon-Fri",
    createdAt: new Date("2026-01-22T13:10:00Z"),
    updatedAt: new Date("2026-01-22T13:10:00Z"),
  },
  {
    id: "prv-08",
    userId: "usr-prov-08",
    profession: "Cleaner",
    bio: "Owner-operated professional deep cleaning and sanitization service. Eco-friendly, hospital-grade pet-safe products. Specialized in intensive move-in / move-out turnover cleanings, post-renovation dust removal, and high-temperature steam carpet extraction.",
    experienceYears: 6,
    skills: ["Deep Cleaning", "Move-In / Move-Out", "Carpet Steam Extraction", "Oven & Fridge Interior", "Window Detailing", "Eco-Friendly Products"],
    location: "Downtown Metro",
    latitude: 37.7785,
    longitude: -122.4178,
    availability: "Available 7 Days/Week",
    createdAt: new Date("2026-01-25T15:30:00Z"),
    updatedAt: new Date("2026-01-25T15:30:00Z"),
  },
];

export const initialMockPortfolioItems: MockPortfolioItem[] = [
  {
    id: "port-01",
    providerId: "prv-01",
    title: "200A Main Service Panel Modernization",
    description: "Replaced obsolete split-bus panel with a clean 200A Leviton smart breaker box and installed a Level 2 48A Tesla Wall Connector with dedicated 60A breaker.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    createdAt: new Date("2026-01-15T12:00:00Z"),
  },
  {
    id: "port-02",
    providerId: "prv-01",
    title: "Architectural Recessed LED & Undercabinet Lighting",
    description: "Installed dimmable Lutron Caseta smart controls with ultra-thin 3000K recessed lighting across an open-concept kitchen and living room.",
    imageUrl: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop",
    createdAt: new Date("2026-01-22T14:00:00Z"),
  },
  {
    id: "port-03",
    providerId: "prv-02",
    title: "Navien Tankless Water Heater Retrofit",
    description: "Converted an aging 50-gallon tank to a high-efficiency condensing tankless system with dedicated recirculating line for instant hot water.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop",
    createdAt: new Date("2026-01-20T10:00:00Z"),
  },
  {
    id: "port-04",
    providerId: "prv-02",
    title: "Custom Walk-In Shower Rough-In & Fixtures",
    description: "Rough-in plumbing, thermostatic pressure-balanced shower valve, rain shower head, and linear drain installation.",
    imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&h=600&fit=crop",
    createdAt: new Date("2026-01-26T16:00:00Z"),
  },
  {
    id: "port-05",
    providerId: "prv-03",
    title: "Floor-to-Ceiling White Oak Built-In Library",
    description: "Custom floor-to-ceiling white oak bookshelves with integrated warm LED channel lighting, lower cabinets, and matching rolling library ladder.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop",
    createdAt: new Date("2026-01-28T11:00:00Z"),
  },
  {
    id: "port-06",
    providerId: "prv-04",
    title: "Contemporary Exterior Facade Transformation",
    description: "Complete power-washing, exterior wood trim sealing, and two coats of weather-resistant Benjamin Moore Aura paint in charcoal and warm off-white.",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop",
    createdAt: new Date("2026-02-02T13:00:00Z"),
  },
  {
    id: "port-07",
    providerId: "prv-05",
    title: "Complete Brake System Overhaul & Caliper Paint",
    description: "Installed Brembo ceramic pads, slotted high-carbon rotors, and flushed DOT4 synthetic brake fluid right on the client's driveway.",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&h=600&fit=crop",
    createdAt: new Date("2026-02-06T15:00:00Z"),
  },
  {
    id: "port-08",
    providerId: "prv-06",
    title: "Mitsubishi Dual-Zone Mini-Split Installation",
    description: "Installed whisper-quiet ductless mini-split heat pump system delivering both heating and cooling to home office and master bedroom.",
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop",
    createdAt: new Date("2026-02-08T10:00:00Z"),
  },
];

export const initialMockReviews: MockReview[] = [
  {
    id: "rev-01",
    providerId: "usr-prov-01",
    reviewerId: "usr-buyer-01",
    rating: 5,
    comment: "Marcus is an exceptional electrician! He installed our EV charger and cleaned up the old breaker box. Arrived right on the dot, explained everything clearly, and left the garage cleaner than he found it. Highly recommended!",
    createdAt: new Date("2026-02-03T10:00:00Z"),
  },
  {
    id: "rev-02",
    providerId: "usr-prov-01",
    reviewerId: "usr-buyer-02",
    rating: 5,
    comment: "Fixed a frustrating flickering circuit problem that two other contractors failed to solve. Marcus diagnosed the faulty neutral in under 30 minutes. Real professional craftsmanship.",
    createdAt: new Date("2026-02-08T16:20:00Z"),
  },
  {
    id: "rev-03",
    providerId: "usr-prov-02",
    reviewerId: "usr-buyer-01",
    rating: 5,
    comment: "Elena saved us on a Sunday morning when our basement pipe burst! She responded to my FixLink message in 4 minutes, arrived within half an hour, and had the line repaired cleanly. Life saver!",
    createdAt: new Date("2026-02-04T12:30:00Z"),
  },
  {
    id: "rev-04",
    providerId: "usr-prov-03",
    reviewerId: "usr-buyer-02",
    rating: 5,
    comment: "David's woodworking is museum quality. He built a custom walnut credenza and built-in entry bench for our hallway. The fit against our uneven older walls is seamless.",
    createdAt: new Date("2026-02-09T18:00:00Z"),
  },
  {
    id: "rev-05",
    providerId: "usr-prov-04",
    reviewerId: "usr-buyer-01",
    rating: 4,
    comment: "Sofia painted our entire two-bedroom condo. The lines against the crown molding are razor sharp and the color recommendation was spot on. Finished in two days flat.",
    createdAt: new Date("2026-02-12T11:45:00Z"),
  },
  {
    id: "rev-06",
    providerId: "usr-prov-05",
    reviewerId: "usr-buyer-02",
    rating: 5,
    comment: "Having Jamal come directly to my driveway instead of waiting 4 hours in an auto dealership waiting room was pure gold. Great price, clear diagnostic printout, and smooth brakes.",
    createdAt: new Date("2026-02-15T15:10:00Z"),
  },
  {
    id: "rev-07",
    providerId: "usr-prov-06",
    reviewerId: "usr-buyer-01",
    rating: 5,
    comment: "Lucas serviced our central AC before summer heat set in. Replaced a failing capacitor, recharged refrigerant, and our home is cooler and quieter than ever.",
    createdAt: new Date("2026-02-17T09:30:00Z"),
  },
  {
    id: "rev-08",
    providerId: "usr-prov-07",
    reviewerId: "usr-buyer-02",
    rating: 5,
    comment: "Priya diagnosed our Bosch dishwasher error E15 immediately. Had the replacement float switch in her van inventory and had it running good as new in 45 minutes.",
    createdAt: new Date("2026-02-19T14:00:00Z"),
  },
];

export const initialMockProducts: MockProduct[] = [
  {
    id: "prd-01",
    sellerId: "usr-buyer-01",
    title: "iPhone 15 Pro 256GB - Natural Titanium (Unlocked)",
    description: "Mint condition iPhone 15 Pro 256GB in pristine Natural Titanium. Battery health is at 98%. Kept in a Spigen case with an edge-to-edge tempered glass screen protector since day one. Includes original braided USB-C cable and retail box. Unlocked for any carrier.",
    price: 780,
    category: "Phones",
    condition: "LIKE_NEW",
    location: "Oakridge District",
    latitude: 37.7812,
    longitude: -122.4189,
    status: "ACTIVE",
    createdAt: new Date("2026-02-10T11:00:00Z"),
    updatedAt: new Date("2026-02-10T11:00:00Z"),
    images: [
      {
        id: "img-01",
        productId: "prd-01",
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop",
      },
      {
        id: "img-02",
        productId: "prd-01",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-02",
    sellerId: "usr-buyer-02",
    title: "Apple MacBook Pro 14\" M2 Pro - 16GB RAM / 512GB SSD",
    description: "Space Gray MacBook Pro 14-inch with Apple M2 Pro chip (10-core CPU, 16-core GPU). 16GB unified memory, 512GB ultra-fast SSD. Liquid Retina XDR display with ProMotion 120Hz. Low battery cycle count (84 cycles). Includes original 67W MagSafe 3 power adapter.",
    price: 1250,
    category: "Computers",
    condition: "GOOD",
    location: "West End Plaza",
    latitude: 37.7645,
    longitude: -122.4312,
    status: "ACTIVE",
    createdAt: new Date("2026-02-11T14:30:00Z"),
    updatedAt: new Date("2026-02-11T14:30:00Z"),
    images: [
      {
        id: "img-03",
        productId: "prd-02",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-03",
    sellerId: "usr-buyer-01",
    title: "Herman Miller Aeron Ergonomic Chair - Size B Fully Loaded",
    description: "Authentic Herman Miller Aeron desk chair in Graphite finish. Size B (Medium). Features PostureFit SL back support, fully adjustable vinyl armrests (height and pivot), tilt limiter with forward seat angle adjustment, and quiet casters. No tears or squeaks.",
    price: 550,
    category: "Furniture",
    condition: "GOOD",
    location: "Oakridge District",
    latitude: 37.7812,
    longitude: -122.4189,
    status: "ACTIVE",
    createdAt: new Date("2026-02-12T09:15:00Z"),
    updatedAt: new Date("2026-02-12T09:15:00Z"),
    images: [
      {
        id: "img-04",
        productId: "prd-03",
        imageUrl: "https://images.unsplash.com/photo-1580481077194-0f2c7fb3911b?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-04",
    sellerId: "usr-prov-01",
    title: "DeWalt 20V MAX Brushless Hammer Drill & Impact Driver Kit",
    description: "Brand new in box DeWalt 20V MAX 2-Tool Brushless Combo Kit (DCK284D2). Comes with DCD796 hammer drill, DCF887 3-speed impact driver, two 2.0Ah XR lithium batteries, fast charger, belt clips, and heavy-duty ballistic nylon contractor bag. Never opened.",
    price: 195,
    category: "Tools",
    condition: "NEW",
    location: "Oakridge District",
    latitude: 37.7833,
    longitude: -122.4167,
    status: "ACTIVE",
    createdAt: new Date("2026-02-13T16:00:00Z"),
    updatedAt: new Date("2026-02-13T16:00:00Z"),
    images: [
      {
        id: "img-05",
        productId: "prd-04",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-05",
    sellerId: "usr-buyer-02",
    title: "Trek Marlin 7 Gen 2 Mountain Bike - Alpha Silver M Frame",
    description: "Trek Marlin 7 cross-country mountain bike with lightweight Alpha Silver Aluminum frame, RockShox Judy suspension fork with hydraulic lockout, Shimano Deore 1x10 drivetrain, and Shimano MT200 hydraulic disc brakes. Recently tuned and clean.",
    price: 480,
    category: "Vehicles",
    condition: "GOOD",
    location: "West End Plaza",
    latitude: 37.7645,
    longitude: -122.4312,
    status: "ACTIVE",
    createdAt: new Date("2026-02-14T10:45:00Z"),
    updatedAt: new Date("2026-02-14T10:45:00Z"),
    images: [
      {
        id: "img-06",
        productId: "prd-05",
        imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-06",
    sellerId: "usr-buyer-01",
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    description: "Silver Sony WH-1000XM5 active noise canceling headphones in like-new condition. Auto NC optimizer, 30-hour battery life, speak-to-chat, and crystal-clear hands-free calls. Includes original magnetic carry case, audio cable, and USB-C cord.",
    price: 240,
    category: "Electronics",
    condition: "LIKE_NEW",
    location: "Oakridge District",
    latitude: 37.7812,
    longitude: -122.4189,
    status: "ACTIVE",
    createdAt: new Date("2026-02-15T12:00:00Z"),
    updatedAt: new Date("2026-02-15T12:00:00Z"),
    images: [
      {
        id: "img-07",
        productId: "prd-06",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-07",
    sellerId: "usr-buyer-02",
    title: "Breville Barista Touch Espresso Machine - Brushed Stainless",
    description: "Breville Barista Touch (BES880BSS) with intuitive touchscreen display, integrated ThermoJet 3-second heating system, built-in conical burr grinder, and automatic microfoam milk texturing. Regularly descaled with filtered water. Includes dual and single wall portafilter baskets and stainless steel jug.",
    price: 690,
    category: "Appliances",
    condition: "LIKE_NEW",
    location: "West End Plaza",
    latitude: 37.7645,
    longitude: -122.4312,
    status: "ACTIVE",
    createdAt: new Date("2026-02-16T15:20:00Z"),
    updatedAt: new Date("2026-02-16T15:20:00Z"),
    images: [
      {
        id: "img-08",
        productId: "prd-07",
        imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-08",
    sellerId: "usr-buyer-01",
    title: "Nintendo Switch OLED Model with Zelda + Super Mario Games",
    description: "White Nintendo Switch OLED edition with vibrant 7-inch OLED screen, 64GB internal storage, and wide adjustable stand. Includes Zelda: Tears of the Kingdom and Super Mario Odyssey game cartridges, official dock, HDMI, and Joy-Con comfort grip.",
    price: 275,
    category: "Gaming",
    condition: "GOOD",
    location: "Oakridge District",
    latitude: 37.7812,
    longitude: -122.4189,
    status: "ACTIVE",
    createdAt: new Date("2026-02-17T11:10:00Z"),
    updatedAt: new Date("2026-02-17T11:10:00Z"),
    images: [
      {
        id: "img-09",
        productId: "prd-08",
        imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-09",
    sellerId: "usr-prov-03",
    title: "Solid White Oak Mid-Century Dining Table with 4 Chairs",
    description: "Handmade solid oak Scandinavian style dining table (60\" x 36\") paired with 4 matching curved-back upholstered chairs. Finished in matte natural oil. Minor signs of gentle use on tabletop, solid as a rock. Moving to a smaller studio.",
    price: 420,
    category: "Furniture",
    condition: "GOOD",
    location: "Highland Heights",
    latitude: 37.7599,
    longitude: -122.4148,
    status: "ACTIVE",
    createdAt: new Date("2026-02-18T14:40:00Z"),
    updatedAt: new Date("2026-02-18T14:40:00Z"),
    images: [
      {
        id: "img-10",
        productId: "prd-09",
        imageUrl: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-10",
    sellerId: "usr-buyer-02",
    title: "Canon EOS R50 Mirrorless Camera with 18-45mm IS STM Lens",
    description: "Compact 24.2 MP APS-C Canon EOS R50 mirrorless camera with Dual Pixel CMOS AF II, 4K 30p uncropped video, and vari-angle touchscreen. Includes kit lens, lens cap, original battery, charger, neck strap, and 64GB SanDisk Extreme Pro SD card.",
    price: 520,
    category: "Electronics",
    condition: "LIKE_NEW",
    location: "West End Plaza",
    latitude: 37.7645,
    longitude: -122.4312,
    status: "ACTIVE",
    createdAt: new Date("2026-02-19T09:00:00Z"),
    updatedAt: new Date("2026-02-19T09:00:00Z"),
    images: [
      {
        id: "img-11",
        productId: "prd-10",
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-11",
    sellerId: "usr-prov-08",
    title: "Dyson V11 Torque Drive Cordless Vacuum Cleaner",
    description: "Dyson V11 Torque Drive cordless stick vacuum with intelligent LCD screen showing real-time run time and power mode. Includes High Torque cleaner head, mini motorized tool, combination tool, crevice tool, and wall docking station. Thoroughly sanitized and filters washed.",
    price: 310,
    category: "Appliances",
    condition: "GOOD",
    location: "Downtown Metro",
    latitude: 37.7785,
    longitude: -122.4178,
    status: "ACTIVE",
    createdAt: new Date("2026-02-20T13:25:00Z"),
    updatedAt: new Date("2026-02-20T13:25:00Z"),
    images: [
      {
        id: "img-12",
        productId: "prd-11",
        imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=600&fit=crop",
      },
    ],
  },
  {
    id: "prd-12",
    sellerId: "usr-buyer-01",
    title: "Complete Software Engineering & Distributed Systems Books",
    description: "Hardcover collection including 'Designing Data-Intensive Applications' by Martin Kleppmann, 'System Design Interview' Vol 1 & 2 by Alex Xu, 'Clean Code', and 'Building Microservices'. Crisp pages with zero highlighting or dog-ears.",
    price: 85,
    category: "Books",
    condition: "LIKE_NEW",
    location: "Oakridge District",
    latitude: 37.7812,
    longitude: -122.4189,
    status: "ACTIVE",
    createdAt: new Date("2026-02-21T16:15:00Z"),
    updatedAt: new Date("2026-02-21T16:15:00Z"),
    images: [
      {
        id: "img-13",
        productId: "prd-12",
        imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop",
      },
    ],
  },
];

export const initialMockConversations: MockConversation[] = [
  {
    id: "conv-01",
    createdAt: new Date("2026-02-02T14:00:00Z"),
    updatedAt: new Date("2026-02-02T14:45:00Z"),
    participantIds: ["usr-buyer-01", "usr-prov-01"],
  },
  {
    id: "conv-02",
    createdAt: new Date("2026-02-12T15:00:00Z"),
    updatedAt: new Date("2026-02-12T15:30:00Z"),
    participantIds: ["usr-buyer-02", "usr-buyer-01"],
  },
];

export const initialMockMessages: MockMessage[] = [
  {
    id: "msg-01",
    conversationId: "conv-01",
    senderId: "usr-buyer-01",
    content: "Hi Marcus! We bought an electric vehicle and need a Level 2 48A charger installed in our garage. Are you available this Thursday for an estimate?",
    createdAt: new Date("2026-02-02T14:00:00Z"),
    readAt: new Date("2026-02-02T14:05:00Z"),
  },
  {
    id: "msg-02",
    conversationId: "conv-01",
    senderId: "usr-prov-01",
    content: "Hello Sarah! Congratulations on the EV. Yes, Thursday afternoon at 2:00 PM works great. I can inspect your main panel and run the 60A conduit. See you then!",
    createdAt: new Date("2026-02-02T14:15:00Z"),
    readAt: new Date("2026-02-02T14:20:00Z"),
  },
  {
    id: "msg-03",
    conversationId: "conv-02",
    senderId: "usr-buyer-02",
    content: "Hi Sarah, is the iPhone 15 Pro still available? Would you consider $750 for local cash pickup today at Oakridge center?",
    createdAt: new Date("2026-02-12T15:00:00Z"),
    readAt: new Date("2026-02-12T15:10:00Z"),
  },
  {
    id: "msg-04",
    conversationId: "conv-02",
    senderId: "usr-buyer-01",
    content: "Hi Alex, yes $750 works for cash pickup. I can meet you at the Starbucks inside Oakridge center at 5:30 PM!",
    createdAt: new Date("2026-02-12T15:20:00Z"),
    readAt: new Date("2026-02-12T15:25:00Z"),
  },
];

export const initialMockSavedProviders: MockSavedProvider[] = [
  {
    id: "sav-prv-01",
    userId: "usr-buyer-01",
    providerProfileId: "prv-01",
    createdAt: new Date("2026-02-03T11:00:00Z"),
  },
];

export const initialMockSavedProducts: MockSavedProduct[] = [
  {
    id: "sav-prd-01",
    userId: "usr-buyer-01",
    productId: "prd-02",
    createdAt: new Date("2026-02-11T16:00:00Z"),
  },
];

export const initialMockReports: MockReport[] = [
  {
    id: "rep-01",
    reporterId: "usr-buyer-02",
    targetType: "PRODUCT",
    targetId: "prd-05",
    reason: "Wanted to check if the serial number is verified.",
    status: "RESOLVED",
    createdAt: new Date("2026-02-14T12:00:00Z"),
  },
];
