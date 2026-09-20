import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FixLink SQLite database...');

  // Clean existing records in reverse dependency order
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Password123!', salt);

  // 1. Create Customers
  const customer1 = await prisma.user.create({
    data: {
      name: 'Anjali Mishra',
      email: 'anjali@example.com',
      password: defaultPassword,
      role: 'CUSTOMER',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      password: defaultPassword,
      role: 'CUSTOMER',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
    },
  });

  // 2. Create Service Providers
  const provider1 = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: defaultPassword,
      role: 'PROVIDER',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
      providerProfile: {
        create: {
          profession: 'Electrician',
          bio: 'Experienced electrician with 12+ years fixing residential and commercial wiring, switchboards, and inverters.',
          experienceYears: 12,
          location: 'Sector 14, Downtown',
          skills: JSON.stringify(['Wiring', 'Switchboards', 'Inverters', 'Fault Finding', 'Circuit Breakers']),
          portfolioImages: JSON.stringify([
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
          ]),
        },
      },
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      name: 'Amit Sharma',
      email: 'amit@example.com',
      password: defaultPassword,
      role: 'PROVIDER',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
      providerProfile: {
        create: {
          profession: 'Plumber',
          bio: 'Expert in fixing leaks, sanitary fittings, pipe installations, and solar/electric water heaters.',
          experienceYears: 8,
          location: 'Green Park',
          skills: JSON.stringify(['Pipe Fitting', 'Leak Repair', 'Water Heaters', 'Drainage Solutions']),
          portfolioImages: JSON.stringify([
            'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
          ]),
        },
      },
    },
  });

  const provider3 = await prisma.user.create({
    data: {
      name: 'Sunita Devi',
      email: 'sunita@example.com',
      password: defaultPassword,
      role: 'PROVIDER',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
      providerProfile: {
        create: {
          profession: 'Cleaner',
          bio: 'Professional deep cleaning services for apartments, villas, and commercial offices with eco-friendly products.',
          experienceYears: 5,
          location: 'Civil Lines',
          skills: JSON.stringify(['Deep Cleaning', 'Sanitization', 'Organizing', 'Kitchen Degreasing']),
          portfolioImages: JSON.stringify([
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
          ]),
        },
      },
    },
  });

  // 3. Create Reviews
  await prisma.review.createMany({
    data: [
      {
        providerId: provider1.id,
        reviewerId: customer1.id,
        rating: 5,
        comment: 'Rajesh was very professional and fixed our inverter issue in 30 minutes!',
      },
      {
        providerId: provider1.id,
        reviewerId: customer2.id,
        rating: 4,
        comment: 'Good work, very knowledgeable, solved the short-circuit issue safely.',
      },
      {
        providerId: provider2.id,
        reviewerId: customer2.id,
        rating: 5,
        comment: 'Amit installed our new water heater perfectly. Clean and punctual!',
      },
      {
        providerId: provider3.id,
        reviewerId: customer1.id,
        rating: 5,
        comment: 'Absolutely spotless cleaning! Highly recommended to everyone in Civil Lines.',
      },
    ],
  });

  // 4. Create Marketplace Products
  await prisma.product.createMany({
    data: [
      {
        sellerId: customer2.id,
        title: 'Almost New Office Chair',
        description: 'High-back mesh ergonomic desk chair with lumbar support and adjustable armrests. Used for only 3 months.',
        price: 1200,
        category: 'Furniture',
        location: 'Sector 21',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
        ]),
      },
      {
        sellerId: customer1.id,
        title: 'Washing Machine 7kg',
        description: 'Samsung 7kg top load washing machine in great condition. Works smoothly with inverter technology.',
        price: 8500,
        category: 'Appliances',
        location: 'Lake View Apartments',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800',
        ]),
      },
      {
        sellerId: provider1.id,
        title: 'Bosch Cordless Power Drill Set',
        description: 'Barely used Bosch 18V drill kit with 2 lithium-ion batteries, charger, and 30-piece drill bit set.',
        price: 3200,
        category: 'Tools',
        location: 'Downtown',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
        ]),
      },
    ],
  });

  // 5. Create Sample Direct Messages
  await prisma.message.createMany({
    data: [
      {
        senderId: customer1.id,
        receiverId: provider1.id,
        content: 'Hi Rajesh, are you available tomorrow for a switchboard replacement in Sector 14?',
      },
      {
        senderId: provider1.id,
        receiverId: customer1.id,
        content: 'Hello Anjali! Yes, I can visit between 11 AM and 1 PM tomorrow.',
      },
      {
        senderId: customer2.id,
        receiverId: customer1.id,
        content: 'Hi, is the 7kg washing machine still available for inspection today?',
      },
    ],
  });

  console.log('✅ FixLink SQLite database successfully seeded!');
  console.log(`- Default password for all seeded users: Password123!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
