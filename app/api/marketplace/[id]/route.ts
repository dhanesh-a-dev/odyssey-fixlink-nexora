import { NextResponse } from "next/server";
import { getProductById, updateProductStatus, deleteProduct } from "@/lib/services/productService";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    const product = await getProductById(id, session?.userId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;
    if (!status || !["ACTIVE", "SOLD", "REMOVED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateProductStatus(
      id,
      session.userId,
      status,
      session.role === "ADMIN"
    );

    return NextResponse.json({ product: updated, success: true });
  } catch (error: any) {
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "You are not authorized to update this listing." }, { status: 403 });
    }
    if (error?.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await deleteProduct(id, session.userId, session.role === "ADMIN");
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Not authorized to delete this product" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
