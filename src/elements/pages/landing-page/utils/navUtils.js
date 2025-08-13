import * as XLSX from 'xlsx';

// Debounce function for search
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Safe data conversion
export const safeToString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

// Data loader with error handling
export const loadEventsData = async () => {
  try {
    const response = await fetch('data/events.xlsx');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert all values to strings and handle empty cells
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // Get formatted strings
      defval: '', // Default value for empty cells
      blankrows: false // Skip empty rows
    });
    
    return jsonData.map(item => {
      const processed = {};
      for (const key in item) {
        processed[key] = safeToString(item[key]);
      }
      return processed;
    });
  } catch (error) {
    console.error('Error loading XLSX data:', error);
    return []; // Return empty array as fallback
  }
};

// Section detector with error handling
export const detectPageSections = () => {
  try {
    const sections = Array.from(document.querySelectorAll('section[id]')).map(section => ({
      id: section.id,
      name: section.id
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    }));
    return sections;
  } catch (error) {
    console.error('Error detecting sections:', error);
    return [];
  }
};