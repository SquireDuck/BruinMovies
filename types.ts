// types.ts
export interface Movie {
    title: string;
    year: number | string;
    rating: number | null;
    poster?: string; // Optional field if you plan to include poster URLs
  }
  
  export interface WatchlistResponse {
    count: number;
    movies: Movie[];
  }
  
  export interface ApiError {
    error: string;
  }
  