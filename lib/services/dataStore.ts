import {
  initialMockUsers,
  initialMockProfiles,
  initialMockPortfolioItems,
  initialMockReviews,
  initialMockProducts,
  initialMockConversations,
  initialMockMessages,
  initialMockSavedProviders,
  initialMockSavedProducts,
  initialMockReports,
  MockUser,
  MockProviderProfile,
  MockPortfolioItem,
  MockReview,
  MockProduct,
  MockConversation,
  MockMessage,
  MockSavedProvider,
  MockSavedProduct,
  MockReport,
} from "./mockData";

// Global in-memory singleton store for zero-database development / fallback
const globalStore = globalThis as unknown as {
  __fixlinkStore?: {
    users: MockUser[];
    profiles: MockProviderProfile[];
    portfolios: MockPortfolioItem[];
    reviews: MockReview[];
    products: MockProduct[];
    conversations: MockConversation[];
    messages: MockMessage[];
    savedProviders: MockSavedProvider[];
    savedProducts: MockSavedProduct[];
    reports: MockReport[];
  };
};

if (!globalStore.__fixlinkStore) {
  globalStore.__fixlinkStore = {
    users: [...initialMockUsers],
    profiles: [...initialMockProfiles],
    portfolios: [...initialMockPortfolioItems],
    reviews: [...initialMockReviews],
    products: [...initialMockProducts],
    conversations: [...initialMockConversations],
    messages: [...initialMockMessages],
    savedProviders: [...initialMockSavedProviders],
    savedProducts: [...initialMockSavedProducts],
    reports: [...initialMockReports],
  };
}

export const memoryStore = globalStore.__fixlinkStore;
