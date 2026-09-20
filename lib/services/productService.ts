import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { ProductCondition, ProductStatus, ProductType } from "@/types";
import { matchesLocation } from "@/lib/utils/geo";

export async function getProducts(params?: {
  category?: string;
  condition?: ProductCondition | "ALL";
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
  status?: ProductStatus;
  sortBy?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}): Promise<{
  products: ProductType[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const page = params?.page || 1;
  const limit = params?.limit || 12;
  const statusFilter = params?.status || "ACTIVE";

  let productsData: ProductType[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        status: statusFilter,
      },
      include: {
        seller: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts.length > 0) {
      productsData = dbProducts.map((p) => ({
        id: p.id,
        sellerId: p.sellerId,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        condition: p.condition,
        location: p.location,
        latitude: p.latitude,
        longitude: p.longitude,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        seller: {
          id: p.seller.id,
          name: p.seller.name,
          email: p.seller.email,
          avatarUrl: p.seller.avatarUrl,
          phone: p.seller.phone,
          location: p.seller.location,
          latitude: p.seller.latitude,
          longitude: p.seller.longitude,
          role: p.seller.role,
          createdAt: p.seller.createdAt,
        },
        images: p.images.map((img) => ({
          id: img.id,
          productId: img.productId,
          imageUrl: img.imageUrl,
        })),
      }));
    }
  } catch {
    // Database query failed, use memoryStore
  }

  if (productsData.length === 0) {
    productsData = memoryStore.products
      .filter((p) => !statusFilter || p.status === statusFilter)
      .map((p) => {
        const seller = memoryStore.users.find((u) => u.id === p.sellerId);
        return {
          id: p.id,
          sellerId: p.sellerId,
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          condition: p.condition,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          status: p.status,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          seller: seller
            ? {
                id: seller.id,
                name: seller.name,
                email: seller.email,
                avatarUrl: seller.avatarUrl,
                phone: seller.phone,
                location: seller.location,
                latitude: seller.latitude,
                longitude: seller.longitude,
                role: seller.role,
                createdAt: seller.createdAt,
              }
            : undefined,
          images: p.images,
        };
      });
  }

  // Filters
  let filtered = productsData.filter((p) => {
    // Category
    if (
      params?.category &&
      params.category.toLowerCase() !== "all" &&
      p.category.toLowerCase() !== params.category.toLowerCase()
    ) {
      return false;
    }

    // Condition
    if (params?.condition && params.condition !== "ALL" && p.condition !== params.condition) {
      return false;
    }

    // Min price
    if (params?.minPrice !== undefined && p.price < params.minPrice) {
      return false;
    }

    // Max price
    if (params?.maxPrice !== undefined && p.price > params.maxPrice) {
      return false;
    }

    // Location
    if (params?.location && !matchesLocation(p.location, params.location)) {
      return false;
    }

    // Search query
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inCategory = p.category.toLowerCase().includes(q);
      if (!inTitle && !inDesc && !inCategory) {
        return false;
      }
    }

    return true;
  });

  // Sort
  if (params?.sortBy === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params?.sortBy === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    // newest default
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    total,
    page,
    totalPages,
  };
}

export async function getProductById(
  id: string,
  currentUserId?: string
): Promise<ProductType | null> {
  let product: ProductType | null = null;

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: true,
        images: true,
      },
    });

    if (dbProduct) {
      let isSaved = false;
      if (currentUserId) {
        const saved = await prisma.savedProduct.findUnique({
          where: {
            userId_productId: {
              userId: currentUserId,
              productId: dbProduct.id,
            },
          },
        });
        isSaved = !!saved;
      }

      product = {
        id: dbProduct.id,
        sellerId: dbProduct.sellerId,
        title: dbProduct.title,
        description: dbProduct.description,
        price: dbProduct.price,
        category: dbProduct.category,
        condition: dbProduct.condition,
        location: dbProduct.location,
        latitude: dbProduct.latitude,
        longitude: dbProduct.longitude,
        status: dbProduct.status,
        createdAt: dbProduct.createdAt,
        updatedAt: dbProduct.updatedAt,
        isSaved,
        seller: {
          id: dbProduct.seller.id,
          name: dbProduct.seller.name,
          email: dbProduct.seller.email,
          avatarUrl: dbProduct.seller.avatarUrl,
          phone: dbProduct.seller.phone,
          location: dbProduct.seller.location,
          latitude: dbProduct.seller.latitude,
          longitude: dbProduct.seller.longitude,
          role: dbProduct.seller.role,
          createdAt: dbProduct.seller.createdAt,
        },
        images: dbProduct.images.map((img) => ({
          id: img.id,
          productId: img.productId,
          imageUrl: img.imageUrl,
        })),
      };
    }
  } catch {
    // Database query failed
  }

  if (!product) {
    const memProduct = memoryStore.products.find((p) => p.id === id);
    if (!memProduct) return null;

    const seller = memoryStore.users.find((u) => u.id === memProduct.sellerId);
    const isSaved = currentUserId
      ? memoryStore.savedProducts.some(
          (sp) => sp.userId === currentUserId && sp.productId === memProduct.id
        )
      : false;

    product = {
      id: memProduct.id,
      sellerId: memProduct.sellerId,
      title: memProduct.title,
      description: memProduct.description,
      price: memProduct.price,
      category: memProduct.category,
      condition: memProduct.condition,
      location: memProduct.location,
      latitude: memProduct.latitude,
      longitude: memProduct.longitude,
      status: memProduct.status,
      createdAt: memProduct.createdAt,
      updatedAt: memProduct.updatedAt,
      isSaved,
      seller: seller
        ? {
            id: seller.id,
            name: seller.name,
            email: seller.email,
            avatarUrl: seller.avatarUrl,
            phone: seller.phone,
            location: seller.location,
            latitude: seller.latitude,
            longitude: seller.longitude,
            role: seller.role,
            createdAt: seller.createdAt,
          }
        : undefined,
      images: memProduct.images,
    };
  }

  return product;
}

