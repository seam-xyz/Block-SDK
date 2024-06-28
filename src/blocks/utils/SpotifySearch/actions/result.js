import { get } from '../utils/api';
import * as Sentry from "@sentry/react";

export const initiateGetResult = (searchTerm) => {
  return async (tracks) => {
    try {
      const API_URL = `https://api.spotify.com/v1/search?query=${encodeURIComponent(
        searchTerm
      )}&type=track`;
      const result = await get(API_URL);
      return result['tracks'];
    } catch (error) {
      Sentry.captureException(error);
      console.log('error', error);
    }
  };
};
