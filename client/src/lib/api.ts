import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface DataItem {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

/**
 * Fetches all data items from the API
 */
export const fetchAllData = async (): Promise<DataItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

/**
 * Creates a new data item
 */
export const createData = async (data: { title: string; description: string }): Promise<DataItem | null> => {
  try {
    const response = await axios.post(`${API_URL}/data`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating data:', error);
    return null;
  }
};
