import axiosInstance from './axiosInstance';

// ⚡ In-memory cache untuk competitions
let competitionsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

/**
 * Get competitions dengan caching
 * @returns {Promise<Array>} List of competitions
 */
export const getCompetitions = async () => {
  try {
    // ⚡ Check cache dulu
    const now = Date.now();
    if (competitionsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('✅ Using cached competitions data');
      return competitionsCache;
    }

    console.log('🔄 Fetching fresh competitions data...');
    const response = await axiosInstance.get('/competitions', {
      // ⚡ Set timeout lebih pendek untuk fail fast
      timeout: 10000,
      
    });

    // ⚡ Update cache
    competitionsCache = response.data;
    cacheTimestamp = now;

    return response.data;
  } catch (error) {
    console.error('Failed to fetch competitions:', error);
    
    // ⚡ Return cache jika ada, meski expired
    if (competitionsCache) {
      console.log('⚠️ Using expired cache due to error');
      return competitionsCache;
    }
    
    throw error;
  }
};

/**
 * Clear competitions cache
 */
export const clearCompetitionsCache = () => {
  competitionsCache = null;
  cacheTimestamp = null;
  console.log('🗑️ Competitions cache cleared');
};

/**
 * Create new competition
 * @param {Object} competitionData - Competition data
 * @returns {Promise<Object>} Created competition
 */
export const createCompetition = async (competitionData) => {
  try {
    const response = await axiosInstance.post('/competitions', competitionData);
    
    // ⚡ Clear cache setelah create
    clearCompetitionsCache();
    
    return response.data;
  } catch (error) {
    console.error('Failed to create competition:', error);
    throw error;
  }
};

/**
 * Update competition
 * @param {number} id - Competition ID
 * @param {Object} competitionData - Updated data
 * @returns {Promise<Object>} Updated competition
 */
export const updateCompetition = async (id, competitionData) => {
  try {
    const response = await axiosInstance.put(`/competitions/${id}`, competitionData);
    
    // ⚡ Clear cache setelah update
    clearCompetitionsCache();
    
    return response.data;
  } catch (error) {
    console.error('Failed to update competition:', error);
    throw error;
  }
};

/**
 * Delete competition
 * @param {number} id - Competition ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteCompetition = async (id) => {
  try {
    const response = await axiosInstance.delete(`/competitions/${id}`);
    
    // ⚡ Clear cache setelah delete
    clearCompetitionsCache();
    
    return response.data;
  } catch (error) {
    console.error('Failed to delete competition:', error);
    throw error;
  }
};