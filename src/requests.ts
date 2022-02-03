import axios from 'axios';
import { ItemSearchResult } from 'tarki-definitions';

const client = axios.create({
  baseURL: 'https://tarki-api.herokuapp.com',
});

export const searchItems = async (
  query: string,
): Promise<ItemSearchResult[]> => {
  const request = await client.get(`/items/${query}`);
  return request.data;
};
