import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { Role, UserSummary } from "@/types";
import { hashPassword } from "@/lib/auth/password";

export async function getUserById(id: string): Promise<UserSummary | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      return {
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
      };
    }
  } catch {
    // Fallback to memory store
  }

  const memUser = memoryStore.users.find((u) => u.id === id);
  if (!memUser) return null;
  return {
    id: memUser.id,
    name: memUser.name,
    email: memUser.email,
    avatarUrl: memUser.avatarUrl,
    phone: memUser.phone,
    location: memUser.location,
    latitude: memUser.latitude,
    longitude: memUser.longitude,
    role: memUser.role,
    createdAt: memUser.createdAt,
  };
}

export async function getUserByEmail(email: string) {
  const cleanEmail = email.toLowerCase().trim();
  try {
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (user) return user;
  } catch {
    // Fallback to memory store
  }

  return memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  location: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}): Promise<UserSummary> {
  const passwordHash = await hashPassword(data.password);
  const cleanEmail = data.email.toLowerCase().trim();
  const id = `usr-${Date.now()}`;
  const now = new Date();

  try {
    const created = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: cleanEmail,
        passwordHash,
        location: data.location.trim(),
        phone: data.phone?.trim() || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        role: "USER",
      },
    });
    return {
      id: created.id,
      name: created.name,
      email: created.email,
      avatarUrl: created.avatarUrl,
      phone: created.phone,
      location: created.location,
      latitude: created.latitude,
      longitude: created.longitude,
      role: created.role,
      createdAt: created.createdAt,
    };
  } catch {
    // Fallback to memory store
    const newUser = {
      id,
      name: data.name.trim(),
      email: cleanEmail,
      passwordHash,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=faces`,
      phone: data.phone?.trim() || "",
      location: data.location.trim(),
      latitude: data.latitude || 37.7749,
      longitude: data.longitude || -122.4194,
      role: "USER" as Role,
      createdAt: now,
      updatedAt: now,
    };
    memoryStore.users.push(newUser);
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
      phone: newUser.phone,
      location: newUser.location,
      latitude: newUser.latitude,
      longitude: newUser.longitude,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
  }
}

export async function getAllUsers(): Promise<UserSummary[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      phone: u.phone,
      location: u.location,
      latitude: u.latitude,
      longitude: u.longitude,
      role: u.role,
      createdAt: u.createdAt,
    }));
  } catch {
    return memoryStore.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      phone: u.phone,
      location: u.location,
      latitude: u.latitude,
      longitude: u.longitude,
      role: u.role,
      createdAt: u.createdAt,
    }));
  }
}

export async function updateUserRole(userId: string, newRole: Role) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  } catch {
    const user = memoryStore.users.find((u) => u.id === userId);
    if (user) user.role = newRole;
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string; location?: string; avatarUrl?: string }
) {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.phone !== undefined && { phone: data.phone.trim() }),
        ...(data.location && { location: data.location.trim() }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
    });
    return updated;
  } catch {
    const user = memoryStore.users.find((u) => u.id === userId);
    if (user) {
      if (data.name) user.name = data.name.trim();
      if (data.phone !== undefined) user.phone = data.phone.trim();
      if (data.location) user.location = data.location.trim();
      if (data.avatarUrl) user.avatarUrl = data.avatarUrl;
      return user;
    }
    return null;
  }
}
