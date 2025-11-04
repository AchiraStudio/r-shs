import axiosInstance from './axiosInstance';

// ⚡ In-memory cache untuk registration data
let registrationCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 menit (lebih pendek karena data sering berubah)

/**
 * Get registration data dengan caching
 * @returns {Promise<Array>} List of registrations
 */
export const getRegistrationData = async () => {
  try {
    // ⚡ Check cache dulu
    const now = Date.now();
    if (registrationCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('✅ Using cached registration data');
      return registrationCache;
    }

    console.log('🔄 Fetching fresh registration data...');
    const response = await axiosInstance.get('/registrationdata', {
      timeout: 10000,
      headers: {
        'Accept-Encoding': 'gzip, deflate'
      }
    });

    // ⚡ Update cache
    registrationCache = response.data;
    cacheTimestamp = now;

    return response.data;
  } catch (error) {
    console.error('Failed to fetch registration data:', error);
    
    // ⚡ Return cache jika ada, meski expired
    if (registrationCache) {
      console.log('⚠️ Using expired cache due to error');
      return registrationCache;
    }
    
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Clear registration cache
 */
export const clearRegistrationCache = () => {
  registrationCache = null;
  cacheTimestamp = null;
  console.log('🗑️ Registration cache cleared');
};

/**
 * Submit registration dengan file upload
 * @param {FormData} formData - Form data with files
 * @returns {Promise<Object>} Registration result with snap_token
 */
export const submitRegistration = async (formData) => {
  try {
    console.log('📤 Submitting registration...');
    
    const response = await axiosInstance.post('/registrationdata', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // ⚡ Timeout lebih lama untuk upload file
      timeout: 60000, // 60 detik
      
      // ⚡ Progress tracking
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });

    // ⚡ Clear cache setelah registrasi baru
    clearRegistrationCache();

    return response.data;
  } catch (error) {
    console.error('Registration submission failed:', error);
    
    // ⚡ Better error message
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Registration failed');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('Failed to submit registration: ' + error.message);
    }
  }
};