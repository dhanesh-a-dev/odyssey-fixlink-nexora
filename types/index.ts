export type Role = "USER" | "PROVIDER" | "ADMIN";

export type ProductCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";

export type ProductStatus = "ACTIVE" | "SOLD" | "REMOVED";

export type ReportTargetType = "USER" | "PRODUCT" | "REVIEW";

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  role: Role;
  createdAt: string | Date;
}

export interface PortfolioItemType {
  id: string;
  providerId: string;
  title: string;
  description: string | null;
  imageUrl: string;
  createdAt: string | Date;
}

export interface ReviewType {
  id: string;
  providerId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  reviewer?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface ProviderProfileType {
  id: string;
  userId: string;
  profession: string;
  bio: string | null;
  experienceYears: number;
  skills: string[]; // parsed array
  location: string;
  latitude: number | null;
  longitude: number | null;
  availability: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: UserSummary;
  portfolio?: PortfolioItemType[];
  averageRating?: number;
  reviewCount?: number;
  reviews?: ReviewType[];
  isSaved?: boolean;
}

export interface ProductImageType {
  id: string;
  productId: string;
  imageUrl: string;
}

export interface ProductType {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ProductCondition;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: ProductStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  seller?: UserSummary;
  images: ProductImageType[];
  isSaved?: boolean;
}

export interface MessageType {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string | Date;
  readAt: string | Date | null;
  sender?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface ConversationType {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  participants: {
    userId: string;
    user: UserSummary;
  }[];
  lastMessage?: MessageType | null;
  unreadCount?: number;
}

export interface SavedItemType {
  id: string;
  savedAt: string | Date;
  type: "PROVIDER" | "PRODUCT";
  provider?: ProviderProfileType;
  product?: ProductType;
}

export interface ReportType {
  id: string;
  reporterId: string;
  reporter?: UserSummary;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string | Date;
  targetTitle?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: Role;
}
