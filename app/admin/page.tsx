"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserSummary, ReportType, ProductType, ProviderProfileType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Shield,
  Users,
  AlertTriangle,
  ShoppingBag,
  Wrench,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<{
    totalUsers: number;
    totalProviders: number;
    activeListings: number;
    totalReviews: number;
    pendingReports: number;
  }>({
    totalUsers: 0,
    totalProviders: 0,
    activeListings: 0,
    totalReviews: 0,
    pendingReports: 0,
  });

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "listings">("overview");
  const [usersList, setUsersList] = useState<UserSummary[]>([]);
  const [reportsList, setReportsList] = useState<ReportType[]>([]);
  const [productsList, setProductsList] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // 2. Users
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData.users || []);
      }

      // 3. Reports
      const repRes = await fetch("/api/admin/reports");
      if (repRes.ok) {
        const repData = await repRes.json();
        setReportsList(repData.reports || []);
      }

      // 4. Products
      const prodRes = await fetch("/api/marketplace");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProductsList(prodData.products || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard");
      } else {
        fetchAdminData();
      }
    }
  }, [user, authLoading, router]);

  const handleRoleChange = async (userId: string, newRole: "USER" | "PROVIDER" | "ADMIN") => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch {
      // silent
    }
  };

  const handleReportAction = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });
      if (res.ok) {
        setReportsList((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status } : r))
        );
      }
    } catch {
      // silent
    }
  };

  const handleDeleteListing = async (productId: string) => {
    if (!confirm("Admin: Permanently remove this marketplace listing?")) return;
    try {
      const res = await fetch(`/api/marketplace/${productId}`, { method: "DELETE" });
      if (res.ok) {
        setProductsList((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch {
      // silent
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading admin console...
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Lock className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-500 mt-1">
          Administrator privileges are required to view this moderation portal.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-600" />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              FixLink Moderation Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Community moderation, user role administration, listing removal, and dispute resolution.
          </p>
        </div>

        <Badge variant="rose" size="md">
          Administrator Access
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Users
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalUsers}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Providers
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalProviders}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Active Listings
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.activeListings}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Reviews
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalReviews}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Pending Reports
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {stats.pendingReports}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Reports Queue ({reportsList.filter((r) => r.status === "PENDING").length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          User Directory ({usersList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "listings"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Marketplace Moderation ({productsList.length})
        </button>
      </div>

      {/* 1. REPORTS TAB */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">User Flagged Content Reports</h3>

          {reportsList.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
              No reports filed.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
              {reportsList.map((rep) => (
                <div key={rep.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={rep.status === "PENDING" ? "rose" : "slate"}>
                        {rep.status}
                      </Badge>
                      <span className="text-xs font-bold text-slate-700">
                        Target Type: {rep.targetType}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({rep.targetId})
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      Reason: {rep.reason}
                    </p>
                    <p className="text-xs text-slate-400">
                      Reported by {rep.reporter?.name || "User"} on {new Date(rep.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {rep.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleReportAction(rep.id, "RESOLVED")}
                        icon={<CheckCircle className="w-3.5 h-3.5" />}
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction(rep.id, "DISMISSED")}
                        icon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. USER DIRECTORY TAB */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Registered Users</h3>

          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Joined</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <img
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop"}
                          alt=""
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{u.location}</td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={u.role === "ADMIN" ? "rose" : u.role === "PROVIDER" ? "emerald" : "slate"}
                          size="sm"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                        >
                          <option value="USER">USER</option>
                          <option value="PROVIDER">PROVIDER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCT MODERATION TAB */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Product Listings</h3>

          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
            {productsList.map((prod) => (
              <div key={prod.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.images?.[0]?.imageUrl || "/placeholder.jpg"}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{prod.title}</h4>
                    <p className="text-xs text-slate-500">
                      ${prod.price} • {prod.category} • Seller: {prod.seller?.name}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteListing(prod.id)}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Remove Listing
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
