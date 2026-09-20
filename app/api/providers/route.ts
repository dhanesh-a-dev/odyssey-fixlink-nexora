import { NextResponse } from "next/server";
import { getProviders, createOrUpdateProviderProfile } from "@/lib/services/providerService";
import { getCurrentUser } from "@/lib/auth/session";
import { validateProviderProfile } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profession = searchParams.get("profession") || undefined;
    const location = searchParams.get("location") || undefined;
    const search = searchParams.get("search") || undefined;
    const minRating = searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined;
    const minExperience = searchParams.get("minExperience")
      ? Number(searchParams.get("minExperience"))
      : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;
    const userLat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
    const userLng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;

    const result = await getProviders({
      profession,
      location,
      search,
      minRating,
      minExperience,
      sortBy,
      userLat,
      userLng,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { valid, errors } = validateProviderProfile(body);
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const profile = await createOrUpdateProviderProfile(session.userId, {
      profession: body.profession,
      bio: body.bio,
      experienceYears: body.experienceYears,
      skills: body.skills,
      location: body.location,
      availability: body.availability,
      portfolioItems: body.portfolioItems,
    });

    return NextResponse.json({ profile, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating provider profile:", error);
    return NextResponse.json({ error: "Failed to create provider profile" }, { status: 500 });
  }
}
