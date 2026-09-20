import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { ProviderProfileType } from "@/types";
import { calculateDistanceKm, matchesLocation } from "@/lib/utils/geo";

export async function getProviders(params?: {
  profession?: string;
  location?: string;
  search?: string;
  minRating?: number;
  minExperience?: number;
  sortBy?: "rating" | "experience" | "relevance" | "nearest";
  userLat?: number;
  userLng?: number;
  page?: number;
  limit?: number;
}): Promise<{
  providers: ProviderProfileType[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const page = params?.page || 1;
  const limit = params?.limit || 12;

  let profilesData: ProviderProfileType[] = [];

  try {
    const dbProfiles = await prisma.providerProfile.findMany({
      include: {
        user: true,
        portfolio: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProfiles.length > 0) {
      // Get all reviews for rating calculations
      const allReviews = await prisma.review.findMany();

      profilesData = dbProfiles.map((p) => {
        const pReviews = allReviews.filter((r) => r.providerId === p.userId);
        const avg =
          pReviews.length > 0
            ? Math.round(
                (pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length) * 10
              ) / 10
            : 0;

        let parsedSkills: string[] = [];
        try {
          parsedSkills = JSON.parse(p.skills);
        } catch {
          parsedSkills = p.skills.split(",").map((s) => s.trim()).filter(Boolean);
        }

        return {
          id: p.id,
          userId: p.userId,
          profession: p.profession,
          bio: p.bio,
          experienceYears: p.experienceYears,
          skills: parsedSkills,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          availability: p.availability,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          averageRating: avg,
          reviewCount: pReviews.length,
          user: {
            id: p.user.id,
            name: p.user.name,
            email: p.user.email,
            avatarUrl: p.user.avatarUrl,
            phone: p.user.phone,
            location: p.user.location,
            latitude: p.user.latitude,
            longitude: p.user.longitude,
            role: p.user.role,
            createdAt: p.user.createdAt,
          },
          portfolio: p.portfolio.map((item) => ({
            id: item.id,
            providerId: item.providerId,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            createdAt: item.createdAt,
          })),
        };
      });
    }
  } catch {
    // Database query failed, use memoryStore
  }

  if (profilesData.length === 0) {
    // Build from memory store
    profilesData = memoryStore.profiles.map((p) => {
      const user = memoryStore.users.find((u) => u.id === p.userId);
      const userReviews = memoryStore.reviews.filter((r) => r.providerId === p.userId);
      const avg =
        userReviews.length > 0
          ? Math.round(
              (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length) * 10
            ) / 10
          : 0;
      const userPortfolio = memoryStore.portfolios.filter((item) => item.providerId === p.id);

      return {
        id: p.id,
        userId: p.userId,
        profession: p.profession,
        bio: p.bio,
        experienceYears: p.experienceYears,
        skills: p.skills,
        location: p.location,
        latitude: p.latitude,
        longitude: p.longitude,
        availability: p.availability,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        averageRating: avg,
        reviewCount: userReviews.length,
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              avatarUrl: user.avatarUrl,
              phone: user.phone,
              location: user.location,
              latitude: user.latitude,
              longitude: user.longitude,
              role: user.role,
              createdAt: user.createdAt,
            }
          : undefined,
        portfolio: userPortfolio,
      };
    });
  }

  // Apply filters
  let filtered = profilesData.filter((p) => {
    // Profession filter
    if (
      params?.profession &&
      params.profession.toLowerCase() !== "all" &&
      p.profession.toLowerCase() !== params.profession.toLowerCase()
    ) {
      return false;
    }

    // Location filter
    if (params?.location && !matchesLocation(p.location, params.location)) {
      return false;
    }

    // Search query
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      const matchProf = p.profession.toLowerCase().includes(q);
      const matchBio = p.bio?.toLowerCase().includes(q) || false;
      const matchSkills = p.skills.some((s) => s.toLowerCase().includes(q));
      const matchName = p.user?.name.toLowerCase().includes(q) || false;
      if (!matchProf && !matchBio && !matchSkills && !matchName) {
        return false;
      }
    }

    // Min rating filter
    if (params?.minRating && (p.averageRating || 0) < params.minRating) {
      return false;
    }

    // Min experience filter
    if (params?.minExperience && p.experienceYears < params.minExperience) {
      return false;
    }

    return true;
  });

  // Apply sorting
  if (params?.sortBy === "rating") {
    filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  } else if (params?.sortBy === "experience") {
    filtered.sort((a, b) => b.experienceYears - a.experienceYears);
  } else if (
    params?.sortBy === "nearest" &&
    params.userLat !== undefined &&
    params.userLng !== undefined
  ) {
    filtered.sort((a, b) => {
      const distA =
        a.latitude && a.longitude
          ? calculateDistanceKm(params.userLat!, params.userLng!, a.latitude, a.longitude)
          : 9999;
      const distB =
        b.latitude && b.longitude
          ? calculateDistanceKm(params.userLat!, params.userLng!, b.latitude, b.longitude)
          : 9999;
      return distA - distB;
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    providers: paginated,
    total,
    page,
    totalPages,
  };
}

export async function getProviderById(
  id: string,
  currentUserId?: string
): Promise<ProviderProfileType | null> {
  let profile: ProviderProfileType | null = null;

  try {
    const dbProfile = await prisma.providerProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: true,
        portfolio: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (dbProfile) {
      const dbReviews = await prisma.review.findMany({
        where: { providerId: dbProfile.userId },
        include: { reviewer: true },
        orderBy: { createdAt: "desc" },
      });

      const avg =
        dbReviews.length > 0
          ? Math.round(
              (dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length) * 10
            ) / 10
          : 0;

      let parsedSkills: string[] = [];
      try {
        parsedSkills = JSON.parse(dbProfile.skills);
      } catch {
        parsedSkills = dbProfile.skills.split(",").map((s) => s.trim()).filter(Boolean);
      }

      let isSaved = false;
      if (currentUserId) {
        const saved = await prisma.savedProvider.findUnique({
          where: {
            userId_providerProfileId: {
              userId: currentUserId,
              providerProfileId: dbProfile.id,
            },
          },
        });
        isSaved = !!saved;
      }

      profile = {
        id: dbProfile.id,
        userId: dbProfile.userId,
        profession: dbProfile.profession,
        bio: dbProfile.bio,
        experienceYears: dbProfile.experienceYears,
        skills: parsedSkills,
        location: dbProfile.location,
        latitude: dbProfile.latitude,
        longitude: dbProfile.longitude,
        availability: dbProfile.availability,
        createdAt: dbProfile.createdAt,
        updatedAt: dbProfile.updatedAt,
        averageRating: avg,
        reviewCount: dbReviews.length,
        isSaved,
        user: {
          id: dbProfile.user.id,
          name: dbProfile.user.name,
          email: dbProfile.user.email,
          avatarUrl: dbProfile.user.avatarUrl,
          phone: dbProfile.user.phone,
          location: dbProfile.user.location,
          latitude: dbProfile.user.latitude,
          longitude: dbProfile.user.longitude,
          role: dbProfile.user.role,
          createdAt: dbProfile.user.createdAt,
        },
        portfolio: dbProfile.portfolio.map((item) => ({
          id: item.id,
          providerId: item.providerId,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          createdAt: item.createdAt,
        })),
        reviews: dbReviews.map((r) => ({
          id: r.id,
          providerId: r.providerId,
          reviewerId: r.reviewerId,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          reviewer: {
            id: r.reviewer.id,
            name: r.reviewer.name,
            avatarUrl: r.reviewer.avatarUrl,
          },
        })),
      };
    }
  } catch {
    // Database query failed
  }

  if (!profile) {
    // Search memory store by id or userId
    const memProfile = memoryStore.profiles.find(
      (p) => p.id === id || p.userId === id
    );
    if (!memProfile) return null;

    const user = memoryStore.users.find((u) => u.id === memProfile.userId);
    const reviews = memoryStore.reviews.filter((r) => r.providerId === memProfile.userId);
    const avg =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) /
          10
        : 0;
    const portfolio = memoryStore.portfolios.filter(
      (item) => item.providerId === memProfile.id
    );

    const isSaved = currentUserId
      ? memoryStore.savedProviders.some(
          (sp) => sp.userId === currentUserId && sp.providerProfileId === memProfile.id
        )
      : false;

    profile = {
      id: memProfile.id,
      userId: memProfile.userId,
      profession: memProfile.profession,
      bio: memProfile.bio,
      experienceYears: memProfile.experienceYears,
      skills: memProfile.skills,
      location: memProfile.location,
      latitude: memProfile.latitude,
      longitude: memProfile.longitude,
      availability: memProfile.availability,
      createdAt: memProfile.createdAt,
      updatedAt: memProfile.updatedAt,
      averageRating: avg,
      reviewCount: reviews.length,
      isSaved,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            phone: user.phone,
            location: user.location,
            latitude: user.latitude,
            longitude: user.longitude,
            role: user.role,
            createdAt: user.createdAt,
          }
        : undefined,
      portfolio,
      reviews: reviews.map((r) => {
        const revUser = memoryStore.users.find((u) => u.id === r.reviewerId);
        return {
          id: r.id,
          providerId: r.providerId,
          reviewerId: r.reviewerId,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          reviewer: revUser
            ? {
                id: revUser.id,
                name: revUser.name,
                avatarUrl: revUser.avatarUrl,
              }
            : undefined,
        };
      }),
    };
  }

  return profile;
}

export async function createOrUpdateProviderProfile(
  userId: string,
  data: {
    profession: string;
    bio?: string;
    experienceYears?: number;
    skills?: string[] | string;
    location: string;
    availability?: string;
    portfolioItems?: { title: string; description?: string; imageUrl: string }[];
  }
): Promise<ProviderProfileType> {
  const skillsArray = Array.isArray(data.skills)
    ? data.skills
    : typeof data.skills === "string"
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const skillsJson = JSON.stringify(skillsArray);
  const now = new Date();

  try {
    // Elevate user role to PROVIDER
    await prisma.user.update({
      where: { id: userId },
      data: { role: "PROVIDER" },
    });

    const existing = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    let profileId = existing?.id;

    if (existing) {
      await prisma.providerProfile.update({
        where: { id: existing.id },
        data: {
          profession: data.profession.trim(),
          bio: data.bio?.trim() || null,
          experienceYears: Number(data.experienceYears) || 0,
          skills: skillsJson,
          location: data.location.trim(),
          availability: data.availability?.trim() || "Available",
        },
      });
    } else {
      const created = await prisma.providerProfile.create({
        data: {
          userId,
          profession: data.profession.trim(),
          bio: data.bio?.trim() || null,
          experienceYears: Number(data.experienceYears) || 0,
          skills: skillsJson,
          location: data.location.trim(),
          availability: data.availability?.trim() || "Available",
        },
      });
      profileId = created.id;
    }

    if (profileId && data.portfolioItems && data.portfolioItems.length > 0) {
      for (const item of data.portfolioItems) {
        if (item.title && item.imageUrl) {
          await prisma.portfolioItem.create({
            data: {
              providerId: profileId,
              title: item.title.trim(),
              description: item.description?.trim() || null,
              imageUrl: item.imageUrl.trim(),
            },
          });
        }
      }
    }

    const updated = await getProviderById(profileId!);
    if (updated) return updated;
  } catch {
    // Fallback to memory store
  }

  // Memory store fallback
  const user = memoryStore.users.find((u) => u.id === userId);
  if (user) {
    user.role = "PROVIDER";
  }

  let memProfile = memoryStore.profiles.find((p) => p.userId === userId);
  if (memProfile) {
    memProfile.profession = data.profession.trim();
    memProfile.bio = data.bio?.trim() || "";
    memProfile.experienceYears = Number(data.experienceYears) || 0;
    memProfile.skills = skillsArray;
    memProfile.location = data.location.trim();
    memProfile.availability = data.availability?.trim() || "Available";
    memProfile.updatedAt = now;
  } else {
    memProfile = {
      id: `prv-${Date.now()}`,
      userId,
      profession: data.profession.trim(),
      bio: data.bio?.trim() || "",
      experienceYears: Number(data.experienceYears) || 0,
      skills: skillsArray,
      location: data.location.trim(),
      latitude: 37.7749,
      longitude: -122.4194,
      availability: data.availability?.trim() || "Available",
      createdAt: now,
      updatedAt: now,
    };
    memoryStore.profiles.push(memProfile);
  }

  if (data.portfolioItems) {
    for (const item of data.portfolioItems) {
      if (item.title && item.imageUrl) {
        memoryStore.portfolios.push({
          id: `port-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          providerId: memProfile.id,
          title: item.title.trim(),
          description: item.description?.trim() || "",
          imageUrl: item.imageUrl.trim(),
          createdAt: now,
        });
      }
    }
  }

  return (await getProviderById(memProfile.id))!;
}
