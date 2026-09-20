/**
 * Server-side validation functions for FixLink
 */

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRegistration(data: {
  name?: string;
  email?: string;
  password?: string;
  location?: string;
  phone?: string;
}): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters long." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({ field: "email", message: "A valid email address is required." });
  }

  if (!data.password || data.password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters long." });
  }

  if (!data.location || data.location.trim().length < 2) {
    errors.push({ field: "location", message: "Location/city is required." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateLogin(data: {
  email?: string;
  password?: string;
}): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.email || !data.email.includes("@")) {
    errors.push({ field: "email", message: "Please provide a valid email." });
  }

  if (!data.password) {
    errors.push({ field: "password", message: "Password is required." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateProviderProfile(data: {
  profession?: string;
  bio?: string;
  experienceYears?: number;
  skills?: string[] | string;
  location?: string;
  availability?: string;
}): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.profession || data.profession.trim().length < 2) {
    errors.push({ field: "profession", message: "Profession is required." });
  }

  if (!data.location || data.location.trim().length < 2) {
    errors.push({ field: "location", message: "Location is required." });
  }

  if (data.experienceYears !== undefined && data.experienceYears < 0) {
    errors.push({ field: "experienceYears", message: "Experience years cannot be negative." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateProduct(data: {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  condition?: string;
  location?: string;
  imageUrls?: string[];
}): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push({ field: "title", message: "Title must be at least 3 characters long." });
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push({ field: "description", message: "Description must be at least 10 characters long." });
  }

  if (data.price === undefined || data.price < 0 || isNaN(data.price)) {
    errors.push({ field: "price", message: "Please enter a valid price." });
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: "category", message: "Category is required." });
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.push({ field: "location", message: "Location is required." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateReview(data: {
  providerId?: string;
  rating?: number;
  comment?: string;
}): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.providerId) {
    errors.push({ field: "providerId", message: "Target provider is required." });
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push({ field: "rating", message: "Rating must be an integer between 1 and 5 stars." });
  }

  if (!data.comment || data.comment.trim().length < 5) {
    errors.push({ field: "comment", message: "Review comment must be at least 5 characters long." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateMessage(data: {
  content?: string;
  conversationId?: string;
  recipientId?: string;
}): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.content || data.content.trim().length === 0) {
    errors.push({ field: "content", message: "Message cannot be empty." });
  }

  if (!data.conversationId && !data.recipientId) {
    errors.push({ field: "target", message: "Recipient or conversation ID is required." });
  }

  return { valid: errors.length === 0, errors };
}

export function validateReport(data: {
  targetType?: string;
  targetId?: string;
  reason?: string;
}): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.targetType || !["USER", "PRODUCT", "REVIEW"].includes(data.targetType)) {
    errors.push({ field: "targetType", message: "Invalid target type." });
  }

  if (!data.targetId) {
    errors.push({ field: "targetId", message: "Target ID is required." });
  }

  if (!data.reason || data.reason.trim().length < 5) {
    errors.push({ field: "reason", message: "Please provide a clear reason (min 5 chars)." });
  }

  return { valid: errors.length === 0, errors };
}