export async function createProduct(
  sellerId: string,
  data: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: ProductCondition;
    location: string;
    latitude?: number;
    longitude?: number;
    imageUrls?: string[];
  }
): Promise<ProductType> {
  const images = (data.imageUrls || []).filter(Boolean);
  const now = new Date();
  const id = `prd-${Date.now()}`;

  try {
    const created = await prisma.product.create({
      data: {
        sellerId,
        title: data.title.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        category: data.category.trim(),
        condition: data.condition,
        location: data.location.trim(),
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        status: "ACTIVE",
        images: {
          create: images.map((url) => ({
            imageUrl: url.trim(),
          })),
        },
      },
      include: {
        seller: true,
        images: true,
      },
    });

    return {
      id: created.id,
      sellerId: created.sellerId,
      title: created.title,
      description: created.description,
      price: created.price,
      category: created.category,
      condition: created.condition,
      location: created.location,
      latitude: created.latitude,
      longitude: created.longitude,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      seller: {
        id: created.seller.id,
        name: created.seller.name,
        email: created.seller.email,
        avatarUrl: created.seller.avatarUrl,
        phone: created.seller.phone,
        location: created.seller.location,
        latitude: created.seller.latitude,
        longitude: created.seller.longitude,
        role: created.seller.role,
        createdAt: created.seller.createdAt,
      },
      images: created.images.map((img) => ({
        id: img.id,
        productId: img.productId,
        imageUrl: img.imageUrl,
      })),
    };
  } catch {
    // Memory store fallback
  }

  const seller = memoryStore.users.find((u) => u.id === sellerId);
  const newImages =
    images.length > 0
      ? images.map((url, i) => ({
          id: `img-${Date.now()}-${i}`,
          productId: id,
          imageUrl: url.trim(),
        }))
      : [
          {
            id: `img-${Date.now()}-default`,
            productId: id,
            imageUrl:
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop",
          },
        ];

  const memProduct = {
    id,
    sellerId,
    title: data.title.trim(),
    description: data.description.trim(),
    price: Number(data.price),
    category: data.category.trim(),
    condition: data.condition,
    location: data.location.trim(),
    latitude: data.latitude || 37.7749,
    longitude: data.longitude || -122.4194,
    status: "ACTIVE" as ProductStatus,
    createdAt: now,
    updatedAt: now,
    images: newImages,
  };

  memoryStore.products.unshift(memProduct);

  return {
    id: memProduct.id,
    sellerId: memProduct.sellerId,
    title: memProduct.title,
    description: memProduct.description,
    price: memProduct.price,
    category: memProduct.category,
    condition: memProduct.condition,
    location: memProduct.location,
    latitude: memProduct.latitude,
    longitude: memProduct.longitude,
    status: memProduct.status,
    createdAt: memProduct.createdAt,
    updatedAt: memProduct.updatedAt,
    seller: seller
      ? {
          id: seller.id,
          name: seller.name,
          email: seller.email,
          avatarUrl: seller.avatarUrl,
          phone: seller.phone,
          location: seller.location,
          latitude: seller.latitude,
          longitude: seller.longitude,
          role: seller.role,
          createdAt: seller.createdAt,
        }
      : undefined,
    images: memProduct.images,
  };
}

export async function updateProductStatus(
  productId: string,
  userId: string,
  newStatus: ProductStatus,
  isAdmin: boolean = false
) {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("NOT_FOUND");
    if (product.sellerId !== userId && !isAdmin) throw new Error("FORBIDDEN");

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { status: newStatus },
    });
    return updated;
  } catch {
    const product = memoryStore.products.find((p) => p.id === productId);
    if (!product) throw new Error("NOT_FOUND");
    if (product.sellerId !== userId && !isAdmin) throw new Error("FORBIDDEN");

    product.status = newStatus;
    product.updatedAt = new Date();
    return product;
  }
}

export async function deleteProduct(
  productId: string,
  userId: string,
  isAdmin: boolean = false
) {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("NOT_FOUND");
    if (product.sellerId !== userId && !isAdmin) throw new Error("FORBIDDEN");

    await prisma.product.delete({ where: { id: productId } });
    return true;
  } catch {
    const index = memoryStore.products.findIndex((p) => p.id === productId);
    if (index === -1) throw new Error("NOT_FOUND");
    if (memoryStore.products[index].sellerId !== userId && !isAdmin) {
      throw new Error("FORBIDDEN");
    }
    memoryStore.products.splice(index, 1);
    return true;
  }
}

export async function getUserListings(userId: string): Promise<ProductType[]> {
  try {
    const list = await prisma.product.findMany({
      where: { sellerId: userId },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    if (list.length > 0) {
      return list.map((p) => ({
        id: p.id,
        sellerId: p.sellerId,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        condition: p.condition,
        location: p.location,
        latitude: p.latitude,
        longitude: p.longitude,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        images: p.images.map((img) => ({
          id: img.id,
          productId: img.productId,
          imageUrl: img.imageUrl,
        })),
      }));
    }
  } catch {
    // Database query failed
  }

  return memoryStore.products
    .filter((p) => p.sellerId === userId)
    .map((p) => ({
      id: p.id,
      sellerId: p.sellerId,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      condition: p.condition,
      location: p.location,
      latitude: p.latitude,
      longitude: p.longitude,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      images: p.images,
    }));
}
