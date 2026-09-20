"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProductType, ProviderProfileType, ConversationType, ReviewType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  Star,
  MessageSquare,
  Bookmark,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  ExternalLink,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "provider" | "reviews">("overview");

  // Dashboard Data
  const [myListings, setMyListings] = useState<ProductType[]>([]);
  const [myProviderProfile, setMyProviderProfile] = useState<ProviderProfileType | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [savedCount, setSavedCount] = useState({ providers: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  // Edit provider modal / inline form states
  const [providerBio, setProviderBio] = useState("");
  const [providerSkills, setProviderSkills] = useState("");
  const [providerAvailability, setProviderAvailability] = useState("");
  const [updatingProvider, setUpdatingProvider] = useState(false);
  const [providerUpdateSuccess, setProviderUpdateSuccess] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user's listings
      const listRes = await fetch("/api/marketplace");
      if (listRes.ok) {
        const listData = await listRes.json();
        const mine = (listData.products || []).filter(
          (p: ProductType) => p.sellerId === user?.id
        );
        setMyListings(mine);
      }

      // 2. Fetch provider profile if provider
      if (user?.role === "PROVIDER" || user?.id) {
        const provRes = await fetch(`/api/providers/${user?.id}`);
        if (provRes.ok) {
          const provData = await provRes.json();
          if (provData.provider) {
            setMyProviderProfile(provData.provider);
            setProviderBio(provData.provider.bio || "");
            setProviderSkills((provData.provider.skills || []).join(", "));
            setProviderAvailability(provData.provider.availability || "");
          }
        }
      }

      // 3. Fetch conversations
      const convRes = await fetch("/api/messages/conversations");
      if (convRes.ok) {
        const convData = await convRes.json();
        setConversations(convData.conversations || []);
      }

      // 4. Fetch saved count
      const savedRes = await fetch("/api/saved");
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedCount({
          providers: savedData.providers?.length || 0,
          products: savedData.products?.length || 0,
        });
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleUpdateProductStatus = async (productId: string, newStatus: "ACTIVE" | "SOLD" | "REMOVED") => {
    try {
      const res = await fetch(`/api/marketplace/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMyListings((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
        );
      }
    } catch {
      // silent
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      const res = await fetch(`/api/marketplace/${productId}`, { method: "DELETE" });
      if (res.ok) {
        setMyListings((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch {
      // silent
    }
  };

  const handleSaveProviderProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProviderProfile) return;
    setUpdatingProvider(true);
    setProviderUpdateSuccess(false);

    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession: myProviderProfile.profession,
          bio: providerBio,
          experienceYears: myProviderProfile.experienceYears,
          skills: providerSkills,
          location: myProviderProfile.location,
          availability: providerAvailability,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMyProviderProfile(data.profile);
        setProviderUpdateSuccess(true);
        setTimeout(() => setProviderUpdateSuccess(false), 3000);
      }
    } catch {
      // silent
    } finally {
      setUpdatingProvider(false);
    }
  };

  if (authLoading || (loading && !user)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatarUrl ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
            }
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <Badge variant={user?.role === "ADMIN" ? "rose" : user?.role === "PROVIDER" ? "emerald" : "slate"}>
                {user?.role}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user?.location || "Local Neighbor"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/sell">
            <Button variant="outline" size="sm" icon={<PlusCircle className="w-4 h-4 text-emerald-600" />}>
              Sell Item
            </Button>
          </Link>
          {!myProviderProfile && (
            <Link href="/become-provider">
              <Button size="sm">Become a Provider</Button>
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin">
              <Button variant="secondary" size="sm" icon={<Shield className="w-4 h-4" />}>
                Admin Console
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "listings"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Listings ({myListings.length})</span>
        </button>

        {myProviderProfile && (
          <button
            type="button"
            onClick={() => setActiveTab("provider")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "provider"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>My Provider Profile</span>
          </button>
        )}

        {myProviderProfile && (
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "reviews"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({myProviderProfile.reviews?.length || 0})</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Listings
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {myListings.filter((l) => l.status === "ACTIVE").length}
              </div>
              <Link href="/sell" className="text-xs text-emerald-600 font-semibold hover:underline mt-2 inline-block">
                + Create new listing
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Messages / Chats
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {conversations.length}
              </div>
              <Link href="/messages" className="text-xs text-emerald-600 font-semibold hover:underline mt-2 inline-block">
                Open messages
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Saved Bookmarks
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {savedCount.providers + savedCount.products}
              </div>
              <Link href="/saved" className="text-xs text-emerald-600 font-semibold hover:underline mt-2 inline-block">
                View saved items
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Provider Status
              </span>
              <div className="text-lg font-bold text-slate-900 mt-2">
                {myProviderProfile ? myProviderProfile.profession : "Customer"}
              </div>
              {myProviderProfile ? (
                <Link
                  href={`/providers/${myProviderProfile.id}`}
                  className="text-xs text-emerald-600 font-semibold hover:underline mt-2 inline-block"
                >
                  View public profile
                </Link>
              ) : (
                <Link
                  href="/become-provider"
                  className="text-xs text-emerald-600 font-semibold hover:underline mt-2 inline-block"
                >
                  Become a provider
                </Link>
              )}
            </div>
          </div>

          {/* Recent Conversations Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Recent Conversations</h3>
              <Link href="/messages" className="text-xs font-semibold text-emerald-600 hover:underline">
                View all chats
              </Link>
            </div>

            {conversations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center italic">
                No active conversations yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {conversations.slice(0, 3).map((c) => {
                  const other = c.participants.find((p) => p.userId !== user?.id)?.user;
                  return (
                    <Link
                      key={c.id}
                      href={`/messages?id=${c.id}`}
                      className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            other?.avatarUrl ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                          }
                          alt=""
                          className="w-10 h-10 rounded-2xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{other?.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{c.lastMessage?.content}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {c.lastMessage && new Date(c.lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MY LISTINGS */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Second-Hand Listings</h2>
              <p className="text-xs text-slate-500">Manage listing availability or mark items as sold.</p>
            </div>
            <Link href="/sell">
              <Button size="sm" icon={<PlusCircle className="w-4 h-4" />}>
                List New Item
              </Button>
            </Link>
          </div>

          {myListings.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="You haven't listed any items yet"
              description="Declutter your home! Sell phones, laptops, tools, or furniture locally to neighbors."
              actionLabel="List Your First Item"
              actionHref="/sell"
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm divide-y divide-slate-100">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images?.[0]?.imageUrl || "/placeholder.jpg"}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/marketplace/${item.id}`}
                          className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <Badge
                          variant={
                            item.status === "ACTIVE"
                              ? "emerald"
                              : item.status === "SOLD"
                              ? "slate"
                              : "rose"
                          }
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                        ${item.price} • <span className="text-xs font-normal text-slate-500">{item.category} ({item.condition})</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === "ACTIVE" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProductStatus(item.id, "SOLD")}
                      >
                        Mark as Sold
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProductStatus(item.id, "ACTIVE")}
                      >
                        Mark as Active
                      </Button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. MY PROVIDER PROFILE */}
      {activeTab === "provider" && myProviderProfile && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {myProviderProfile.profession} Profile Settings
              </h2>
              <p className="text-xs text-slate-500">
                Keep your credentials, availability, and skills updated for clients.
              </p>
            </div>
            <Link href={`/providers/${myProviderProfile.id}`}>
              <Button variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                View Public Profile
              </Button>
            </Link>
          </div>

          {providerUpdateSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              ✓ Provider profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveProviderProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Availability Status
              </label>
              <input
                type="text"
                value={providerAvailability}
                onChange={(e) => setProviderAvailability(e.target.value)}
                placeholder="e.g. Available Daily, Weekends Only"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Skills & Specialties (comma separated)
              </label>
              <input
                type="text"
                value={providerSkills}
                onChange={(e) => setProviderSkills(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Bio & Craftsmanship Details
              </label>
              <textarea
                rows={4}
                value={providerBio}
                onChange={(e) => setProviderBio(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
              />
            </div>

            <Button type="submit" size="md" loading={updatingProvider}>
              Save Profile Changes
            </Button>
          </form>
        </div>
      )}

      {/* 4. REVIEWS RECEIVED */}
      {activeTab === "reviews" && myProviderProfile && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Customer Reviews Received</h2>
            <p className="text-xs text-slate-500">
              Verified feedback from local neighborhood clients.
            </p>
          </div>

          {!myProviderProfile.reviews || myProviderProfile.reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              No reviews received yet. Deliver great service to get your first 5-star rating!
            </p>
          ) : (
            <div className="space-y-4 divide-y divide-slate-100">
              {myProviderProfile.reviews.map((rev) => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {rev.reviewer?.name || "Client"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={rev.rating} showNumber={false} size="sm" />
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
