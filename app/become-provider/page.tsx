"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  Wrench,
  Briefcase,
  MapPin,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";

export default function BecomeProviderPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    profession: "Electrician",
    bio: "",
    experienceYears: 3,
    skills: "",
    location: user?.location || "",
    availability: "Available Weekdays",
  });

  const [portfolioItems, setPortfolioItems] = useState<
    { title: string; description: string; imageUrl: string }[]
  >([
    {
      title: "Recent Project 1",
      description: "Installation and repair for a residential client.",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const PROFESSIONS = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Painter",
    "Mechanic",
    "AC Technician",
    "Appliance Technician",
    "Cleaner",
    "General Handyman",
    "Locksmith",
    "Roofer",
  ];

  const handleAddPortfolio = () => {
    setPortfolioItems([
      ...portfolioItems,
      {
        title: "",
        description: "",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
      },
    ]);
  };

  const handleRemovePortfolio = (index: number) => {
    setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
  };

  const handlePortfolioChange = (
    index: number,
    field: "title" | "description" | "imageUrl",
    value: string
  ) => {
    const updated = [...portfolioItems];
    updated[index][field] = value;
    setPortfolioItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    if (!formData.profession || !formData.location) {
      setError("Please fill in your profession and location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession: formData.profession,
          bio: formData.bio,
          experienceYears: Number(formData.experienceYears) || 0,
          skills: formData.skills,
          location: formData.location,
          availability: formData.availability,
          portfolioItems: portfolioItems.filter((p) => p.title.trim() && p.imageUrl.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create provider profile");
        return;
      }

      await refreshUser();
      router.push(`/providers/${data.profile.id}`);
    } catch {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8 sm:p-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Offer Your Services Locally
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Create your LinkedIn-style professional profile on FixLink. Showcase previous work, gain verified neighborhood reviews, and receive direct client messages.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profession Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Primary Trade / Profession
            </label>
            <select
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              {PROFESSIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Years of Experience & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="60"
                  required
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceYears: Number(e.target.value) })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Availability Schedule
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Available Mon-Fri, Weekends only"
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Service Area / Locality
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Oakridge District, Downtown Metro"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Skills tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Skills & Specialties
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Separate your skills with commas (e.g. &quot;Panel Upgrades, EV Charger, Emergency Rewiring&quot;)
            </p>
            <input
              type="text"
              placeholder="e.g. Copper repiping, Leak detection, Drain snaking"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              About & Credentials
            </label>
            <textarea
              rows={4}
              placeholder="Describe your background, craftsmanship, tools, guarantee, and client approach..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
            />
          </div>

          {/* Portfolio Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Previous Work Portfolio</h3>
                <p className="text-[11px] text-slate-400">Add photos of past projects to inspire confidence.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPortfolio}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {portfolioItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Project #{index + 1}</span>
                    {portfolioItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolio(index)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Project title (e.g. 200A Panel Upgrade)"
                      value={item.title}
                      onChange={(e) => handlePortfolioChange(index, "title", e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-600"
                    />
                    <input
                      type="url"
                      placeholder="Image URL (Unsplash or direct image link)"
                      value={item.imageUrl}
                      onChange={(e) => handlePortfolioChange(index, "imageUrl", e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Short description of the work performed..."
                    value={item.description}
                    onChange={(e) => handlePortfolioChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full mt-4" loading={loading}>
            Publish Provider Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
