import { PrismaClient, Role, ProductCondition, ProductStatus, ReportTargetType, ReportStatus } from "@prisma/client";
import {
  initialMockUsers,
  initialMockProfiles,
  initialMockPortfolioItems,
  initialMockReviews,
  initialMockProducts,
  initialMockConversations,
  initialMockMessages,
  initialMockSavedProviders,
  initialMockSavedProducts,
  initialMockReports,
} from "../lib/services/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding FixLink PostgreSQL Database...");

  // 1. Seed Users
  for (const u of initialMockUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        avatarUrl: u.avatarUrl,
        phone: u.phone,
        location: u.location,
        latitude: u.latitude,
        longitude: u.longitude,
        role: u.role as Role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      },
    });
  }
  console.log(`✓ Seeded ${initialMockUsers.length} users`);

  // 2. Seed ProviderProfiles
  for (const p of initialMockProfiles) {
    await prisma.providerProfile.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        userId: p.userId,
        profession: p.profession,
        bio: p.bio,
        experienceYears: p.experienceYears,
        skills: JSON.stringify(p.skills),
        location: p.location,
        latitude: p.latitude,
        longitude: p.longitude,
        availability: p.availability,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
    });
  }
  console.log(`✓ Seeded ${initialMockProfiles.length} provider profiles`);

  // 3. Seed Portfolio Items
  for (const item of initialMockPortfolioItems) {
    await prisma.portfolioItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        providerId: item.providerId,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt,
      },
    });
  }
  console.log(`✓ Seeded ${initialMockPortfolioItems.length} portfolio items`);

  // 4. Seed Reviews
  for (const r of initialMockReviews) {
    await prisma.review.upsert({
      where: {
        providerId_reviewerId: {
          providerId: r.providerId,
          reviewerId: r.reviewerId,
        },
      },
      update: {},
      create: {
        id: r.id,
        providerId: r.providerId,
        reviewerId: r.reviewerId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      },
    });
  }
  console.log(`✓ Seeded ${initialMockReviews.length} reviews`);

  // 5. Seed Products & Images
  for (const prd of initialMockProducts) {
    await prisma.product.upsert({
      where: { id: prd.id },
      update: {},
      create: {
        id: prd.id,
        sellerId: prd.sellerId,
        title: prd.title,
        description: prd.description,
        price: prd.price,
        category: prd.category,
        condition: prd.condition as ProductCondition,
        location: prd.location,
        latitude: prd.latitude,
        longitude: prd.longitude,
        status: prd.status as ProductStatus,
        createdAt: prd.createdAt,
        updatedAt: prd.updatedAt,
        images: {
          create: prd.images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
          })),
        },
      },
    });
  }
  console.log(`✓ Seeded ${initialMockProducts.length} marketplace products`);

  // 6. Seed Conversations & Participants
  for (const c of initialMockConversations) {
    await prisma.conversation.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        participants: {
          create: c.participantIds.map((uid) => ({
            userId: uid,
          })),
        },
      },
    });
  }

  // 7. Seed Messages
  for (const m of initialMockMessages) {
    await prisma.message.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.content,
        createdAt: m.createdAt,
        readAt: m.readAt,
      },
    });
  }
  console.log(`✓ Seeded ${initialMockMessages.length} direct messages`);

  // 8. Seed Saved Items
  for (const sp of initialMockSavedProviders) {
    await prisma.savedProvider.upsert({
      where: {
        userId_providerProfileId: {
          userId: sp.userId,
          providerProfileId: sp.providerProfileId,
        },
      },
      update: {},
      create: {
        id: sp.id,
        userId: sp.userId,
        providerProfileId: sp.providerProfileId,
        createdAt: sp.createdAt,
      },
    });
  }

  for (const spd of initialMockSavedProducts) {
    await prisma.savedProduct.upsert({
      where: {
        userId_productId: {
          userId: spd.userId,
          productId: spd.productId,
        },
      },
      update: {},
      create: {
        id: spd.id,
        userId: spd.userId,
        productId: spd.productId,
        createdAt: spd.createdAt,
      },
    });
  }

  // 9. Seed Reports
  for (const rep of initialMockReports) {
    await prisma.report.upsert({
      where: { id: rep.id },
      update: {},
      create: {
        id: rep.id,
        reporterId: rep.reporterId,
        targetType: rep.targetType as ReportTargetType,
        targetId: rep.targetId,
        reason: rep.reason,
        status: rep.status as ReportStatus,
        createdAt: rep.createdAt,
      },
    });
  }
  console.log(`✓ Seeded ${initialMockReports.length} reports`);

  console.log("🚀 FixLink database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
