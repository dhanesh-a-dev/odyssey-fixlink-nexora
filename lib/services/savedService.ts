import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { getProviderById } from "./providerService";
import { getProductById } from "./productService";
import { ProviderProfileType, ProductType } from "@/types";

export async function toggleSaveProvider(
  userId: string,
  providerProfileId: string
): Promise<{ saved: boolean }> {
  try {
    const existing = await prisma.savedProvider.findUnique({
      where: {
        userId_providerProfileId: {
          userId,
          providerProfileId,
        },
      },
    });

    if (existing) {
      await prisma.savedProvider.delete({
        where: { id: existing.id },
      });
      return { saved: false };
    } else {
      await prisma.savedProvider.create({
        data: {
          userId,
          providerProfileId,
        },
      });
      return { saved: true };
    }
  } catch {
    // Memory store fallback
  }

  const idx = memoryStore.savedProviders.findIndex(
    (sp) => sp.userId === userId && sp.providerProfileId === providerProfileId
  );
  if (idx !== -1) {
    memoryStore.savedProviders.splice(idx, 1);
    return { saved: false };
  } else {
    memoryStore.savedProviders.push({
      id: `sav-prv-${Date.now()}`,
      userId,
      providerProfileId,
      createdAt: new Date(),
    });
    return { saved: true };
  }
}

export async function toggleSaveProduct(
  userId: string,
  productId: string
): Promise<{ saved: boolean }> {
  try {
    const existing = await prisma.savedProduct.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.savedProduct.delete({
        where: { id: existing.id },
      });
      return { saved: false };
    } else {
      await prisma.savedProduct.create({
        data: {
          userId,
          productId,
        },
      });
      return { saved: true };
    }
  } catch {
    // Memory store fallback
  }

  const idx = memoryStore.savedProducts.findIndex(
    (sp) => sp.userId === userId && sp.productId === productId
  );
  if (idx !== -1) {
    memoryStore.savedProducts.splice(idx, 1);
    return { saved: false };
  } else {
    memoryStore.savedProducts.push({
      id: `sav-prd-${Date.now()}`,
      userId,
      productId,
      createdAt: new Date(),
    });
    return { saved: true };
  }
}

export async function getUserSavedItems(userId: string): Promise<{
  providers: ProviderProfileType[];
  products: ProductType[];
}> {
  let savedProvidersList: ProviderProfileType[] = [];
  let savedProductsList: ProductType[] = [];

  try {
    const dbProviders = await prisma.savedProvider.findMany({
      where: { userId },
    });
    for (const sp of dbProviders) {
      const p = await getProviderById(sp.providerProfileId, userId);
      if (p) savedProvidersList.push(p);
    }

    const dbProducts = await prisma.savedProduct.findMany({
      where: { userId },
    });
    for (const sp of dbProducts) {
      const prod = await getProductById(sp.productId, userId);
      if (prod) savedProductsList.push(prod);
    }

    if (savedProvidersList.length > 0 || savedProductsList.length > 0) {
      return { providers: savedProvidersList, products: savedProductsList };
    }
  } catch {
    // Database query failed
  }

  // Memory store fallback
  const userSavedProvs = memoryStore.savedProviders.filter(
    (sp) => sp.userId === userId
  );
  for (const sp of userSavedProvs) {
    const p = await getProviderById(sp.providerProfileId, userId);
    if (p) savedProvidersList.push(p);
  }

  const userSavedProds = memoryStore.savedProducts.filter(
    (sp) => sp.userId === userId
  );
  for (const sp of userSavedProds) {
    const prod = await getProductById(sp.productId, userId);
    if (prod) savedProductsList.push(prod);
  }

  return { providers: savedProvidersList, products: savedProductsList };
}
