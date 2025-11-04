const API_BASE_URL = 'http://localhost:5001'; // Your Flask backend URL

class CompetitionApi {
  static async getAllCompetitions() {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions`);
      if (!response.ok) {
        throw new Error('Failed to fetch competitions');
      }
      const data = await response.json();
      return data.competitions;
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error;
    }
  }

  static async createCompetition(competitionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create competition');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating competition:', error);
      throw error;
    }
  }

  static async updateCompetition(id, competitionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update competition');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating competition:', error);
      throw error;
    }
  }

  static async deleteCompetition(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete competition');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error deleting competition:', error);
      throw error;
    }
  }
}

export default CompetitionApi;