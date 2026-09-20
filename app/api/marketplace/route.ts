import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/services/productService";
import { getCurrentUser } from "@/lib/auth/session";
import { validateProduct } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const condition = (searchParams.get("condition") as any) || undefined;
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const location = searchParams.get("location") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;

    const result = await getProducts({
      category,
      condition,
      minPrice,
      maxPrice,
      location,
      search,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching marketplace products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { valid, errors } = validateProduct(body);
    if (!valid) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const product = await createProduct(session.userId, {
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      condition: body.condition || "GOOD",
      location: body.location,
      imageUrls: body.imageUrls || [],
    });

    return NextResponse.json({ product, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating marketplace product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
