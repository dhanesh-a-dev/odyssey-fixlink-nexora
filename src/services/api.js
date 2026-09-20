import { professionals as mockPros, marketplaceItems as mockItems } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


/**
 * Helper to build auth headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('fixlink_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Authentication APIs
 */
export const authApi = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Session expired');
    return data;
  },
};

/**
 * Service Providers APIs (with mock fallback)
 */
export const providerApi = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.profession && params.profession !== 'All') query.append('profession', params.profession);
      if (params.location) query.append('location', params.location);
      if (params.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE_URL}/providers?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          // Normalize to match frontend expected fields
          return data.data.map((p) => ({
            id: p.userId || p.id,
            name: p.name,
            category: p.profession,
            rating: p.averageRating || 5.0,
            reviews: p.totalReviews || 0,
            hourlyRate: 350,
            verified: true,
            location: p.location,
            avatar: p.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
            about: p.bio,
            skills: p.skills || [],
            yearsOfExperience: p.experienceYears || 5,
            jobsCompleted: 150,
            portfolioImages: p.portfolioImages || [],
          }));
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using mock data for providers:', err.message);
    }
    return mockPros;
  },

  getById: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/providers/${id}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.data;
        return {
          id: p.userId || p.id,
          name: p.name,
          category: p.profession,
          rating: p.averageRating || 5.0,
          reviews: p.totalReviews || p.reviews?.length || 0,
          hourlyRate: 350,
          verified: true,
          location: p.location,
          avatar: p.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
          about: p.bio,
          skills: p.skills || [],
          yearsOfExperience: p.experienceYears || 5,
          jobsCompleted: 150,
          portfolioImages: p.portfolioImages || [],
          recentReviews: (p.reviews || []).map((r) => ({
            id: r.id,
            user: r.reviewer?.name || 'Customer',
            rating: r.rating,
            text: r.comment,
            date: new Date(r.createdAt).toLocaleDateString(),
          })),
        };
      }
    } catch (err) {
      console.warn('Backend unavailable, using mock data for provider detail:', err.message);
    }
    return mockPros.find((p) => p.id === id) || mockPros[0];
  },
};

/**
 * Reviews APIs
 */
export const reviewApi = {
  create: async ({ providerId, rating, comment }) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ providerId, rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit review');
    return data;
  },
};

/**
 * Marketplace Products APIs (with mock fallback)
 */
export const productApi = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.location) query.append('location', params.location);
      if (params.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          return data.data.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            category: item.category,
            condition: 'Used - Good',
            seller: item.seller?.name || 'Local Seller',
            sellerId: item.sellerId,
            location: item.location,
            image: (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
            postedAt: new Date(item.createdAt).toLocaleDateString(),
            description: item.description,
          }));
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using mock data for products:', err.message);
    }
    return mockItems;
  },

  create: async (productData) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to list product');
    return data;
  },
};

/**
 * Messages APIs
 */
export const messageApi = {
  getConversation: async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/${userId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (err) {
      console.warn('Backend unavailable for messages:', err.message);
    }
    return null;
  },

  sendMessage: async (receiverId, content) => {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiverId, content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  },
};
