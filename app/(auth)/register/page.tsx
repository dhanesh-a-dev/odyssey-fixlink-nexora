"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { User, Mail, Lock, MapPin, Phone, Eye, EyeOff, Wrench, ShieldCheck, Check } from "lucide-react";

const PROFESSIONS = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Mechanic",
  "AC Technician",
  "Appliance Technician",
  "Cleaner",
  "Handyman",
  "Roofer",
  "General Contractor",
  "Landscaper",
  "Locksmith",
  "Pest Control",
  "Other Professional",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [role, setRole] = useState<"USER" | "PROVIDER">("USER");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phone: "",
    profession: "Electrician",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      location: formData.location,
      phone: formData.phone,
      role,
      profession: role === "PROVIDER" ? formData.profession : undefined,
    });

    if (res.success) {
      success(
        role === "PROVIDER"
          ? `Welcome to FixLink! Your professional ${formData.profession} profile has been created.`
          : "Welcome to FixLink! Your account has been created."
      );
      router.push("/dashboard");
    } else {
      const msg = res.error || "Registration failed";
      setError(msg);
      toastError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Join FixLink
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            The digital bridge connecting you to trusted local experts instantly.
          </p>
        </div>

        {/* Role Segmented Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            I am joining FixLink to:
          </label>
          <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                role === "USER"
                  ? "bg-white text-emerald-700 shadow-sm shadow-slate-200 border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Hire & Discover</span>
              {role === "USER" && <Check className="w-3 h-3 text-emerald-600" />}
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                role === "PROVIDER"
                  ? "bg-white text-emerald-700 shadow-sm shadow-slate-200 border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Offer Services</span>
              {role === "PROVIDER" && <Check className="w-3 h-3 text-emerald-600" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 text-center">
            {role === "USER"
              ? "Hire trusted professionals, request estimates, and browse community marketplace."
              : "Get hired by local clients, showcase your portfolio, and receive direct inquiries."}
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Profession Selection (if Provider) */}
          {role === "PROVIDER" && (
            <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
                Primary Trade / Profession
              </label>
              <div className="relative">
                <Wrench className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <select
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {PROFESSIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                A public verified provider profile will be generated automatically for you.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-500" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Neighborhood / City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Oakridge, Downtown, or West End"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <Button type="submit" size="md" className="w-full mt-2" loading={loading}>
            {role === "PROVIDER" ? "Create Service Provider Account" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
