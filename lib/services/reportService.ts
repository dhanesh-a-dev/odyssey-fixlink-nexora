import prisma from "@/lib/db/prisma";
import { memoryStore } from "./dataStore";
import { ReportStatus, ReportTargetType, ReportType } from "@/types";

export async function createReport(
  reporterId: string,
  data: {
    targetType: ReportTargetType;
    targetId: string;
    reason: string;
  }
): Promise<ReportType> {
  const cleanReason = data.reason.trim();
  const now = new Date();

  try {
    const created = await prisma.report.create({
      data: {
        reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        reason: cleanReason,
        status: "PENDING",
      },
      include: { reporter: true },
    });

    return {
      id: created.id,
      reporterId: created.reporterId,
      targetType: created.targetType,
      targetId: created.targetId,
      reason: created.reason,
      status: created.status,
      createdAt: created.createdAt,
      reporter: {
        id: created.reporter.id,
        name: created.reporter.name,
        email: created.reporter.email,
        avatarUrl: created.reporter.avatarUrl,
        phone: created.reporter.phone,
        location: created.reporter.location,
        latitude: created.reporter.latitude,
        longitude: created.reporter.longitude,
        role: created.reporter.role,
        createdAt: created.reporter.createdAt,
      },
    };
  } catch {
    // Memory store fallback
  }

  const newReport = {
    id: `rep-${Date.now()}`,
    reporterId,
    targetType: data.targetType,
    targetId: data.targetId,
    reason: cleanReason,
    status: "PENDING" as ReportStatus,
    createdAt: now,
  };
  memoryStore.reports.unshift(newReport);

  const reporter = memoryStore.users.find((u) => u.id === reporterId);

  return {
    id: newReport.id,
    reporterId: newReport.reporterId,
    targetType: newReport.targetType,
    targetId: newReport.targetId,
    reason: newReport.reason,
    status: newReport.status,
    createdAt: newReport.createdAt,
    reporter: reporter
      ? {
          id: reporter.id,
          name: reporter.name,
          email: reporter.email,
          avatarUrl: reporter.avatarUrl,
          phone: reporter.phone,
          location: reporter.location,
          latitude: reporter.latitude,
          longitude: reporter.longitude,
          role: reporter.role,
          createdAt: reporter.createdAt,
        }
      : undefined,
  };
}

export async function getAllReports(): Promise<ReportType[]> {
  try {
    const reports = await prisma.report.findMany({
      include: { reporter: true },
      orderBy: { createdAt: "desc" },
    });
    if (reports.length > 0) {
      return reports.map((r) => ({
        id: r.id,
        reporterId: r.reporterId,
        targetType: r.targetType,
        targetId: r.targetId,
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt,
        reporter: {
          id: r.reporter.id,
          name: r.reporter.name,
          email: r.reporter.email,
          avatarUrl: r.reporter.avatarUrl,
          phone: r.reporter.phone,
          location: r.reporter.location,
          latitude: r.reporter.latitude,
          longitude: r.reporter.longitude,
          role: r.reporter.role,
          createdAt: r.reporter.createdAt,
        },
      }));
    }
  } catch {
    // Database query failed
  }

  return memoryStore.reports.map((r) => {
    const reporter = memoryStore.users.find((u) => u.id === r.reporterId);
    return {
      id: r.id,
      reporterId: r.reporterId,
      targetType: r.targetType,
      targetId: r.targetId,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt,
      reporter: reporter
        ? {
            id: reporter.id,
            name: reporter.name,
            email: reporter.email,
            avatarUrl: reporter.avatarUrl,
            phone: reporter.phone,
            location: reporter.location,
            latitude: reporter.latitude,
            longitude: reporter.longitude,
            role: reporter.role,
            createdAt: reporter.createdAt,
          }
        : undefined,
    };
  });
}

export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus
) {
  try {
    await prisma.report.update({
      where: { id: reportId },
      data: { status: newStatus },
    });
    return true;
  } catch {
    const rep = memoryStore.reports.find((r) => r.id === reportId);
    if (rep) rep.status = newStatus;
    return true;
  }
}

export async function getAdminStats() {
  try {
    const [userCount, providerCount, productCount, reviewCount, pendingReportCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.providerProfile.count(),
        prisma.product.count({ where: { status: "ACTIVE" } }),
        prisma.review.count(),
        prisma.report.count({ where: { status: "PENDING" } }),
      ]);
    return {
      totalUsers: userCount,
      totalProviders: providerCount,
      activeListings: productCount,
      totalReviews: reviewCount,
      pendingReports: pendingReportCount,
    };
  } catch {
    return {
      totalUsers: memoryStore.users.length,
      totalProviders: memoryStore.profiles.length,
      activeListings: memoryStore.products.filter((p) => p.status === "ACTIVE").length,
      totalReviews: memoryStore.reviews.length,
      pendingReports: memoryStore.reports.filter((r) => r.status === "PENDING").length,
    };
  }
}
